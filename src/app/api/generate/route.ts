import { NextRequest, NextResponse } from 'next/server';
import { getJob, setJob } from '@/lib/jobStore';
import { textTo3D, getTaskStatus } from '@/lib/tripoApi';

const USE_TRIPO = process.env.USE_TRIPO === 'true';
const TRIPO_API_KEY = process.env.TRIPO_API_KEY;
const COMFYUI_API_URL = process.env.COMFYUI_API_URL;
const COMFYUI_API_KEY = process.env.COMFYUI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, colors, modelType } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const jobId = crypto.randomUUID();

    setJob(jobId, {
      status: 'queued',
      createdAt: new Date(),
    });

    // 选择生成模式
    if (USE_TRIPO && TRIPO_API_KEY) {
      // Tripo3D 模式 - 生成 3D 模型
      processTripoGeneration(jobId, { prompt, style });
    } else if (COMFYUI_API_URL) {
      // ComfyUI 模式
      processComfyUIGeneration(jobId, { prompt, style, colors });
    } else {
      // 模拟生成（演示用）
      simulateGeneration(jobId);
    }

    return NextResponse.json({
      success: true,
      jobId,
      status: 'queued',
    });
  } catch (error) {
    console.error('Generation request failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Tripo3D 3D 模型生成
async function processTripoGeneration(
  jobId: string,
  params: { prompt: string; style?: string }
) {
  try {
    setJob(jobId, { status: 'processing', createdAt: new Date() });

    // 开始 Tripo 任务
    const result = await textTo3D({
      prompt: params.prompt,
      texture: true,
      template: 'realistic',
    });

    if (!result.success || !result.taskId) {
      throw new Error(result.error || 'Tripo3D generation failed');
    }

    // 轮询 Tripo 任务
    await pollTripoJob(jobId, result.taskId);

  } catch (error) {
    console.error('Tripo3D generation failed:', error);
    setJob(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date(),
    });
  }
}

// 轮询 Tripo 任务
async function pollTripoJob(jobId: string, taskId: string) {
  const maxAttempts = 60; // 60 * 10s = 10分钟超时
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const status = await getTaskStatus(taskId);

      if (status.status === 'success') {
        setJob(jobId, {
          status: 'completed',
          images: status.thumbnailUrl ? [status.thumbnailUrl] : [],
          modelUrl: status.modelUrl,
          createdAt: new Date(),
        });
        return;
      }

      if (status.status === 'failed') {
        throw new Error(status.error || 'Tripo3D task failed');
      }

      // 每10秒轮询一次
      await new Promise((resolve) => setTimeout(resolve, 10000));
      attempts++;
    } catch (error) {
      console.error('Polling error:', error);
      attempts++;
    }
  }

  setJob(jobId, {
    status: 'failed',
    error: 'Generation timeout',
    createdAt: new Date(),
  });
}

// ComfyUI 生成
async function processComfyUIGeneration(
  jobId: string,
  params: { prompt: string; style?: string; colors?: string[] }
) {
  try {
    setJob(jobId, { status: 'processing', createdAt: new Date() });

    const response = await fetch(`${COMFYUI_API_URL}/api/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(COMFYUI_API_KEY && { Authorization: `Bearer ${COMFYUI_API_KEY}` }),
      },
      body: JSON.stringify({
        prompt: buildComfyUIPrompt(params),
      }),
    });

    if (!response.ok) {
      throw new Error(`ComfyUI API error: ${response.statusText}`);
    }

    const data = await response.json();
    await pollComfyUIJob(jobId, data.prompt_id);
  } catch (error) {
    console.error('ComfyUI generation failed:', error);
    setJob(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date(),
    });
  }
}

// 构建 ComfyUI prompt
function buildComfyUIPrompt(params: { prompt: string; style?: string; colors?: string[] }) {
  const { prompt } = params;
  
  return {
    "3": {
      "inputs": { "text": prompt },
      "class_type": "CLIPTextEncode",
    },
    "4": {
      "inputs": {
        "model": "dreamshaper_8.safetensors",
        "positive": prompt,
        "negative": "low quality, blurry, distorted, bad anatomy",
      },
      "class_type": "KSampler",
    },
    "5": {
      "inputs": { "width": 512, "height": 512, "samples": 1 },
      "class_type": "SaveImage",
    },
  };
}

// 轮询 ComfyUI 任务
async function pollComfyUIJob(jobId: string, promptId: string) {
  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const historyResponse = await fetch(
        `${COMFYUI_API_URL}/api/history/${promptId}`,
        {
          headers: {
            ...(COMFYUI_API_KEY && { Authorization: `Bearer ${COMFYUI_API_KEY}` }),
          },
        }
      );

      if (historyResponse.ok) {
        const history = await historyResponse.json();
        
        if (history[promptId]?.status?.completed) {
          const outputs = history[promptId].outputs;
          const images = extractImages(outputs);

          setJob(jobId, {
            status: 'completed',
            images,
            createdAt: new Date(),
          });
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    } catch (error) {
      console.error('Polling error:', error);
      attempts++;
    }
  }

  setJob(jobId, {
    status: 'failed',
    error: 'Generation timeout',
    createdAt: new Date(),
  });
}

// 提取 ComfyUI 图片
function extractImages(outputs: any): string[] {
  const images: string[] = [];
  
  for (const nodeId in outputs) {
    const nodeOutput = outputs[nodeId];
    if (nodeOutput.images) {
      for (const image of nodeOutput.images) {
        images.push(`${COMFYUI_API_URL}/view?filename=${image.filename}&type=output`);
      }
    }
  }
  
  return images;
}

// 模拟生成（演示用）
async function simulateGeneration(jobId: string) {
  const delays = [2000, 3000, 2500, 4000, 2000];
  
  for (let i = 0; i < delays.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    console.log(`Job ${jobId}: ${((i + 1) / delays.length) * 100}% complete`);
  }

  const seed = jobId.replace(/-/g, '');
  const mockImages = [
    `https://picsum.photos/seed/${seed}/512/512`,
    `https://picsum.photos/seed/${seed}a/512/512`,
  ];

  setJob(jobId, {
    status: 'completed',
    images: mockImages,
    createdAt: new Date(),
  });
}

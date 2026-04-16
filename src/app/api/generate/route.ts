import { NextRequest, NextResponse } from 'next/server';
import { getJob, setJob } from '@/lib/jobStore';

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

    // 触发生成流程
    processGeneration(jobId, { prompt, style, colors, modelType });

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

// 生成处理
async function processGeneration(
  jobId: string,
  params: { prompt: string; style?: string; colors?: string[]; modelType?: string }
) {
  try {
    setJob(jobId, { status: 'processing', createdAt: new Date() });

    // 如果配置了 ComfyUI，使用真实 API
    if (COMFYUI_API_URL) {
      await generateWithComfyUI(jobId, params);
    } else {
      // 使用模拟生成（演示用）
      await simulateGeneration(jobId, params);
    }
  } catch (error) {
    console.error('Generation failed:', error);
    setJob(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date(),
    });
  }
}

// ComfyUI 生成
async function generateWithComfyUI(
  jobId: string,
  params: { prompt: string; style?: string; colors?: string[]; modelType?: string }
) {
  try {
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
function buildComfyUIPrompt(params: { prompt: string; style?: string; colors?: string[]; modelType?: string }) {
  const { prompt, colors } = params;
  
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
async function simulateGeneration(
  jobId: string, 
  params: { prompt: string; style?: string; colors?: string[] }
) {
  const delays = [2000, 3000, 2500, 4000, 2000];
  
  for (let i = 0; i < delays.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    console.log(`Job ${jobId}: ${((i + 1) / delays.length) * 100}% complete`);
  }

  // 使用 picsum 生成示例图片
  const seed = jobId.replace(/-/g, '');
  const mockImages = [
    `https://picsum.photos/seed/${seed}/512/512`,
    `https://picsum.photos/seed/${seed}a/512/512`,
    `https://picsum.photos/seed/${seed}b/512/512`,
  ];

  setJob(jobId, {
    status: 'completed',
    images: mockImages,
    createdAt: new Date(),
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getJob, setJob } from '@/lib/jobStore';
import { generateOutfitImage, getJobStatus, createVirtualModel, ZMOOutfitGenerationParams } from '@/lib/zmoApi';

const USE_ZMO = process.env.USE_ZMO === 'true';
const ZMO_API_KEY = process.env.ZMO_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, colors, modelType, createModel } = body;

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

    // 如果需要创建虚拟模特
    if (createModel && ZMO_API_KEY) {
      const modelResult = await createVirtualModel({
        gender: modelType || 'female',
        age: 25,
        ethnicity: 'asian',
        height: 168,
        bodyType: 'slim',
      });

      if (!modelResult.success || !modelResult.modelId) {
        // 继续使用默认模特生成
        console.log('ZMO model creation failed, using default model');
      }
    }

    // 使用 ZMO 或模拟生成
    if (USE_ZMO && ZMO_API_KEY) {
      // ZMO API 模式
      processZMOGeneration(jobId, { prompt, style, colors, modelType });
    } else {
      // 模拟生成模式（用于测试）
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

// ZMO AI 生成处理
async function processZMOGeneration(
  jobId: string,
  params: { prompt: string; style?: string; colors?: string[]; modelType?: string }
) {
  try {
    setJob(jobId, { status: 'processing', createdAt: new Date() });

    const result = await generateOutfitImage({
      prompt: params.prompt,
      style: params.style,
      colors: params.colors,
      modelType: params.modelType as 'male' | 'female' | 'neutral' || 'female',
    });

    if (!result.success || !result.jobId) {
      throw new Error(result.error || 'ZMO generation failed');
    }

    // 轮询 ZMO 任务状态
    await pollZMOJob(jobId, result.jobId);

  } catch (error) {
    console.error('ZMO Generation failed:', error);
    setJob(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date(),
    });
  }
}

// 轮询 ZMO 任务
async function pollZMOJob(jobId: string, zmoJobId: string) {
  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const status = await getJobStatus(zmoJobId);

      if (status.status === 'completed' && status.images) {
        setJob(jobId, {
          status: 'completed',
          images: status.images,
          createdAt: new Date(),
        });
        return;
      }

      if (status.status === 'failed') {
        throw new Error(status.error || 'ZMO job failed');
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
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

// 模拟生成（当没有配置 ZMO API 时）
async function simulateGeneration(jobId: string) {
  setJob(jobId, { status: 'processing', createdAt: new Date() });

  const delays = [2000, 3000, 2500, 4000, 2000];
  
  for (let i = 0; i < delays.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    console.log(`Job ${jobId}: ${((i + 1) / delays.length) * 100}% complete`);
  }

  const mockImages = [
    `https://picsum.photos/seed/${jobId}/512/512`,
    `https://picsum.photos/seed/${jobId}-2/512/512`,
  ];

  setJob(jobId, {
    status: 'completed',
    images: mockImages,
    createdAt: new Date(),
  });
}

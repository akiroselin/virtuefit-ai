/**
 * ZMO.AI API Integration
 * 
 * ZMO 提供以下服务：
 * 1. AI Fashion Models - 虚拟时装模特
 * 2. AI Model Generation - 创建 AI 模型
 * 3. Virtual Try-On - 虚拟试穿
 * 
 * API 文档: https://docs.zmo.ai
 */

const ZMO_API_BASE = 'https://api.zmo.ai';
const ZMO_API_KEY = process.env.ZMO_API_KEY;

export interface ZMOOutfitGenerationParams {
  prompt: string;
  modelType?: 'male' | 'female' | 'neutral';
  style?: string;
  colors?: string[];
}

export interface ZMOGenerationResult {
  success: boolean;
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images?: string[];
  modelUrl?: string;
  error?: string;
}

export interface ZMOModelParams {
  gender: 'male' | 'female';
  age?: number;
  ethnicity?: string;
  height?: number;
  bodyType?: 'slim' | 'average' | 'athletic' | 'plus';
}

export interface ZMOModelResult {
  success: boolean;
  modelId?: string;
  modelUrl?: string;
  previewUrl?: string;
  error?: string;
}

/**
 * 创建虚拟模特
 */
export async function createVirtualModel(params: ZMOModelParams): Promise<ZMOModelResult> {
  try {
    const response = await fetch(`${ZMO_API_BASE}/v1/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZMO_API_KEY}`,
      },
      body: JSON.stringify({
        gender: params.gender,
        age: params.age || 25,
        ethnicity: params.ethnicity || 'asian',
        height: params.height || 170,
        body_type: params.bodyType || 'slim',
      }),
    });

    if (!response.ok) {
      throw new Error(`ZMO API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      modelId: data.model_id,
      modelUrl: data.model_url,
      previewUrl: data.preview_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 生成服装穿搭图片
 */
export async function generateOutfitImage(
  params: ZMOOutfitGenerationParams
): Promise<ZMOGenerationResult> {
  try {
    const response = await fetch(`${ZMO_API_BASE}/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZMO_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model_type: params.modelType || 'female',
        style: params.style || 'fashion',
        colors: params.colors || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`ZMO API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      jobId: data.job_id || data.id,
      status: 'pending',
    };
  } catch (error) {
    return {
      success: false,
      jobId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 虚拟试穿
 */
export async function virtualTryOn(
  modelId: string,
  garmentImageUrl: string
): Promise<ZMOGenerationResult> {
  try {
    const response = await fetch(`${ZMO_API_BASE}/v1/tryon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZMO_API_KEY}`,
      },
      body: JSON.stringify({
        model_id: modelId,
        garment_image: garmentImageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`ZMO API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      jobId: data.job_id || data.id,
      status: 'processing',
    };
  } catch (error) {
    return {
      success: false,
      jobId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 查询任务状态
 */
export async function getJobStatus(jobId: string): Promise<ZMOGenerationResult> {
  try {
    const response = await fetch(`${ZMO_API_BASE}/v1/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ZMO_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`ZMO API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      jobId,
      status: data.status,
      images: data.images || data.output_urls,
      modelUrl: data.model_url,
    };
  } catch (error) {
    return {
      success: false,
      jobId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

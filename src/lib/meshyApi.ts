/**
 * Meshy.ai API Integration
 * 
 * Meshy.ai 提供：
 * - Text to 3D Model (文本转3D模型)
 * - Image to 3D Model (图片转3D模型)
 * - 3D Model Texture Generation
 * 
 * API 文档: https://docs.meshy.ai
 * 免费额度: 200 credits/month
 */

const MESHY_API_BASE = 'https://api.meshy.ai';
const MESHY_API_KEY = process.env.MESHY_API_KEY;

export interface MeshyTextTo3DParams {
  prompt: string;
  style?: 'realistics' | 'painted' | 'celestial' | 'abstract' | 'low-poly';
  negativePrompt?: string;
  seed?: number;
}

export interface MeshyImageTo3DParams {
  imageUrl: string;
  style?: 'realistics' | 'painted' | 'celestial' | 'abstract' | 'low-poly';
}

export interface MeshyTaskResult {
  success: boolean;
  taskId?: string;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  modelUrl?: string;
  previewImageUrls?: string[];
  error?: string;
}

/**
 * 文本转3D模型
 */
export async function textTo3D(params: MeshyTextTo3DParams): Promise<MeshyTaskResult> {
  try {
    if (!MESHY_API_KEY) {
      return { success: false, error: 'MESHY_API_KEY not configured' };
    }

    const response = await fetch(`${MESHY_API_BASE}/v1/text-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        style: params.style || 'realistics',
        negative_prompt: params.negativePrompt || 'low quality, blurry, distorted',
        seed: params.seed || -1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.result,
      status: 'PENDING',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 图片转3D模型
 */
export async function imageTo3D(params: MeshyImageTo3DParams): Promise<MeshyTaskResult> {
  try {
    if (!MESHY_API_KEY) {
      return { success: false, error: 'MESHY_API_KEY not configured' };
    }

    const response = await fetch(`${MESHY_API_BASE}/v1/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: params.imageUrl,
        style: params.style || 'realistics',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.result,
      status: 'PENDING',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 查询任务状态
 */
export async function getTaskStatus(taskId: string): Promise<MeshyTaskResult> {
  try {
    if (!MESHY_API_KEY) {
      return { success: false, error: 'MESHY_API_KEY not configured' };
    }

    const response = await fetch(`${MESHY_API_BASE}/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MESHY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.task_id,
      status: data.status,
      modelUrl: data.model_url,
      previewImageUrls: data.preview_image_urls,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 生成纹理
 */
export async function generateTexture(
  modelId: string,
  style: 'realistics' | 'painted' | 'celestial' | 'abstract' = 'realistics'
): Promise<MeshyTaskResult> {
  try {
    if (!MESHY_API_KEY) {
      return { success: false, error: 'MESHY_API_KEY not configured' };
    }

    const response = await fetch(`${MESHY_API_BASE}/v1/texture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: modelId,
        style,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.result,
      status: 'PENDING',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

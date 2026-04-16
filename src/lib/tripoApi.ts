/**
 * Tripo3D API Integration
 * 
 * Tripo3D 提供：
 * - Text to 3D Model (文本转3D模型)
 * - Image to 3D Model (图片转3D模型)
 * - 快速生成，高质量 PBR 材质
 * 
 * API 文档: https://docs.tripo3d.ai
 */

const TRIPO_API_BASE = 'https://api.tripo3d.ai';
const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

export interface TripoTextTo3DParams {
  prompt: string;
  texture: boolean;
  template?: 'realistic' | 'stylized';
}

export interface TripoImageTo3DParams {
  imageUrl: string;
  texture: boolean;
}

export interface TripoTaskResult {
  success: boolean;
  taskId?: string;
  status?: 'pending' | 'processing' | 'success' | 'failed';
  modelUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * 文本转3D模型
 */
export async function textTo3D(params: TripoTextTo3DParams): Promise<TripoTaskResult> {
  try {
    if (!TRIPO_API_KEY) {
      return { success: false, error: 'TRIPO_API_KEY not configured' };
    }

    const response = await fetch(`${TRIPO_API_BASE}/v1/text-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRIPO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        texture: params.texture ?? true,
        template: params.template || 'realistic',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Tripo3D API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.data?.task_id,
      status: 'pending',
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
export async function imageTo3D(params: TripoImageTo3DParams): Promise<TripoTaskResult> {
  try {
    if (!TRIPO_API_KEY) {
      return { success: false, error: 'TRIPO_API_KEY not configured' };
    }

    const response = await fetch(`${TRIPO_API_BASE}/v1/image-to-3d`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRIPO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: params.imageUrl,
        texture: params.texture ?? true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Tripo3D API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.data?.task_id,
      status: 'pending',
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
export async function getTaskStatus(taskId: string): Promise<TripoTaskResult> {
  try {
    if (!TRIPO_API_KEY) {
      return { success: false, error: 'TRIPO_API_KEY not configured' };
    }

    const response = await fetch(`${TRIPO_API_BASE}/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TRIPO_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Tripo3D API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      taskId: data.data?.task_id,
      status: data.data?.status,
      modelUrl: data.data?.model_url,
      thumbnailUrl: data.data?.thumbnail_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

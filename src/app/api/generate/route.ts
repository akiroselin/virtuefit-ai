import { NextRequest, NextResponse } from 'next/server';
import { getJob, setJob } from '@/lib/jobStore';

const COMFYUI_API_URL = process.env.COMFYUI_API_URL;
const COMFYUI_API_KEY = process.env.COMFYUI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, colors } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const jobId = crypto.randomUUID();

    // Store job as queued
    setJob(jobId, {
      status: 'queued',
      createdAt: new Date(),
    });

    // Trigger async generation process
    processGeneration(jobId, { prompt, style, colors });

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

// Async generation process
async function processGeneration(
  jobId: string,
  params: { prompt: string; style?: string; colors?: string[] }
) {
  try {
    // Update status to processing
    setJob(jobId, {
      status: 'processing',
      createdAt: new Date(),
    });

    if (!COMFYUI_API_URL) {
      // Simulate ComfyUI when not configured
      await simulateGeneration(jobId);
      return;
    }

    // Call ComfyUI API
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
    
    // Poll for completion
    await pollComfyUIJob(jobId, data.prompt_id);

  } catch (error) {
    console.error('Generation failed:', error);
    setJob(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date(),
    });
  }
}

// Build ComfyUI prompt structure
function buildComfyUIPrompt(params: { prompt: string; style?: string; colors?: string[] }) {
  const { prompt, style, colors } = params;

  // This is a simplified ComfyUI prompt structure
  // In production, you'd have predefined workflows
  return {
    "3": {
      "inputs": {
        "text": prompt,
        "style": style || 'default',
        "colors": colors || [],
      },
      "class_type": "CustomStylePrompt",
    },
    "4": {
      "inputs": {
        "model": " dreamshaper_8.safetensors",
        "positive": prompt,
        "negative": "low quality, blurry, distorted",
      },
      "class_type": "KSampler",
    },
    "5": {
      "inputs": {
        "samples": ["4"],
      },
      "class_type": "KSampler",
    },
  };
}

// Poll ComfyUI for job completion
async function pollComfyUIJob(jobId: string, promptId: string) {
  const maxAttempts = 60; // 60 * 2s = 120s timeout
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

  // Timeout
  setJob(jobId, {
    status: 'failed',
    error: 'Generation timeout',
    createdAt: new Date(),
  });
}

// Extract images from ComfyUI outputs
function extractImages(outputs: any): string[] {
  const images: string[] = [];
  
  // This is a simplified extraction - actual structure depends on your workflow
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

// Simulate generation when ComfyUI is not configured
async function simulateGeneration(jobId: string) {
  const delays = [2000, 3000, 2500, 4000, 2000];
  
  for (let i = 0; i < delays.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, delays[i]));
    
    // Update progress (for demo purposes)
    console.log(`Job ${jobId}: ${((i + 1) / delays.length) * 100}% complete`);
  }

  // Generate mock images
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

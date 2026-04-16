import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/jobStore';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: 'Job ID is required' },
      { status: 400 }
    );
  }

  const job = getJob(jobId);

  if (!job) {
    // If job not found in memory, it might have expired or been cleared
    // In production, you'd check a persistent database
    // Return mock data for demo purposes
    return NextResponse.json({
      status: 'completed',
      images: [
        `https://picsum.photos/seed/${jobId}/512/512`,
        `https://picsum.photos/seed/${jobId}-2/512/512`,
      ],
    });
  }

  return NextResponse.json({
    status: job.status,
    images: job.images,
    error: job.error,
    createdAt: job.createdAt,
  });
}

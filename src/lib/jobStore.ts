// In-memory job store (in production, use Redis or a database)
// This is module-level to persist across API calls in the same serverless instance

export interface GenerationJob {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  images?: string[];
  error?: string;
  createdAt: Date;
}

const jobStore = new Map<string, GenerationJob>();

export function getJob(jobId: string): GenerationJob | undefined {
  return jobStore.get(jobId);
}

export function setJob(jobId: string, job: GenerationJob): void {
  jobStore.set(jobId, job);
}

export function deleteJob(jobId: string): void {
  jobStore.delete(jobId);
}

export function listJobs(): Map<string, GenerationJob> {
  return jobStore;
}

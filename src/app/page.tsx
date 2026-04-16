'use client';

import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import ModelViewer from '@/components/ModelViewer';
import PromptInput from '@/components/PromptInput';
import StylePresets from '@/components/StylePresets';
import GenerationResults from '@/components/GenerationResults';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useStore } from '@/store/useStore';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { currentOutfit, addToHistory } = useStore();

  const handleGenerate = async (prompt: string, style: string, colors: string[]) => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate ComfyUI generation process
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, colors }),
      });

      const data = await response.json();

      if (data.success) {
        // Poll for results
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch(`/api/generate/${data.jobId}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            clearInterval(progressInterval);
            setGenerationProgress(100);
            
            addToHistory({
              id: data.jobId,
              images: statusData.images || [],
              prompt,
              style,
              createdAt: new Date(),
            });

            setTimeout(() => {
              setIsGenerating(false);
              setGenerationProgress(0);
            }, 500);
          } else if (statusData.status === 'failed') {
            clearInterval(pollInterval);
            clearInterval(progressInterval);
            setIsGenerating(false);
            setGenerationProgress(0);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - 3D Viewer */}
          <div className="relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden glass-effect">
            <Suspense fallback={<ModelViewerSkeleton />}>
              <ModelViewer currentOutfit={currentOutfit ?? undefined} />
            </Suspense>
            <ViewerControls />
          </div>

          {/* Right Column - AI Controls */}
          <div className="flex flex-col gap-6">
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
            <StylePresets />
            <GenerationResults />
          </div>
        </div>
      </section>

      {isGenerating && (
        <LoadingOverlay progress={generationProgress} />
      )}
    </main>
  );
}

function ModelViewerSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-dark-purple">
      <div className="skeleton w-64 h-96 rounded-lg" />
    </div>
  );
}

function ViewerControls() {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
      <ControlButton icon="↺" label="Reset" />
      <ControlButton icon="◎" label="Auto Rotate" active />
      <ControlButton icon="☀" label="Lighting" />
      <ControlButton icon="⚙" label="Settings" />
    </div>
  );
}

function ControlButton({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg glass-effect text-sm font-medium
        transition-all duration-200 hover:bg-white/10
        ${active ? 'ring-2 ring-purple-500' : ''}
      `}
      title={label}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

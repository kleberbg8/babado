'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import type { StoryItem } from '@/types'

interface StoryViewerProps {
  stories: StoryItem[]
  initialModelIndex?: number
  onClose: () => void
}

const STORY_DURATION = 5000

export default function StoryViewer({ stories, initialModelIndex = 0, onClose }: StoryViewerProps) {
  const [modelIndex, setModelIndex] = useState(initialModelIndex)
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const elapsedRef = useRef<number>(0)

  const currentModel = stories[modelIndex]
  const currentStory = currentModel?.stories[storyIndex]
  const totalStories = currentModel?.stories.length ?? 0

  const goNext = useCallback(() => {
    if (storyIndex < totalStories - 1) {
      setStoryIndex((i) => i + 1)
      setProgress(0)
      elapsedRef.current = 0
    } else if (modelIndex < stories.length - 1) {
      setModelIndex((i) => i + 1)
      setStoryIndex(0)
      setProgress(0)
      elapsedRef.current = 0
    } else {
      onClose()
    }
  }, [storyIndex, totalStories, modelIndex, stories.length, onClose])

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1)
      setProgress(0)
      elapsedRef.current = 0
    } else if (modelIndex > 0) {
      setModelIndex((i) => i - 1)
      setStoryIndex(0)
      setProgress(0)
      elapsedRef.current = 0
    }
  }, [storyIndex, modelIndex])

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const totalElapsed = elapsedRef.current + (Date.now() - startTimeRef.current)
      const pct = Math.min((totalElapsed / STORY_DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) goNext()
    }, 50)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, storyIndex, modelIndex, goNext])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, goNext, goPrev])

  if (!currentModel || !currentStory) return null

  return (
    <div className="fixed inset-0 z-[9990] bg-black flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      {/* Story Container */}
      <div
        className="relative w-full max-w-sm h-full max-h-[calc(100vh)] mx-auto"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => { elapsedRef.current += Date.now() - startTimeRef.current; setPaused(false) }}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => { elapsedRef.current += Date.now() - startTimeRef.current; setPaused(false) }}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3">
          {currentModel.stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < storyIndex ? '100%' : i === storyIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Model info */}
        <div className="absolute top-8 left-0 right-0 z-10 px-4 pt-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#E91E8C]">
            {currentModel.mainPhoto ? (
              <Image src={currentModel.mainPhoto} alt={currentModel.stageName} width={32} height={32} className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[#201519] flex items-center justify-center text-[#E91E8C] text-xs font-bold">
                {currentModel.stageName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{currentModel.stageName}</p>
            {currentStory.expiresAt && (
              <p className="text-white/60 text-xs">{timeAgo(currentStory.expiresAt)}</p>
            )}
          </div>
          {currentModel.isOnline && (
            <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Online
            </span>
          )}
        </div>

        {/* Media */}
        <div className="absolute inset-0">
          {currentStory.type === 'PHOTO' || currentStory.type === 'STORY' ? (
            <Image
              src={currentStory.url}
              alt="Story"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={currentStory.url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 flex flex-col gap-3">
          <a
            href={`https://wa.me/${currentModel.stageName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-sm bg-[#25D366] text-white font-semibold text-sm shadow-lg"
          >
            Chamar no WhatsApp
          </a>
          <a
            href={`/acompanhante/${currentModel.modelId}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-sm bg-white/10 text-white text-sm font-medium border border-white/20"
          >
            <ExternalLink size={14} />
            Ver perfil completo
          </a>
        </div>

        {/* Navigation zones */}
        <button
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
          onClick={goPrev}
          aria-label="Story anterior"
        />
        <button
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
          onClick={goNext}
          aria-label="Próximo story"
        />
      </div>

      {/* Side navigation */}
      <button
        onClick={() => { setModelIndex((i) => Math.max(0, i - 1)); setStoryIndex(0); setProgress(0) }}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => { setModelIndex((i) => Math.min(stories.length - 1, i + 1)); setStoryIndex(0); setProgress(0) }}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

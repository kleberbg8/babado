'use client'

import { useState } from 'react'
import StoryRing from '@/components/ui/StoryRing'
import StoryViewer from '@/components/ui/StoryViewer'
import type { StoryItem } from '@/types'

interface StoriesStripProps {
  stories: StoryItem[]
}

export default function StoriesStrip({ stories }: StoriesStripProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!stories.length) return null

  return (
    <>
      <div className="border-b border-[rgba(233,30,140,0.1)] bg-[#130E11]">
        <div className="max-content py-4">
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1">
            {stories.map((story, i) => (
              <StoryRing
                key={story.modelId}
                story={story}
                onClick={() => { setActiveIndex(i); setViewerOpen(true) }}
              />
            ))}
          </div>
        </div>
      </div>

      {viewerOpen && (
        <StoryViewer
          stories={stories}
          initialModelIndex={activeIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  )
}

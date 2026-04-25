'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Upload, X, Image as ImageIcon, Video, Star } from 'lucide-react'

interface UploadedFile {
  file: File
  preview: string
  type: 'photo' | 'video'
  isFace: boolean
  isMain: boolean
  progress: number
}

interface Props {
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
}

export default function RegisterStep3({ onNext, onBack }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    const added: UploadedFile[] = []
    Array.from(newFiles).forEach((file) => {
      if (files.length + added.length >= 35) return
      const isVideo = file.type.startsWith('video/')
      const preview = URL.createObjectURL(file)
      added.push({
        file,
        preview,
        type: isVideo ? 'video' : 'photo',
        isFace: false,
        isMain: files.length === 0 && added.length === 0,
        progress: 100,
      })
    })
    setFiles((prev) => [...prev, ...added])
  }, [files.length])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    if (updated.length > 0 && !updated.some((f) => f.isMain)) {
      updated[0].isMain = true
    }
    setFiles(updated)
  }

  const setMain = (index: number) => {
    setFiles(files.map((f, i) => ({ ...f, isMain: i === index })))
  }

  const toggleFace = (index: number) => {
    setFiles(files.map((f, i) => i === index ? { ...f, isFace: !f.isFace } : f))
  }

  const photoCount = files.filter((f) => f.type === 'photo').length
  const videoCount = files.filter((f) => f.type === 'video').length

  return (
    <div className="space-y-5">
      {/* Counter */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <ImageIcon size={14} className="text-[#E91E8C]" />
          <span className="text-[#BFA0AB]">{photoCount}/30 fotos</span>
        </div>
        <div className="flex items-center gap-2">
          <Video size={14} className="text-[#BFA0AB]" />
          <span className="text-[#BFA0AB]">{videoCount}/5 vídeos</span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-[#E91E8C] bg-[rgba(233,30,140,0.08)]'
            : 'border-[rgba(233,30,140,0.2)] bg-[#201519] hover:border-[#E91E8C] hover:bg-[rgba(233,30,140,0.04)]'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-[rgba(233,30,140,0.12)] flex items-center justify-center">
          <Upload size={24} className="text-[#E91E8C]" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#F8F0F4]">Clique ou arraste suas fotos/vídeos aqui</p>
          <p className="text-sm text-[#7A5665] mt-1">JPG, PNG, HEIC, MP4, MOV — máx. 50MB por arquivo</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative group aspect-square rounded overflow-hidden bg-[#201519]">
              {f.type === 'photo' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#130E11]">
                  <Video size={24} className="text-[#BFA0AB]" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                <button
                  onClick={() => setMain(i)}
                  className={`w-full text-[10px] py-1 rounded font-semibold transition-colors ${f.isMain ? 'bg-[#E8B84B] text-black' : 'bg-black/50 text-white hover:bg-[#E8B84B] hover:text-black'}`}
                >
                  {f.isMain ? '★ Principal' : 'Tornar principal'}
                </button>
                {f.type === 'photo' && (
                  <button
                    onClick={() => toggleFace(i)}
                    className={`w-full text-[10px] py-1 rounded font-semibold transition-colors ${f.isFace ? 'bg-[#E91E8C] text-white' : 'bg-black/50 text-white hover:bg-[rgba(233,30,140,0.5)]'}`}
                  >
                    {f.isFace ? '✓ É meu rosto' : 'Marcar como rosto'}
                  </button>
                )}
              </div>

              {/* Badges */}
              {f.isMain && (
                <div className="absolute top-1 left-1">
                  <Star size={12} className="text-[#E8B84B] fill-[#E8B84B]" />
                </div>
              )}

              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E91E8C]"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#7A5665]">
        Todas as fotos são moderadas antes de serem publicadas. Conteúdo explícito é permitido apenas para usuários +18.
      </p>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 py-3">
          <ChevronLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          onClick={() => onNext({ files: files.map((f) => f.file) })}
          className="btn-primary flex-1 py-3"
          disabled={files.length === 0}
        >
          Continuar <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

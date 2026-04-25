'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface Props {
  onNext: (data: Record<string, unknown>) => void
  onBack: () => void
  defaultValues?: Record<string, unknown>
}

const GENDERS = ['Feminino', 'Trans feminina', 'Trans masculino', 'Não-binário']
const ETNIAS = ['Branca', 'Parda', 'Negra', 'Asiática', 'Latina', 'Outra']
const EYE_COLORS = ['Castanhos', 'Verdes', 'Azuis', 'Pretos', 'Mel']
const HAIR_STYLES = ['Liso', 'Ondulado', 'Cacheado', 'Crespo', 'Raspado']
const HAIR_SIZES = ['Careca', 'Curtíssimo', 'Curto', 'Médio', 'Longo', 'Muito longo']

export default function RegisterStep2({ onNext, onBack, defaultValues }: Props) {
  const [charCount, setCharCount] = useState(0)
  const [generating, setGenerating] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: defaultValues ?? {},
  })

  const handleGenerateBio = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    const suggestion =
      'Olá! Sou uma mulher apaixonada pela vida, que adora proporcionar momentos únicos e inesquecíveis. Com charme natural e personalidade envolvente, estou aqui para ser sua companhia perfeita em qualquer ocasião. Discrição e profissionalismo são minha prioridade. Vamos criar memórias juntos?'
    setValue('bio', suggestion)
    setCharCount(suggestion.length)
    setGenerating(false)
  }

  return (
    <form onSubmit={handleSubmit((d) => onNext(d as Record<string, unknown>))} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Gênero *</label>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <label
              key={g}
              className="flex items-center gap-2 px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#201519] cursor-pointer hover:border-[rgba(233,30,140,0.3)] transition-all has-[:checked]:border-[#E91E8C] has-[:checked]:bg-[rgba(233,30,140,0.06)] text-sm text-[#BFA0AB]"
            >
              <input type="radio" value={g} {...register('gender', { required: true })} className="accent-[#E91E8C]" />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-xs text-[#E91E8C] mt-1">Selecione o gênero</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Idade *</label>
          <input
            {...register('age', { required: true, min: 18, max: 80 })}
            type="number"
            min={18}
            max={80}
            placeholder="25"
            className="input-field"
          />
          {errors.age && <p className="text-xs text-[#E91E8C] mt-1">Mínimo 18 anos</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Altura (m)</label>
          <input {...register('height')} type="number" step="0.01" placeholder="1.65" className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Peso (kg)</label>
          <input {...register('weight')} type="number" placeholder="55" className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Etnia</label>
          <select {...register('ethnicity')} className="input-field">
            <option value="">Selecionar</option>
            {ETNIAS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Cor dos Olhos</label>
          <select {...register('eyeColor')} className="input-field">
            <option value="">Selecionar</option>
            {EYE_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Estilo Cabelo</label>
          <select {...register('hairStyle')} className="input-field">
            <option value="">Selecionar</option>
            {HAIR_STYLES.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Tamanho Cabelo</label>
          <select {...register('hairSize')} className="input-field">
            <option value="">Selecionar</option>
            {HAIR_SIZES.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { name: 'hasSilicone', label: 'Silicone' },
          { name: 'hasTattoo', label: 'Tatuagens' },
          { name: 'smokes', label: 'Fumante' },
        ].map(({ name, label }) => (
          <label
            key={name}
            className="flex items-center gap-2 px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#201519] cursor-pointer hover:border-[rgba(233,30,140,0.3)] transition-all has-[:checked]:border-[#E91E8C] has-[:checked]:bg-[rgba(233,30,140,0.06)] text-sm text-[#BFA0AB]"
          >
            <input type="checkbox" {...register(name)} className="accent-[#E91E8C]" />
            {label}
          </label>
        ))}
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider">Bio *</label>
          <button
            type="button"
            onClick={handleGenerateBio}
            disabled={generating}
            className="flex items-center gap-1.5 text-xs text-[#E91E8C] hover:text-[#FF4DB3] transition-colors disabled:opacity-50"
          >
            <Sparkles size={12} />
            {generating ? 'Gerando...' : 'Sugerir com IA'}
          </button>
        </div>
        <textarea
          {...register('bio', { required: true, minLength: 50 })}
          placeholder="Fale sobre você, sua personalidade, como é trabalhar com você..."
          className="input-field min-h-[120px] resize-none"
          onChange={(e) => setCharCount(e.target.value.length)}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.bio && <p className="text-xs text-[#E91E8C]">Bio muito curta (mínimo 50 caracteres)</p>}
          <p className="text-xs text-[#7A5665] ml-auto">{charCount}/1000</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-1">
          <ChevronLeft size={16} /> Voltar
        </button>
        <button type="submit" className="btn-primary flex-1 py-3 flex items-center justify-center gap-1">
          Continuar <ChevronRight size={16} />
        </button>
      </div>
    </form>
  )
}

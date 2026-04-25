'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Sparkles, MapPin, Phone, User, AlertCircle, CheckCircle } from 'lucide-react'

const ESTADOS = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'DF', 'CE', 'PE', 'AM', 'PA', 'MS', 'MT', 'ES', 'RN', 'AL', 'PB', 'SE', 'PI', 'MA', 'TO', 'RO', 'RR', 'AC', 'AP']
const ETNIAS = ['Branca', 'Negra', 'Parda', 'Asiática', 'Indígena', 'Latina']
const CABELOS = ['Liso', 'Ondulado', 'Cacheado', 'Crespo']
const OLHOS = ['Castanho', 'Verde', 'Azul', 'Preto', 'Mel']

interface FormData {
  stageName: string
  city: string
  state: string
  neighborhood: string
  whatsapp: string
  bio: string
  age: number
  height: number
  weight: number
  ethnicity: string
  hairStyle: string
  eyeColor: string
  hasSilicone: boolean
  hasTattoo: boolean
  smokes: boolean
  price1h: string
  price2h: string
  priceDay: string
  priceOver: string
}

const DEFAULT: Partial<FormData> = {
  stageName: 'Valentina',
  city: 'São Paulo',
  state: 'SP',
  neighborhood: 'Moema',
  whatsapp: '11999999999',
  bio: 'Olá! Sou a Valentina, acompanhante sofisticada com muito charme e discrição. Estou aqui para proporcionar momentos únicos e inesquecíveis.',
  age: 26,
  height: 168,
  weight: 57,
  ethnicity: 'Branca',
  hairStyle: 'Liso',
  eyeColor: 'Castanho',
  hasSilicone: false,
  hasTattoo: true,
  smokes: false,
  price1h: '500',
  price2h: '800',
  priceDay: '2500',
  priceOver: '300',
}

export default function PerfilPage() {
  const [saved, setSaved] = useState(false)
  const [generatingBio, setGeneratingBio] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<FormData>({
    defaultValues: DEFAULT as FormData,
  })

  const bio = watch('bio')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 800))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const generateBio = async () => {
    setGeneratingBio(true)
    await new Promise((r) => setTimeout(r, 1500))
    setValue('bio', 'Olá! Sou uma acompanhante de alto padrão, elegante e discreta. Com presença marcante e conversação refinada, proporciono experiências únicas para homens exigentes que valorizam qualidade e sofisticação em cada encontro.')
    setGeneratingBio(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Editar <span className="italic text-[#E91E8C]">Perfil</span>
          </h1>
          <p className="text-sm text-[#7A5665]">Mantenha seus dados sempre atualizados</p>
        </div>
        {isDirty && (
          <div className="flex items-center gap-2 text-sm text-[#E8B84B]">
            <AlertCircle size={14} />
            Alterações não salvas
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identidade */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-[#E91E8C]" />
            <h2 className="font-semibold text-[#F8F0F4]">Identidade</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Nome artístico</label>
              <input {...register('stageName')} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">WhatsApp</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665]" />
                <input {...register('whatsapp')} className="input-field pl-9" placeholder="11999999999" />
              </div>
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={16} className="text-[#E91E8C]" />
            <h2 className="font-semibold text-[#F8F0F4]">Localização</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Cidade</label>
              <input {...register('city')} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Estado</label>
              <select {...register('state')} className="input-field">
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Bairro</label>
              <input {...register('neighborhood')} className="input-field" />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#F8F0F4]">Apresentação</h2>
            <button
              type="button"
              onClick={generateBio}
              disabled={generatingBio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[rgba(233,30,140,0.1)] border border-[rgba(233,30,140,0.2)] text-[#E91E8C] hover:bg-[rgba(233,30,140,0.2)] transition-all disabled:opacity-60"
            >
              <Sparkles size={12} />
              {generatingBio ? 'Gerando...' : 'Gerar com IA'}
            </button>
          </div>
          <textarea
            {...register('bio')}
            rows={5}
            className="input-field resize-none"
            placeholder="Conte um pouco sobre você..."
          />
          <p className="text-xs text-[#7A5665] mt-1.5">{bio?.length ?? 0}/500 caracteres</p>
        </div>

        {/* Características físicas */}
        <div className="card p-6">
          <h2 className="font-semibold text-[#F8F0F4] mb-5">Características Físicas</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Idade</label>
              <input {...register('age', { valueAsNumber: true })} type="number" min={18} max={65} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Altura (cm)</label>
              <input {...register('height', { valueAsNumber: true })} type="number" min={140} max={200} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Peso (kg)</label>
              <input {...register('weight', { valueAsNumber: true })} type="number" min={40} max={130} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Etnia</label>
              <select {...register('ethnicity')} className="input-field">
                {ETNIAS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Cabelo</label>
              <select {...register('hairStyle')} className="input-field">
                {CABELOS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">Olhos</label>
              <select {...register('eyeColor')} className="input-field">
                {OLHOS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-6">
            {[
              { name: 'hasSilicone' as const, label: 'Silicone' },
              { name: 'hasTattoo' as const, label: 'Tatuagem' },
              { name: 'smokes' as const, label: 'Fumante' },
            ].map((f) => (
              <label key={f.name} className="flex items-center gap-2 cursor-pointer">
                <input {...register(f.name)} type="checkbox" className="accent-[#E91E8C] w-4 h-4" />
                <span className="text-sm text-[#BFA0AB]">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tabela de preços */}
        <div className="card p-6">
          <h2 className="font-semibold text-[#F8F0F4] mb-5">Tabela de Preços</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'price1h' as const, label: '1 hora' },
              { name: 'price2h' as const, label: '2 horas' },
              { name: 'priceDay' as const, label: 'Dia' },
              { name: 'priceOver' as const, label: 'Hora adicional' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A5665] text-sm">R$</span>
                  <input {...register(f.name)} type="number" min={0} className="input-field pl-9" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary px-8 py-3 flex items-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle size={16} />
                Salvo!
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

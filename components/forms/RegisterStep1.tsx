'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight } from 'lucide-react'

const schema = z.object({
  stageName: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  neighborhood: z.string().optional(),
  serviceType: z.enum(['LOCAL', 'OUTCALL', 'BOTH', 'TRAVEL']),
  whatsapp: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

interface Props {
  onNext: (data: Record<string, unknown>) => void
  defaultValues?: Record<string, unknown>
}

const SERVICE_OPTIONS = [
  { value: 'LOCAL', label: 'Com local próprio' },
  { value: 'OUTCALL', label: 'A domicílio' },
  { value: 'BOTH', label: 'Ambos' },
  { value: 'TRAVEL', label: 'Viagens' },
]

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

export default function RegisterStep1({ onNext, defaultValues }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as Partial<FormData>,
  })

  return (
    <form onSubmit={handleSubmit((d) => onNext(d))} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
          Nome Artístico *
        </label>
        <input {...register('stageName')} placeholder="Como quer ser chamada?" className="input-field" />
        {errors.stageName && <p className="text-xs text-[#E91E8C] mt-1">{errors.stageName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
            Cidade *
          </label>
          <input {...register('city')} placeholder="Sua cidade" className="input-field" />
          {errors.city && <p className="text-xs text-[#E91E8C] mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
            Estado *
          </label>
          <select {...register('state')} className="input-field">
            <option value="">UF</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-xs text-[#E91E8C] mt-1">{errors.state.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
          Bairro (opcional)
        </label>
        <input {...register('neighborhood')} placeholder="Seu bairro" className="input-field" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
          Tipo de Atendimento *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICE_OPTIONS.map((o) => (
            <label key={o.value} className="flex items-center gap-2 p-3 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#201519] cursor-pointer hover:border-[rgba(233,30,140,0.3)] transition-all has-[:checked]:border-[#E91E8C] has-[:checked]:bg-[rgba(233,30,140,0.06)]">
              <input type="radio" value={o.value} {...register('serviceType')} className="accent-[#E91E8C]" />
              <span className="text-sm text-[#BFA0AB]">{o.label}</span>
            </label>
          ))}
        </div>
        {errors.serviceType && <p className="text-xs text-[#E91E8C] mt-1">{errors.serviceType.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
          WhatsApp *
        </label>
        <input {...register('whatsapp')} placeholder="(11) 99999-9999" className="input-field" type="tel" />
        {errors.whatsapp && <p className="text-xs text-[#E91E8C] mt-1">{errors.whatsapp.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
          E-mail *
        </label>
        <input {...register('email')} placeholder="seu@email.com" className="input-field" type="email" />
        {errors.email && <p className="text-xs text-[#E91E8C] mt-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
            Senha *
          </label>
          <input {...register('password')} placeholder="••••••••" className="input-field" type="password" />
          {errors.password && <p className="text-xs text-[#E91E8C] mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#BFA0AB] uppercase tracking-wider mb-1.5">
            Confirmar *
          </label>
          <input {...register('confirmPassword')} placeholder="••••••••" className="input-field" type="password" />
          {errors.confirmPassword && <p className="text-xs text-[#E91E8C] mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-3.5 mt-2">
        Continuar
        <ChevronRight size={16} />
      </button>
    </form>
  )
}

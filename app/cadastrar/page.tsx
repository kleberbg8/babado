'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, User, Sparkles, Camera, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RegisterStep1 from '@/components/forms/RegisterStep1'
import RegisterStep2 from '@/components/forms/RegisterStep2'
import RegisterStep3 from '@/components/forms/RegisterStep3'
import RegisterStep4 from '@/components/forms/RegisterStep4'

const STEPS = [
  { id: 1, label: 'Dados Pessoais', icon: User },
  { id: 2, label: 'Características', icon: Sparkles },
  { id: 3, label: 'Fotos e Vídeos', icon: Camera },
  { id: 4, label: 'Verificação', icon: ShieldCheck },
]

export type RegisterData = {
  step1?: Record<string, unknown>
  step2?: Record<string, unknown>
  step3?: { files: File[] }
  step4?: Record<string, unknown>
}

export default function CadastrarPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<RegisterData>({})
  const [submitted, setSubmitted] = useState(false)

  const handleStep = (stepData: Record<string, unknown>) => {
    setData((prev) => ({ ...prev, [`step${step}`]: stepData }))
    if (step < 4) setStep((s) => s + 1)
    else setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <div className="page-bar" />
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-[rgba(37,211,102,0.12)] border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-green-400" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">
              Cadastro <span className="italic text-[#E91E8C]">enviado!</span>
            </h1>
            <p className="text-[#BFA0AB] mb-2">
              Seu perfil foi enviado para aprovação. Nossa equipe irá analisar em até 24 horas.
            </p>
            <p className="text-sm text-[#7A5665] mb-8">
              Você receberá uma notificação por e-mail e WhatsApp quando seu perfil for aprovado.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/painel" className="btn-primary w-full py-3">
                Acessar meu painel
              </Link>
              <Link href="/" className="btn-secondary w-full py-3">
                Voltar para a home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="page-bar" />
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="max-content py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Cadastre seu <span className="italic text-[#E91E8C]">perfil</span>
            </h1>
            <p className="text-[#BFA0AB]">Grátis · Verificado · Seguro</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center mb-10 gap-0">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = s.id === step
              const isDone = s.id < step
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isDone
                          ? 'bg-[#E91E8C] border-[#E91E8C]'
                          : isActive
                          ? 'bg-[rgba(233,30,140,0.12)] border-[#E91E8C]'
                          : 'bg-[#201519] border-[rgba(255,255,255,0.08)]'
                      }`}
                    >
                      {isDone ? (
                        <Check size={16} className="text-white" />
                      ) : (
                        <Icon size={16} className={isActive ? 'text-[#E91E8C]' : 'text-[#7A5665]'} />
                      )}
                    </div>
                    <span className={`text-xs mt-1.5 hidden sm:block font-medium ${isActive ? 'text-[#E91E8C]' : isDone ? 'text-[#BFA0AB]' : 'text-[#7A5665]'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 sm:w-24 h-0.5 mx-1 mt-[-18px] sm:mt-[-30px] transition-all duration-300 ${s.id < step ? 'bg-[#E91E8C]' : 'bg-[rgba(255,255,255,0.08)]'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step content */}
          <div className="max-w-2xl mx-auto">
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-semibold text-[#7A5665] uppercase tracking-wider">
                  Etapa {step} de {STEPS.length}
                </span>
                <ChevronRight size={14} className="text-[#7A5665]" />
                <span className="text-xs font-semibold text-[#E91E8C]">
                  {STEPS[step - 1].label}
                </span>
              </div>

              {step === 1 && <RegisterStep1 onNext={handleStep} defaultValues={data.step1} />}
              {step === 2 && <RegisterStep2 onNext={handleStep} onBack={() => setStep(1)} defaultValues={data.step2} />}
              {step === 3 && <RegisterStep3 onNext={handleStep} onBack={() => setStep(2)} />}
              {step === 4 && <RegisterStep4 onNext={handleStep} onBack={() => setStep(3)} defaultValues={data.step4} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

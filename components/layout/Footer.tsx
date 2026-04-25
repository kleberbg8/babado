import Link from 'next/link'
import { MessageCircle, ExternalLink } from 'lucide-react'

const Instagram = ExternalLink
const Twitter = ExternalLink

const footerLinks = {
  portal: [
    { href: '/acompanhantes', label: 'Acompanhantes' },
    { href: '/cidades', label: 'Cidades' },
    { href: '/gatas-da-semana', label: 'Ranking Semanal' },
    { href: '/planos', label: 'Planos Premium' },
    { href: '/cadastrar', label: 'Cadastrar Perfil' },
  ],
  legal: [
    { href: '/termos-de-uso', label: 'Termos de Uso' },
    { href: '/privacidade', label: 'Política de Privacidade' },
    { href: '/cookies', label: 'Política de Cookies' },
    { href: '/compliance', label: 'Conformidade Legal' },
    { href: '/dmca', label: 'DMCA' },
  ],
  suporte: [
    { href: '/contato', label: 'Contato' },
    { href: '/ajuda', label: 'Central de Ajuda' },
    { href: '/denunciar', label: 'Denunciar Conteúdo' },
    { href: '/remover-perfil', label: 'Remover Meu Perfil' },
  ],
  social: [
    { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
    { href: 'https://twitter.com', label: 'Twitter / X', icon: Twitter },
    { href: 'https://wa.me', label: 'WhatsApp Suporte', icon: MessageCircle },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(233,30,140,0.15)] bg-[#130E11] mt-16">
      <div className="max-content py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Portal */}
          <div>
            <h4 className="text-sm font-semibold text-[#F8F0F4] mb-4 uppercase tracking-wider">Portal</h4>
            <ul className="space-y-2">
              {footerLinks.portal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A5665] hover:text-[#E91E8C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#F8F0F4] mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A5665] hover:text-[#E91E8C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-sm font-semibold text-[#F8F0F4] mb-4 uppercase tracking-wider">Suporte</h4>
            <ul className="space-y-2">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#7A5665] hover:text-[#E91E8C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-[#F8F0F4] mb-4 uppercase tracking-wider">Social</h4>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#7A5665] hover:text-[#E91E8C] transition-colors"
                    >
                      <Icon size={14} />
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[rgba(233,30,140,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display text-lg font-bold text-white">
              Gatas do <span className="italic text-[#E91E8C]">Babado</span>
            </span>
            <p className="text-xs text-[#7A5665]">
              CNPJ: 00.000.000/0001-00 — Plataforma de anúncios de acompanhantes adultos
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#201519] border border-[rgba(233,30,140,0.15)]">
              <span className="text-[#E91E8C] font-bold text-sm">+18</span>
              <span className="text-xs text-[#7A5665]">Conteúdo exclusivo para adultos</span>
            </div>
            <p className="text-xs text-[#7A5665]">
              © {new Date().getFullYear()} Gatas do Babado. Todos os direitos reservados.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded bg-[#201519] border border-[rgba(255,255,255,0.06)]">
          <p className="text-xs text-[#7A5665] text-center leading-relaxed">
            Este site é uma plataforma de anúncios de acompanhantes adultos. Não somos uma casa de prostituição
            e não nos responsabilizamos por acordos estabelecidos entre as partes. Todo o conteúdo é publicado
            pelos próprios usuários e verificado pela nossa equipe de moderação. Conteúdo exclusivo para maiores de 18 anos.
          </p>
        </div>
      </div>
    </footer>
  )
}

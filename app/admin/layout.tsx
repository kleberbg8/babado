'use client'

import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0D0A0C]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#130E11] border-b border-[rgba(233,30,140,0.12)] sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-black text-[#E91E8C] text-base">babado admin</span>
          <button className="p-2 rounded-lg text-[#7A5665] hover:text-white hover:bg-[#201519] transition-all">
            <Bell size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

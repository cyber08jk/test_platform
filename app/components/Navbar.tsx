'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Home, ClipboardList, Activity, Info, Phone, Menu, X, Hexagon } from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Assessments', href: '/assessments', icon: ClipboardList },
  { label: 'Status', href: '/status', icon: Activity },
  { label: 'About Us', href: '/about', icon: Info },
  { label: 'Contact Us', href: '/contact', icon: Phone },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const getLinkClasses = (href: string) => {
    const active = pathname === href

    return [
      'relative px-1 py-2 text-sm font-semibold transition-colors duration-200',
      active ? 'text-blue-400' : 'text-slate-300 hover:text-white',
    ].join(' ')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 md:px-8 xl:px-10">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo.png"
            alt="ThiranziHub Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div className="leading-tight">
            <p className="font-bold text-white">ThiranziHub</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Assessment Platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} className={getLinkClasses(item.href)}>
                <span className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-[19px] left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
                )}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white shadow-sm transition hover:bg-white/10 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 px-4 pb-4 pt-2 md:hidden">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

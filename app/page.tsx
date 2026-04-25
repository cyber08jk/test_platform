'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, Zap, ShieldCheck, Users, Star, ChevronRight } from 'lucide-react'

const stats = [
  { label: 'Assessments', value: '100+', color: 'text-blue-700' },
  { label: 'Candidates', value: '50K+', color: 'text-indigo-600' },
  { label: 'Satisfaction', value: '99%', color: 'text-emerald-600' },
]

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url('/backgroud_image.jpg')" }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url('/mobile_bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-900/40" />

      <div className="mr-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:ml-8 lg:ml-12 sm:py-10">

        {/* Hero Section */}
        <section className="p-6 sm:p-10 mb-6">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-blue-200/50 bg-blue-50/20 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm drop-shadow-md">
              <Star className="w-3 h-3 text-amber-300" /> Professional Skill Intelligence
            </span>

            <h1 className="text-[1.75rem] sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-4 drop-shadow-lg">
              Modern assessments built for accurate hiring decisions.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-100 max-w-lg mb-8 font-medium drop-shadow-md">
              ThiranziHub helps you evaluate communication, aptitude, technical depth, and workplace readiness using a guided and secure test experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => router.push('/assessments')}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-white text-base shadow-xl shadow-blue-600/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                Start Assessment <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/about')}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg hover:-translate-y-1"
              >
                Explore Platform <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Below */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg p-4 sm:p-5 text-center shadow-xl shadow-black/10 transition-transform hover:-translate-y-1">
                  <p className={`text-2xl sm:text-3xl font-black drop-shadow-md text-white`}>{s.value}</p>
                  <p className="mt-1.5 text-[10px] sm:text-xs text-blue-100 font-bold uppercase tracking-widest drop-shadow-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

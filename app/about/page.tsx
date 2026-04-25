'use client'

import { Target, Lightbulb, Shield, Award, Users, Globe, ChevronRight } from 'lucide-react'

export default function AboutPage() {
  const values = [
    { icon: Lightbulb, title: 'Innovation', desc: 'Leveraging AI and modern technology', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Shield, title: 'Reliability', desc: 'Trusted by thousands globally', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Award, title: 'Excellence', desc: 'Setting industry standards', color: 'text-blue-500', bg: 'bg-blue-50' },
  ]

  const features = [
    { icon: Target, title: 'Comprehensive Assessments', desc: 'Wide range of tests covering all critical skill categories globally.' },
    { icon: Globe, title: 'Real-time Results', desc: 'Instant feedback and detailed analytics across all modules.' },
    { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security and advanced proctoring compliance.' },
    { icon: Users, title: '24/7 Support', desc: 'Dedicated expert support team always ready to assist.' },
  ]

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
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-900/60" />

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-sm text-sm font-bold text-white tracking-widest uppercase mb-4 drop-shadow">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            About ThiranziHub
          </h1>
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-md">
            Discover our mission to revolutionize global talent evaluation through smart, fair, and seamless objective assessments.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/30 p-8 sm:p-10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Target className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4">Our Mission</h2>
            <p className="text-slate-200 leading-relaxed font-medium drop-shadow-sm">
              ThiranziHub is dedicated to providing comprehensive, professional assessment solutions that help organizations identify, evaluate, and develop talent. We believe that accurate assessments are the absolute foundation of effective hiring and employee development.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/30 p-8 sm:p-10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Globe className="w-6 h-6 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4">Our Vision</h2>
            <p className="text-slate-200 leading-relaxed font-medium drop-shadow-sm">
              To be the premier provider of assessment solutions globally, equipping organizations to make transformative talent decisions and develop their active workforce with absolute certainty and fairness.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-10">
          <h2 className="text-center text-2xl font-black text-white drop-shadow-md mb-6">Our Core Values</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-6 text-center shadow-lg shadow-black/10 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full opacity-50 pointer-events-none`} />
                <div className={`w-14 h-14 mx-auto rounded-full border border-white/30 flex items-center justify-center mb-4 bg-white/10 shadow-sm group-hover:scale-110 transition-transform`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="font-bold text-white drop-shadow-sm mb-1">{v.title}</h3>
                <p className="text-sm text-slate-200 font-medium drop-shadow-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/30 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">Why Choose ThiranziHub?</h2>
            <button className="hidden sm:flex items-center gap-1 text-sm font-bold text-blue-200 hover:text-white transition-colors drop-shadow-sm">
              Read Documentation <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/30 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-500/50 group-hover:border-blue-400 transition-colors">
                  <f.icon className="w-5 h-5 text-slate-200 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1 drop-shadow-sm">{f.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium drop-shadow-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

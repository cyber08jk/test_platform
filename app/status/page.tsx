'use client'

import { useState } from 'react'
import { Activity, Clock, CheckCircle2, Trophy, FileText, Target, Search, AlertTriangle, BarChart2 } from 'lucide-react'

const RESULTS_KEY = 'mba_test_results'
const STORAGE_KEY = 'mba_test_completed_ids'
const VALID_IDS = Array.from({ length: 10 }, (_, i) => `MBA_26_${String(i + 1).padStart(3, '0')}`)

const sectionColors: Record<string, string> = {
  blue: 'bg-blue-600', emerald: 'bg-emerald-600', purple: 'bg-purple-600',
  orange: 'bg-orange-500', pink: 'bg-pink-600', teal: 'bg-teal-600',
}
const sectionText: Record<string, string> = {
  blue: 'text-blue-300', emerald: 'text-emerald-300', purple: 'text-purple-300',
  orange: 'text-orange-300', pink: 'text-pink-300', teal: 'text-teal-300',
}

type StatusState = 'idle' | 'not-found' | 'invalid-id' | 'not-taken' | 'completed'

export default function StatusPage() {
  const [candidateId, setCandidateId] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<StatusState>('idle')
  const [result, setResult] = useState<any | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const id = candidateId.trim().toUpperCase()
    if (!id) return
    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      // Validate ID format
      if (!VALID_IDS.includes(id)) {
        setStatus('invalid-id')
        setResult(null)
        return
      }

      // Check if test was completed
      const results: any[] = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
      const myResult = results.find(r => r.candidateId === id)

      if (myResult) {
        setStatus('completed')
        setResult(myResult)
      } else {
        // Registered but not taken
        const completed: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        setStatus('not-taken')
        setResult(null)
      }
    }, 700)
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden pt-8 pb-16">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url('/backgroud_image.jpg')" }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url('/mobile_bg.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-900/80" />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/20 text-sm font-bold text-white tracking-widest uppercase mb-4">
            Dashboard
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Assessment Status
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto font-medium">
            Enter your Candidate ID to check your test status and results.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative flex items-center group">
            <div className="absolute left-5 opacity-50 group-focus-within:opacity-100 transition-opacity">
              <Search className="w-5 h-5 text-white" />
            </div>
            <input
              type="text"
              value={candidateId}
              onChange={e => { setCandidateId(e.target.value.toUpperCase()); setStatus('idle') }}
              placeholder="Enter Candidate ID (e.g. MBA_26_001)"
              className="w-full pl-14 pr-36 py-4 bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none font-mono font-bold shadow-xl shadow-black/30 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={loading || !candidateId.trim()}
              className="absolute right-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all h-[calc(100%-16px)] text-sm flex items-center justify-center shrink-0 min-w-[110px]"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking</span>
              ) : 'Check Status'}
            </button>
          </form>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="animate-in fade-in duration-500">

          {/* Invalid ID */}
          {status === 'invalid-id' && (
            <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-red-500/30 p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-white font-bold text-lg">Invalid Candidate ID</p>
              <p className="text-slate-400 text-sm mt-1">Valid range: <span className="font-mono text-red-300">MBA_26_001</span> to <span className="font-mono text-red-300">MBA_26_010</span></p>
            </div>
          )}

          {/* Registered but not taken */}
          {status === 'not-taken' && (
            <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-amber-500/30 p-8 text-center">
              <div className="w-16 h-16 bg-amber-500/20 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-300" />
              </div>
              <p className="text-white font-bold text-lg">Test Not Yet Taken</p>
              <p className="text-slate-400 text-sm mt-1">
                Candidate <span className="font-mono text-amber-300">{candidateId}</span> has not completed the MBA Trainee Assessment yet.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-medium">
                ⏳ Awaiting attempt
              </div>
            </div>
          )}

          {/* Completed — show full results */}
          {status === 'completed' && result && (() => {
            const acc = Math.round((result.totalScore / result.totalQ) * 100)
            return (
              <div className="space-y-5">
                {/* Top stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl p-5 text-center">
                    <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-3xl font-black text-white">{result.totalScore}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Score / {result.totalQ}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl p-5 text-center">
                    <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-5 h-5 text-emerald-300" />
                    </div>
                    <p className={`text-3xl font-black ${acc >= 70 ? 'text-emerald-300' : acc >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{acc}%</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Accuracy</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl p-5 text-center">
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-300" />
                    </div>
                    <p className="text-xl font-black text-white">Completed</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(result.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Section breakdown */}
                <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart2 className="w-5 h-5 text-blue-300" />
                    <h2 className="text-white font-extrabold">Section-wise Breakdown</h2>
                    <span className="ml-auto font-mono text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">{candidateId}</span>
                  </div>

                  <div className="space-y-4">
                    {result.sectionResults?.map((sr: any, i: number) => {
                      const pct = Math.round((sr.correct / sr.total) * 100)
                      const col = sectionColors[sr.color] || 'bg-blue-600'
                      const txt = sectionText[sr.color] || 'text-blue-300'
                      return (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{sr.icon}</span>
                              <span className="text-sm text-white font-bold">{sr.shortTitle}</span>
                              <span className="text-xs text-slate-500">{sr.attended}/{sr.total} attempted</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-black ${txt}`}>{sr.correct}/{sr.total}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${pct >= 70 ? 'bg-emerald-500/20 text-emerald-300' : pct >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>{pct}%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${col} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Idle state */}
          {status === 'idle' && (
            <div className="text-center p-12 bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/20">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Search className="w-8 h-8 text-white opacity-70" />
              </div>
              <p className="text-white text-lg font-bold">Enter your Candidate ID to check status</p>
              <p className="text-slate-400 text-sm mt-1">Valid IDs: MBA_26_001 to MBA_26_010</p>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}

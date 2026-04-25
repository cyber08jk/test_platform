'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Trophy, Users, BarChart2, Trash2 } from 'lucide-react'

const RESULTS_KEY = 'mba_test_results'
const STORAGE_KEY = 'mba_test_completed_ids'

const sectionColors: Record<string, string> = {
    blue: 'bg-blue-600', emerald: 'bg-emerald-600', purple: 'bg-purple-600',
    orange: 'bg-orange-500', pink: 'bg-pink-600', teal: 'bg-teal-600',
}
const sectionText: Record<string, string> = {
    blue: 'text-blue-300', emerald: 'text-emerald-300', purple: 'text-purple-300',
    orange: 'text-orange-300', pink: 'text-pink-300', teal: 'text-teal-300',
}

export default function MbaResultsPage() {
    const router = useRouter()
    const [results, setResults] = useState<any[]>([])
    const [selected, setSelected] = useState<any | null>(null)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
        setResults(data.reverse()) // newest first
    }, [])

    const clearResults = () => {
        if (!confirm('Clear ALL results? This cannot be undone.')) return
        localStorage.removeItem(RESULTS_KEY)
        localStorage.removeItem(STORAGE_KEY)
        setResults([])
        setSelected(null)
    }

    const avg = results.length
        ? Math.round(results.reduce((a, r) => a + Math.round((r.totalScore / r.totalQ) * 100), 0) / results.length)
        : 0;

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
            <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-900/80" />

            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/assessments')} className="text-slate-400 hover:text-white transition-colors shrink-0">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white">MBA Results Dashboard</h1>
                            <p className="text-slate-400 text-sm">All candidate test submissions</p>
                        </div>
                    </div>
                    {results.length > 0 && (
                        <button onClick={clearResults} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-sm font-bold transition-all w-fit">
                            <Trash2 className="w-4 h-4" /> Clear All
                        </button>
                    )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{results.length}</p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Candidates</p>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">
                                {results.length ? Math.max(...results.map((r: any) => r.totalScore)) : '--'}
                            </p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Top Score</p>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{results.length ? `${avg}%` : '--'}</p>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Avg Accuracy</p>
                        </div>
                    </div>
                </div>

                {results.length === 0 ? (
                    <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-16 text-center">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-white font-bold text-lg">No results yet</p>
                        <p className="text-slate-400 text-sm mt-1">Candidate results will appear here after they complete the test.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Results list */}
                        <div className="space-y-3">
                            {results.map((r: any, i: number) => {
                                const acc = Math.round((r.totalScore / r.totalQ) * 100)
                                const isSelected = selected?.candidateId === r.candidateId
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelected(isSelected ? null : r)}
                                        className={`w-full text-left rounded-2xl border p-4 transition-all ${isSelected ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-slate-900/60 backdrop-blur-xl border-white/20 hover:border-white/40 hover:bg-slate-900/80'}`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-mono font-black text-white text-sm">{r.candidateId}</span>
                                            <span className={`text-sm font-black px-3 py-1 rounded-full ${acc >= 70 ? 'bg-emerald-500/20 text-emerald-300' : acc >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                                                {acc}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span>Score: <span className="text-white font-bold">{r.totalScore}/{r.totalQ}</span></span>
                                            <span>{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {/* Mini bar */}
                                        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all ${acc >= 70 ? 'bg-emerald-500' : acc >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${acc}%` }} />
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Detail panel */}
                        <div>
                            {selected ? (
                                <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/20 p-5 sticky top-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest">Candidate</p>
                                            <p className="font-mono font-black text-white text-lg">{selected.candidateId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-white">{selected.totalScore}<span className="text-slate-400 text-lg">/{selected.totalQ}</span></p>
                                            <p className={`text-sm font-bold ${Math.round((selected.totalScore / selected.totalQ) * 100) >= 70 ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                {Math.round((selected.totalScore / selected.totalQ) * 100)}% accuracy
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        {selected.sectionResults?.map((sr: any, i: number) => {
                                            const pct = Math.round((sr.correct / sr.total) * 100)
                                            const col = sectionColors[sr.color] || 'bg-blue-600'
                                            const txt = sectionText[sr.color] || 'text-blue-300'
                                            return (
                                                <div key={i}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span>{sr.icon}</span>
                                                            <span className="text-xs text-white font-bold">{sr.shortTitle}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <span className="text-slate-400">{sr.attended} attempted</span>
                                                            <span className={`font-black ${txt}`}>{sr.correct}/{sr.total}</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${col}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-[10px] text-slate-500 text-right mt-4">
                                        Submitted: {new Date(selected.date).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-10 text-center h-full flex flex-col items-center justify-center">
                                    <p className="text-3xl mb-3">👆</p>
                                    <p className="text-white font-bold">Select a candidate</p>
                                    <p className="text-slate-500 text-sm mt-1">Click any result to see their section-wise breakdown.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main >
    )
}

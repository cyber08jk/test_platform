'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Finish() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [candidateName, setCandidateName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('candidateName') || 'Candidate'
    setCandidateName(name)

    const answers = JSON.parse(localStorage.getItem('answers') || '{}')
    const sectionACount = Object.keys(answers.sectionA || {}).length
    const sectionBCount = Object.keys(answers.sectionB || {}).length
    const sectionCCount = Object.keys(answers.sectionC || {}).length
    const sectionDCount = Object.keys(answers.sectionD || {}).length

    setStats({
      sectionA: sectionACount,
      sectionB: sectionBCount,
      sectionC: sectionCCount,
      sectionD: sectionDCount,
      total: sectionACount + sectionBCount + sectionCCount + sectionDCount
    })
  }, [])

  const submitTest = async () => {
    setSubmitting(true)

    const answers = JSON.parse(localStorage.getItem('answers') || '{}')
    const progress = JSON.parse(localStorage.getItem('progress') || '{}')
    const testStartTime = localStorage.getItem('testStartTime')

    const submission = {
      candidateName,
      answers,
      progress,
      testStartTime,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      stats
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      const result = await response.json()
      console.log('Submission result:', result)

      setSubmitted(true)
      setSubmitting(false)
    } catch (err) {
      console.error('Submission error:', err)
      alert('Failed to submit test. Please try again.')
      setSubmitting(false)
    }
  }

  const startNewTest = () => {
    localStorage.removeItem('answers')
    localStorage.removeItem('progress')
    localStorage.removeItem('candidateName')
    localStorage.removeItem('testStartTime')
    router.push('/')
  }

  if (submitted) {
    return (
      <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgroud_image.jpg')" }}
        />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-900/10" />

        <div className="max-w-3xl w-full relative z-10">
          <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 sm:p-12 text-center">
            <div className="mb-6">
              <div className="inline-block p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-2xl animate-bounce">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
              Test Submitted Successfully!
            </h1>
            <p className="text-2xl text-slate-300 drop-shadow-sm mb-2">
              Thank you, <strong className="text-green-600">{candidateName}</strong>!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-8">
              <svg className="w-5 h-5 text-green-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-green-800">All responses recorded</span>
            </div>

            <div className="mb-10 p-8 bg-white/5 rounded-2xl border-2 border-blue-400/30 shadow-inner">
              <h2 className="font-black text-xl mb-6 text-white drop-shadow-md">Your Submission Summary:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats?.sectionA || 0}</div>
                  <div className="text-sm text-slate-300 drop-shadow-sm">Section A</div>
                  <div className="text-xs text-gray-500">/ 23</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats?.sectionB || 0}</div>
                  <div className="text-sm text-slate-300 drop-shadow-sm">Section B</div>
                  <div className="text-xs text-gray-500">/ 4</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{stats?.sectionC || 0}</div>
                  <div className="text-sm text-slate-300 drop-shadow-sm">Section C</div>
                  <div className="text-xs text-gray-500">/ 34</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{stats?.sectionD || 0}</div>
                  <div className="text-sm text-slate-300 drop-shadow-sm">Section D</div>
                  <div className="text-xs text-gray-500">/ 16</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-300">
                <div className="text-2xl font-bold text-white drop-shadow-md">
                  Total: {stats?.total || 0} / 77 responses
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-emerald-500/20 backdrop-blur rounded-2xl border-l-4 border-emerald-500 shadow-inner text-left">
              <h3 className="font-black text-emerald-900 mb-2">✓ What Happens Next?</h3>
              <p className="text-sm font-medium text-emerald-800">
                Your responses have been securely recorded. The evaluation team will review your submission and contact you with the results.
              </p>
            </div>

            <button
              onClick={startNewTest}
              className="w-full py-5 rounded-xl font-black text-lg text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-500/30 transition-all hover:-translate-y-1"
            >
              🏠 Return to Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden flex items-center justify-center p-4">
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

      <div className="max-w-3xl w-full relative z-10 py-10">
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-500/20 backdrop-blur rounded-full mb-4">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-md">
              Test Complete!
            </h1>
            <p className="text-slate-300 drop-shadow-sm">
              Great job, {candidateName}! You've completed all sections.
            </p>
          </div>

          <div className="mb-10 p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 shadow-inner">
            <h2 className="font-black text-xl mb-6 text-white drop-shadow-md">📊 Your Progress:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-white/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{stats?.sectionA || 0}</div>
                <div className="text-sm text-slate-300 drop-shadow-sm">Section A</div>
                <div className="text-xs text-gray-500">Reading & Listening</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{stats?.sectionB || 0}</div>
                <div className="text-sm text-slate-300 drop-shadow-sm">Section B</div>
                <div className="text-xs text-gray-500">Speaking</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">{stats?.sectionC || 0}</div>
                <div className="text-sm text-slate-300 drop-shadow-sm">Section C</div>
                <div className="text-xs text-gray-500">Grammar</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600">{stats?.sectionD || 0}</div>
                <div className="text-sm text-slate-300 drop-shadow-sm">Section D</div>
                <div className="text-xs text-gray-500">Listening</div>
              </div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl shadow-sm border border-white/20">
              <div className="text-5xl font-black text-white drop-shadow-md mb-2 drop-shadow-sm">
                {stats?.total || 0} / 77
              </div>
              <div className="font-bold text-slate-300 drop-shadow-sm uppercase tracking-widest text-sm">Total Responses Recorded</div>
            </div>
          </div>

          <div className="mb-10 p-6 bg-yellow-50 rounded-2xl border-l-4 border-amber-500 shadow-inner">
            <h2 className="font-black mb-4 text-amber-900">⚠️ Before Submitting:</h2>
            <ul className="space-y-3 font-medium text-amber-800">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>All your responses have been auto-saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>You can review answers by going back to any section</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span><strong>Once submitted, you cannot make changes</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>Results will be communicated via email</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={submitTest}
              disabled={submitting}
              className={`w-full py-5 px-6 rounded-xl font-black text-xl tracking-wide transition-all shadow-xl hover:-translate-y-1 ${submitting
                ? 'bg-slate-200 text-slate-300 drop-shadow-sm shadow-none cursor-not-allowed hover:translate-y-0'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/40'
                }`}
            >
              {submitting ? '⏳ Submitting...' : '✓ Submit Final Test'}
            </button>

            <button
              onClick={() => router.push('/section-a')}
              className="w-full py-5 rounded-xl font-black text-lg text-slate-200 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all hover:shadow-md"
            >
              ← Review Answers
            </button>
          </div>

          {/* J-Squad Credit */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-center">
              <div className="relative group cursor-pointer">
                {/* Gold Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>

                {/* Silver/Gold Badge */}
                <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-full shadow-lg border-2 border-yellow-500/50">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="url(#goldGradientFinish)">
                    <defs>
                      <linearGradient id="goldGradientFinish" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M10 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-7-5z" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
                      Crafted by J-SQUAD.
                    </span>
                    <span className="text-xs text-slate-300 drop-shadow-sm">Excellence in Assessment Technology</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

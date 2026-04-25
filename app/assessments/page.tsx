'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, HelpCircle, X } from 'lucide-react'

type AssessmentStatus = 'Current Test' | 'Upcoming' | 'Completed'

type Assessment = {
  id: number
  name: string
  description: string
  duration: string
  totalQuestions: number
  status: AssessmentStatus
  imageUrl: string
  rules: string[]
}

const assessments: Assessment[] = [
  {
    id: 1,
    name: 'Communication Assessment',
    description: 'Test your English communication skills through structured evaluations.',
    duration: '60–90 mins',
    totalQuestions: 77,
    status: 'Current Test',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop',
    rules: [
      'Ensure a stable internet connection before starting.',
      'No external resources or calculators are permitted.',
      'The test must be completed in a single uninterrupted session.',
      'Timer cannot be paused once the assessment begins.',
    ],
  },
  {
    id: 2,
    name: 'MBA Trainee',
    description: 'Comprehensive evaluation of business acumen, strategic thinking, and leadership potential for MBA candidates.',
    duration: '30 mins',
    totalQuestions: 20,
    status: 'Current Test',
    imageUrl: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
  {
    id: 3,
    name: 'Logical Reasoning',
    description: 'Problem-solving and reasoning skills across abstract pattern recognition.',
    duration: '45 mins',
    totalQuestions: 30,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
  {
    id: 4,
    name: 'Technical Fundamentals',
    description: 'Basic IT, networking, and technical knowledge evaluation.',
    duration: '25 mins',
    totalQuestions: 25,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
  {
    id: 5,
    name: 'Aptitude Assessment',
    description: 'Numerical and verbal aptitude to assess quick analytical thinking.',
    duration: '50 mins',
    totalQuestions: 40,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
  {
    id: 6,
    name: 'Soft Skills Evaluation',
    description: 'Leadership, empathy, and teamwork assessment for workplace readiness.',
    duration: '35 mins',
    totalQuestions: 28,
    status: 'Upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
  {
    id: 7,
    name: 'Profile Verification',
    description: 'Background and credentials check to confirm your professional profile.',
    duration: '15 mins',
    totalQuestions: 10,
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
  {
    id: 8,
    name: 'Final Assessment',
    description: 'Comprehensive final evaluation combining all assessed skill domains.',
    duration: '90 mins',
    totalQuestions: 50,
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    rules: [],
  },
]

const statusConfig = {
  'Current Test': {
    label: '● ACTIVE',
    badgeClass: 'bg-emerald-500 text-white',
    ringClass: 'ring-2 ring-emerald-400 ring-offset-2',
  },
  Upcoming: {
    label: '○ UPCOMING',
    badgeClass: 'bg-white/90 text-blue-700 border border-blue-200',
    ringClass: '',
  },
  Completed: {
    label: '✓ DONE',
    badgeClass: 'bg-white/90 text-slate-600 border border-slate-300',
    ringClass: '',
  },
}

interface ModalData {
  isOpen: boolean
  assessment: Assessment | null
}

export default function AssessmentsPage() {
  const router = useRouter()
  const [modalData, setModalData] = useState<ModalData>({ isOpen: false, assessment: null })
  const [candidateId, setCandidateId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAssessmentClick = (assessment: Assessment) => {
    if (assessment.status !== 'Current Test') return
    if (assessment.id === 2) {
      router.push('/mba-test')
      return
    }
    setModalData({ isOpen: true, assessment })
  }

  const handleSubmit = async () => {
    if (!candidateId.trim()) {
      alert('Please enter your Candidate ID')
      return
    }
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (modalData.assessment) {
      localStorage.removeItem('answers')
      localStorage.setItem('candidateId', candidateId.trim())
      localStorage.setItem('testStartTime', new Date().toISOString())
      localStorage.setItem('answers', JSON.stringify({ sectionA: {}, sectionB: {}, sectionC: {}, sectionD: {} }))
      setModalData({ isOpen: false, assessment: null })
      setIsLoading(false)
      router.push('/section-a')
    }
  }

  const handleModalClose = () => {
    if (!isLoading) {
      setModalData({ isOpen: false, assessment: null })
      setCandidateId('')
    }
  }

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

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Page Header */}
        <header className="mb-8 p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg shadow-black/10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md mb-2 tracking-tight">Assessments</h1>
          <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl drop-shadow-sm">
            Select an assessment to begin. Only <span className="font-black text-emerald-300">Active</span> tests can be started.
          </p>
        </header>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {assessments.map((assessment) => {
            const cfg = statusConfig[assessment.status]
            const isActive = assessment.status === 'Current Test'
            return (
              <div
                key={assessment.id}
                onClick={() => handleAssessmentClick(assessment)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-black/20 transition-all duration-300 cursor-pointer ${isActive
                  ? `hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1 hover:bg-slate-900/80 ${cfg.ringClass}`
                  : 'opacity-75 hover:opacity-100 hover:bg-slate-900/80'
                  }`}
              >
                {/* Card Image */}
                <div className="relative h-40 sm:h-36 aspect-auto shrink-0 overflow-hidden">
                  <img
                    src={assessment.imageUrl}
                    alt={assessment.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-90 ${isActive ? 'group-hover:scale-105 opacity-100' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent mix-blend-multiply" />
                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-sm ${cfg.badgeClass}`}>
                    {cfg.label}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <h3 className={`font-black text-white text-lg leading-snug mb-2 ${isActive ? 'group-hover:text-blue-400 transition-colors' : ''}`}>
                    {assessment.name}
                  </h3>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed mb-5 flex-1">{assessment.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-300 font-bold border-t border-white/20 pt-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-300" /> <span className="drop-shadow-sm">{assessment.duration}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-300" /> <span className="drop-shadow-sm">{assessment.totalQuestions} Qs</span>
                    </span>
                  </div>
                </div>

                {/* Active CTA */}
                {isActive && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95">
                      Click to Start
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {modalData.isOpen && modalData.assessment && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={handleModalClose}
        >
          <div
            className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Image */}
            <div className="relative h-36 sm:h-48 w-full shrink-0">
              <img
                src={modalData.assessment.imageUrl}
                alt={modalData.assessment.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
                <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase mb-1">Assessment Details</p>
                <h2 className="text-lg sm:text-2xl font-extrabold leading-tight mb-1">{modalData.assessment.name}</h2>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {modalData.assessment.description}
                </p>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-4 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6 space-y-5">

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <Clock className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-800 text-sm">{modalData.assessment.duration}</p>
                  <p className="text-[11px] text-slate-500">Duration</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <HelpCircle className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <p className="font-bold text-slate-800 text-sm">{modalData.assessment.totalQuestions}</p>
                  <p className="text-[11px] text-slate-500">Questions</p>
                </div>
              </div>

              {/* Rules */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                  <span className="text-base">📋</span> Rules & Instructions
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  {(modalData.assessment.rules.length > 0
                    ? modalData.assessment.rules
                    : [
                      'Ensure you have a stable internet connection.',
                      'No external resources or calculators are permitted.',
                      `The test must be completed in a single session (${modalData.assessment.duration}).`,
                      'Timer cannot be paused once the assessment starts.',
                    ]
                  ).map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Candidate ID Input */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Candidate ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  placeholder="Enter your Candidate ID"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleModalClose}
                  disabled={isLoading}
                  className="flex-1 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-3 px-5 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                >
                  {isLoading ? 'Starting...' : '🚀 Start Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

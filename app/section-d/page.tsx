'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const passages = [
  {
    id: 1,
    title: 'Climate Change and Global Warming',
    text: 'Climate change represents one of the most pressing challenges facing humanity today. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become increasingly unpredictable. Scientists worldwide agree that human activities, particularly the burning of fossil fuels and deforestation, are the primary drivers of this phenomenon. The consequences are far-reaching, affecting ecosystems, agriculture, and human settlements. Immediate action is required to reduce greenhouse gas emissions and transition to renewable energy sources. International cooperation and policy reforms are essential to mitigate the worst effects of climate change and ensure a sustainable future for coming generations.',
    questions: [
      { id: 1, text: 'What is the main topic of the passage?', options: ['Technology', 'Climate Change', 'Agriculture', 'Energy'], answer: 'Climate Change' },
      { id: 2, text: 'According to the passage, what is the primary cause of climate change?', options: ['Natural disasters', 'Human activities', 'Solar radiation', 'Ocean currents'], answer: 'Human activities' },
      { id: 3, text: 'What does the passage suggest is necessary to address climate change?', options: ['More research', 'International cooperation', 'Population control', 'Space exploration'], answer: 'International cooperation' },
      { id: 4, text: 'What is the tone of the passage?', options: ['Humorous', 'Urgent and serious', 'Optimistic', 'Indifferent'], answer: 'Urgent and serious' }
    ]
  },
  {
    id: 2,
    title: 'The Digital Revolution in Education',
    text: 'The integration of technology in education has transformed traditional learning methods dramatically. Online platforms, virtual classrooms, and digital resources have made education more accessible to students worldwide. During the recent pandemic, educational institutions rapidly adopted remote learning technologies, demonstrating the resilience and adaptability of the education sector. However, this digital shift has also highlighted the digital divide, where students without access to technology or reliable internet face significant disadvantages. Educators are now exploring hybrid models that combine the best of both traditional and digital approaches. The future of education lies in leveraging technology while ensuring equitable access for all learners.',
    questions: [
      { id: 5, text: 'What is the main focus of this passage?', options: ['Pandemic response', 'Technology in education', 'Internet access', 'Teacher training'], answer: 'Technology in education' },
      { id: 6, text: 'What problem does the speaker highlight?', options: ['Lack of teachers', 'Digital divide', 'High costs', 'Poor infrastructure'], answer: 'Digital divide' },
      { id: 7, text: 'According to the passage, what did the pandemic demonstrate?', options: ['Education is unnecessary', 'Technology is expensive', 'Education sector adaptability', 'Students prefer online learning'], answer: 'Education sector adaptability' },
      { id: 8, text: 'What does the passage suggest about the future of education?', options: ['Fully online', 'Traditional only', 'Hybrid approach', 'Uncertain'], answer: 'Hybrid approach' }
    ]
  },
  {
    id: 3,
    title: 'The Importance of Mental Health Awareness',
    text: 'Mental health has emerged as a critical public health concern in recent years. The stigma surrounding mental illness is gradually diminishing as more people speak openly about their experiences. Workplace stress, social media pressure, and the fast-paced modern lifestyle contribute significantly to mental health challenges. Organizations are increasingly recognizing the importance of employee well-being and implementing mental health support programs. Early intervention and access to professional help can make a substantial difference in treatment outcomes. Public awareness campaigns and education are essential to normalize conversations about mental health and encourage people to seek help without fear of judgment.',
    questions: [
      { id: 9, text: 'What is the central theme of the passage?', options: ['Workplace productivity', 'Mental health awareness', 'Social media effects', 'Healthcare systems'], answer: 'Mental health awareness' },
      { id: 10, text: 'What change does the passage mention regarding mental health?', options: ['Increasing stigma', 'Decreasing stigma', 'No change', 'More confusion'], answer: 'Decreasing stigma' },
      { id: 11, text: 'What are organizations doing according to the passage?', options: ['Ignoring the issue', 'Implementing support programs', 'Reducing workload', 'Hiring more staff'], answer: 'Implementing support programs' },
      { id: 12, text: 'What does the passage emphasize as important?', options: ['Medication only', 'Early intervention', 'Isolation', 'Self-treatment'], answer: 'Early intervention' }
    ]
  },
  {
    id: 4,
    title: 'Sustainable Business Practices',
    text: 'Modern businesses are increasingly adopting sustainable practices to reduce their environmental impact and meet consumer expectations. Corporate social responsibility has evolved from a marketing strategy to a core business principle. Companies are investing in renewable energy, reducing waste, and implementing circular economy models. Consumers, particularly younger generations, are making purchasing decisions based on a company\'s environmental and social commitments. This shift is driving innovation in product design, supply chain management, and business operations. While sustainability initiatives may require initial investments, they often lead to long-term cost savings and enhanced brand reputation. The transition to sustainable business practices is not just ethically important but also economically advantageous.',
    questions: [
      { id: 13, text: 'What is the main subject of the passage?', options: ['Marketing strategies', 'Sustainable business practices', 'Consumer behavior', 'Product design'], answer: 'Sustainable business practices' },
      { id: 14, text: 'How has corporate social responsibility changed?', options: ['Become less important', 'Evolved to core principle', 'Remained the same', 'Been abandoned'], answer: 'Evolved to core principle' },
      { id: 15, text: 'What influences consumer purchasing decisions according to the passage?', options: ['Price only', 'Brand name', 'Environmental commitments', 'Advertising'], answer: 'Environmental commitments' },
      { id: 16, text: 'What does the passage conclude about sustainability?', options: ['Too expensive', 'Ethically and economically beneficial', 'Only for large companies', 'Temporary trend'], answer: 'Ethically and economically beneficial' }
    ]
  }
]

export default function SectionD() {
  const router = useRouter()
  const [currentPassage, setCurrentPassage] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const passage = passages[currentPassage]
  const question = passage.questions[currentQuestion]
  const globalQuestionNumber = passages.slice(0, currentPassage).reduce((sum, p) => sum + p.questions.length, 0) + currentQuestion + 1

  useEffect(() => {
    setAudioPlayed(false)
    setShowQuestions(false)
    setCurrentQuestion(0)

    const savedAnswers = JSON.parse(localStorage.getItem('answers') || '{}')
    if (savedAnswers.sectionD) {
      setAnswers(savedAnswers.sectionD)
    }
  }, [currentPassage])

  useEffect(() => {
    setSelectedAnswer(answers[question.id] || '')
  }, [currentQuestion, answers])

  useEffect(() => {
    const interval = setInterval(() => {
      const progress = {
        section: 'D',
        currentPassage,
        currentQuestion,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('progress', JSON.stringify(progress))
    }, 3000)
    return () => clearInterval(interval)
  }, [currentPassage, currentQuestion])

  const playPassageAudio = () => {
    if (audioPlayed || isPlaying) return

    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(passage.text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      setAudioPlayed(true)
      setShowQuestions(true)
      setIsPlaying(false)
    }

    speechSynthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const saveAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const newAnswers = { ...answers, [question.id]: answer }
    setAnswers(newAnswers)

    const allAnswers = JSON.parse(localStorage.getItem('answers') || '{}')
    allAnswers.sectionD = newAnswers
    localStorage.setItem('answers', JSON.stringify(allAnswers))
  }

  const nextQuestion = () => {
    if (currentQuestion < passage.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (currentPassage < passages.length - 1) {
      setCurrentPassage(currentPassage + 1)
    } else {
      router.push('/finish')
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const totalQuestions = passages.reduce((sum, p) => sum + p.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100

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

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 relative z-10">
        {/* Header */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/30 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">🅳 Section D</h1>
              <p className="text-slate-300 drop-shadow-sm text-sm">Listening Comprehension</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-300 drop-shadow-sm">Passage</div>
              <div className="text-xl font-bold text-orange-600">{currentPassage + 1} / 4</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-300 drop-shadow-sm mt-2">
              <span>Answered: {answeredQuestions}/16</span>
              <span>Progress: {Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {!showQuestions ? (
          <>
            {/* Audio Passage */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 mb-6">
              <div className="mb-6 border-b pb-4">
                <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-black tracking-widest shadow-sm border border-orange-200 text-xs">
                  Passage {currentPassage + 1}: {passage.title}
                </span>
              </div>

              <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 shadow-inner">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4 drop-shadow-sm">🎧</div>
                  <h2 className="text-2xl font-black text-white drop-shadow-md mb-2">
                    Listen Carefully
                  </h2>
                  <p className="text-slate-300 drop-shadow-sm font-medium">
                    The audio will play ONCE. You cannot replay, pause, or rewind.
                  </p>
                </div>

                <button
                  onClick={playPassageAudio}
                  disabled={audioPlayed || isPlaying}
                  className={`w-full py-5 px-6 rounded-xl font-black text-xl tracking-wide transition-all shadow-xl hover:-translate-y-1 ${audioPlayed
                    ? 'bg-slate-200 text-slate-300 drop-shadow-sm shadow-none cursor-not-allowed hover:translate-y-0'
                    : isPlaying
                      ? 'bg-orange-500 text-white animate-pulse'
                      : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-500/40'
                    }`}
                >
                  {isPlaying ? '🔊 Playing... Listen Carefully' : audioPlayed ? '✓ Audio Played (No Replay)' : '▶️ Play Passage Audio'}
                </button>

                {isPlaying && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="ml-2 text-yellow-800 font-semibold text-sm">Audio playing...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 p-5 bg-red-500/20 backdrop-blur border-l-4 border-red-500 rounded-2xl shadow-inner">
                <h3 className="font-bold text-red-900 mb-2 tracking-wide">⚠️ Important:</h3>
                <ul className="space-y-2 text-red-800 text-sm font-medium">
                  <li>• Audio plays ONE time only</li>
                  <li>• No pause, replay, or rewind</li>
                  <li>• Listen for main ideas, details, and speaker's purpose</li>
                  <li>• Questions will appear after audio ends</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Questions */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 mb-6">
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-black tracking-widest uppercase shadow-sm border border-orange-200 text-xs">
                    Passage {currentPassage + 1} - Question {currentQuestion + 1} of 4
                  </span>
                  <span className="text-sm font-bold text-slate-300 drop-shadow-sm tracking-widest uppercase">
                    Overall: Q{globalQuestionNumber}/16
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {globalQuestionNumber}
                  </div>
                  <h2 className="text-lg font-bold text-white drop-shadow-md">
                    {question.text}
                  </h2>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedAnswer === option
                      ? 'border-orange-600 bg-orange-50 shadow-sm'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                      }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => saveAnswer(e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className={`ml-3 text-sm ${selectedAnswer === option ? 'font-semibold text-orange-900' : 'text-gray-700'}`}>
                      {option}
                    </span>
                    {selectedAnswer === option && (
                      <svg className="ml-auto w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>

              {selectedAnswer && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-500/20 backdrop-blur rounded-2xl border-2 border-emerald-500/40 shadow-inner">
                  <span className="text-emerald-300 font-bold text-base tracking-wide">✓ Answer saved automatically</span>
                </div>
              )}
            </div>

            {/* Passage Progress */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 sm:p-8 mb-6">
              <h3 className="font-bold text-white drop-shadow-md mb-3 text-base tracking-wide">Passage Progress:</h3>
              <div className="flex gap-2">
                {passage.questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded-full ${idx < currentQuestion ? 'bg-emerald-500/20 backdrop-blur0' :
                      idx === currentQuestion ? 'bg-orange-500' :
                        'bg-slate-200'
                      }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-300 drop-shadow-sm uppercase tracking-widest mt-4">
                <span>Question {currentQuestion + 1} of 4</span>
                <span>{passage.title}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur px-8 py-5 rounded-2xl border border-white/20 shadow-lg">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`font-black px-6 py-3 rounded-xl transition-all shadow-md ${currentQuestion === 0 ? 'bg-white/10 text-slate-500 shadow-none cursor-not-allowed border border-white/10' : 'bg-slate-100 text-slate-200 hover:bg-slate-200 border border-slate-300'
                  }`}
              >
                ← Previous
              </button>

              <div className="text-sm font-bold text-slate-300 drop-shadow-sm uppercase tracking-widest">
                {answeredQuestions} of 16 answered
              </div>

              <button
                onClick={nextQuestion}
                disabled={!selectedAnswer}
                className={`font-black text-lg px-10 py-3 rounded-xl transition-all shadow-xl ${!selectedAnswer ? 'bg-white/10 text-slate-500 shadow-none cursor-not-allowed border border-white/10' : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-500/40 hover:-translate-y-1'
                  }`}
              >
                {currentQuestion < passage.questions.length - 1
                  ? 'Next Question →'
                  : currentPassage < passages.length - 1
                    ? 'Next Passage →'
                    : 'Finish Test →'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

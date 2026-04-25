'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// 18 Read Aloud Questions (increasing difficulty)
const readAloudQuestions = [
  { id: 1, text: 'The vibrant flowers bloomed in the garden.', timer: 15 },
  { id: 2, text: 'Technology has significantly changed how people communicate today.', timer: 15 },
  { id: 3, text: 'The conference will be held next month in the downtown convention center.', timer: 18 },
  { id: 4, text: 'Effective communication skills are essential for professional success in any field.', timer: 18 },
  { id: 5, text: 'Global warming is becoming a serious concern for scientists and policymakers worldwide.', timer: 18 },
  { id: 6, text: 'The company announced a new initiative to promote sustainability and reduce carbon emissions.', timer: 20 },
  { id: 7, text: 'Despite the heavy rain, the event continued as planned with enthusiastic participation from attendees.', timer: 20 },
  { id: 8, text: 'Artificial intelligence is transforming industries by automating complex tasks and improving efficiency.', timer: 20 },
  { id: 9, text: 'The research team discovered groundbreaking evidence that could revolutionize our understanding of climate patterns.', timer: 20 },
  { id: 10, text: 'Customer satisfaction remains our top priority, and we continuously strive to exceed expectations through innovative solutions.', timer: 20 },
  { id: 11, text: 'The digital transformation has enabled businesses to reach global markets, streamline operations, and enhance customer experiences through data-driven insights.', timer: 20 },
  { id: 12, text: 'Educational institutions are adopting new teaching methodologies that emphasize critical thinking, creativity, and collaborative problem-solving skills.', timer: 20 },
  { id: 13, text: 'The healthcare industry is experiencing rapid advancements in medical technology, enabling early disease detection and personalized treatment plans for patients.', timer: 20 },
  { id: 14, text: 'Sustainable development requires balancing economic growth with environmental protection, ensuring that future generations inherit a healthy planet with abundant natural resources.', timer: 20 },
  { id: 15, text: 'Cross-cultural communication plays a vital role in international business, requiring professionals to understand diverse perspectives, customs, and communication styles to build successful partnerships.', timer: 20 },
  { id: 16, text: 'The rapid pace of technological innovation presents both opportunities and challenges for organizations, necessitating continuous learning and adaptation to remain competitive in the global marketplace.', timer: 20 },
  { id: 17, text: 'Leadership development programs focus on cultivating essential skills such as strategic thinking, emotional intelligence, and effective decision-making, preparing individuals to navigate complex organizational challenges.', timer: 20 },
  { id: 18, text: 'The integration of renewable energy sources into existing power grids requires substantial infrastructure investments, policy reforms, and technological innovations to ensure reliable, sustainable electricity supply for growing populations.', timer: 20 },
]

// 5 Listen and Repeat Questions
const listenRepeatQuestions = [
  { id: 19, text: 'The meeting has been rescheduled to Monday morning.', timer: 15 },
  { id: 20, text: 'Global warming is becoming a serious concern worldwide.', timer: 15 },
  { id: 21, text: 'Please submit your reports by the end of this week.', timer: 15 },
  { id: 22, text: 'The project deadline has been extended by two weeks.', timer: 15 },
  { id: 23, text: 'Customer feedback is essential for improving our services.', timer: 15 },
]

export default function SectionA() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isRecording, setIsRecording] = useState(false)
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [recordingDone, setRecordingDone] = useState(false)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [warnings, setWarnings] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const allQuestions = [...readAloudQuestions, ...listenRepeatQuestions]
  const question = allQuestions[currentQ]
  const isListenRepeat = currentQ >= 18
  const questionType = isListenRepeat ? 'Listen and Repeat' : 'Read Aloud'

  useEffect(() => {
    checkMicrophone()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1)
        setWarnings(prev => [...prev, '⚠️ Tab switch detected! Stay on this page.'])
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    setTimeLeft(question.timer)
    setAudioPlayed(false)
    setRecordingDone(false)
    setIsPlaying(false)

    const answers = JSON.parse(localStorage.getItem('answers') || '{}')
    if (answers.sectionA?.[question.id]) {
      setRecordingDone(true)
    }
  }, [currentQ])

  useEffect(() => {
    if (timeLeft > 0 && !isRecording) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, isRecording])

  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress()
    }, 3000)
    return () => clearInterval(interval)
  }, [currentQ])

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      setWarnings(prev => [...prev, '🎤 Microphone access denied! Please enable it.'])
    }
  }

  const playAudioSentence = () => {
    if (audioPlayed || !isListenRepeat) return

    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(question.text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      setAudioPlayed(true)
      setIsPlaying(false)
    }

    speechSynthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = async () => {
    if (isRecording || recordingDone) return
    if (isListenRepeat && !audioPlayed) {
      setWarnings(prev => [...prev, '⚠️ Please play the audio first!'])
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await uploadAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setWarnings(prev => [...prev, '❌ Failed to start recording. Check microphone.'])
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingDone(true)
    }
  }

  const uploadAudio = async (blob: Blob) => {
    const formData = new FormData()
    formData.append('audio', blob, `section-a-q${question.id}.webm`)
    formData.append('questionId', `a-${question.id}`)

    try {
      const response = await fetch('/api/uploadAudio', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      const answers = JSON.parse(localStorage.getItem('answers') || '{}')
      answers.sectionA = answers.sectionA || {}
      answers.sectionA[question.id] = {
        fileId: data.fileId,
        timestamp: new Date().toISOString(),
        type: questionType
      }
      localStorage.setItem('answers', JSON.stringify(answers))
    } catch (err) {
      setWarnings(prev => [...prev, '❌ Failed to upload audio. Please try again.'])
    }
  }

  const saveProgress = () => {
    const progress = {
      section: 'A',
      currentQuestion: currentQ,
      tabSwitches,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('progress', JSON.stringify(progress))
  }

  const nextQuestion = () => {
    if (currentQ < allQuestions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      router.push('/section-b')
    }
  }

  const progress = ((currentQ + 1) / allQuestions.length) * 100

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

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/10 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-md">🅰️ Section A</h1>
              <p className="text-slate-200 drop-shadow-sm">Reading & Listening</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-300 uppercase tracking-widest drop-shadow-sm">Question</div>
              <div className="text-2xl font-black text-blue-300 drop-shadow-sm">{currentQ + 1} / 23</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-3 bg-white/10 border border-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mt-2 drop-shadow-sm uppercase tracking-wider">
              <span>Read Aloud: 1-18</span>
              <span>Listen & Repeat: 19-23</span>
            </div>
          </div>

          <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm rounded-full font-black mb-2 shadow-sm uppercase tracking-widest text-xs">
            {questionType} - Question {currentQ + 1}
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 space-y-2">
            {warnings.slice(-3).map((w, i) => (
              <div key={i} className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/40 rounded-2xl text-red-200 font-bold shadow-sm animate-in fade-in slide-in-from-top-2">
                {w}
              </div>
            ))}
          </div>
        )}

        {/* Timer */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6 mb-6 text-center">
          <div className="text-sm font-black tracking-widest uppercase text-slate-300 mb-2 drop-shadow-sm">Time Remaining</div>
          <div className="text-6xl font-black text-white drop-shadow-md">
            {timeLeft}s
          </div>
        </div>

        {/* Question Content */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/10 p-6 sm:p-10 mb-6">
          {!isListenRepeat ? (
            <>
              <h2 className="text-xl font-bold mb-6 text-white drop-shadow-md border-b border-white/20 pb-4">
                📖 Read the following text aloud:
              </h2>
              <div className="text-3xl font-medium leading-relaxed text-white bg-white/5 border border-white/20 rounded-2xl p-8 shadow-inner">
                {question.text}
              </div>
              <p className="font-bold text-slate-300 mt-6 flex items-center gap-2 drop-shadow-sm">
                <span className="text-amber-400 text-xl">💡</span> Read clearly and naturally. You have {question.timer} seconds.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6 text-white drop-shadow-md border-b border-white/20 pb-4">
                🎧 Listen and repeat exactly what you hear:
              </h2>
              <div className="p-8 bg-white/5 rounded-2xl border border-white/20 shadow-inner">
                <button
                  onClick={playAudioSentence}
                  disabled={audioPlayed || isPlaying}
                  className={`w-full py-5 px-6 rounded-xl font-black text-xl tracking-wide transition-all shadow-xl hover:-translate-y-1 ${audioPlayed
                    ? 'bg-white/10 text-slate-500 shadow-none cursor-not-allowed hover:translate-y-0 border border-white/10'
                    : isPlaying
                      ? 'bg-amber-500/80 backdrop-blur text-white animate-pulse'
                      : 'bg-blue-600/80 backdrop-blur text-white hover:bg-blue-600 hover:shadow-blue-500/40'
                    }`}
                >
                  {isPlaying ? '🔊 Playing... Listen Carefully' : audioPlayed ? '✓ Audio Played (No Replay)' : '▶️ Play Audio Once'}
                </button>
              </div>
              <p className="font-bold text-slate-300 mt-6 flex items-center gap-2 drop-shadow-sm">
                <span className="text-amber-400 text-xl">⚠️</span> Audio plays ONCE only. Listen carefully and repeat exactly.
              </p>
            </>
          )}
        </div>

        {/* Recording Controls */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/10 p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-bold mb-6 text-white drop-shadow-md">🎤 Your Recording:</h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={startRecording}
              disabled={isRecording || recordingDone || (isListenRepeat && !audioPlayed)}
              className={`flex-1 min-w-[200px] py-4 px-6 rounded-xl font-black text-lg tracking-wide transition-all shadow-xl hover:-translate-y-1 ${isRecording || recordingDone || (isListenRepeat && !audioPlayed)
                ? 'bg-white/10 text-slate-400 shadow-none cursor-not-allowed hover:translate-y-0 border border-white/10'
                : 'bg-emerald-600/80 backdrop-blur border border-emerald-500/30 text-white hover:bg-emerald-600 hover:shadow-emerald-500/40'
                }`}
            >
              {isRecording ? '🔴 Recording...' : recordingDone ? '✓ Recorded' : '🎤 Start Recording'}
            </button>

            {isRecording && (
              <button
                onClick={stopRecording}
                className="flex-1 min-w-[200px] py-4 px-6 rounded-xl font-black text-lg text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/40 transition-all hover:-translate-y-1 border border-red-500/30"
              >
                ⏹️ Stop Recording
              </button>
            )}
          </div>

          {isRecording && (
            <div className="mt-6 flex items-center justify-center gap-3 p-5 bg-red-500/20 backdrop-blur rounded-2xl border border-red-500/40 shadow-inner">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-xl shadow-red-500" />
              <span className="text-red-200 font-bold text-xl tracking-wide drop-shadow-sm">Recording in progress...</span>
            </div>
          )}

          {recordingDone && (
            <div className="mt-6 flex items-center justify-center gap-3 p-5 bg-emerald-500/20 backdrop-blur rounded-2xl border border-emerald-500/40 shadow-inner">
              <span className="text-emerald-100 font-bold text-lg drop-shadow-sm">✓ Recording uploaded successfully! Click Next to continue.</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/20 shadow-lg shadow-black/10">
          <div className="text-sm font-bold text-slate-300 uppercase tracking-widest drop-shadow-sm">
            Tab switches: {tabSwitches}
          </div>
          <button
            onClick={nextQuestion}
            disabled={!recordingDone}
            className={`text-lg font-black px-10 py-4 rounded-xl transition-all shadow-xl ${!recordingDone ? 'bg-white/10 text-slate-500 shadow-none cursor-not-allowed border border-white/10' : 'bg-blue-600/90 backdrop-blur border border-blue-500/30 text-white hover:bg-blue-600 hover:shadow-blue-500/40 hover:-translate-y-1'
              }`}
          >
            {currentQ < allQuestions.length - 1 ? 'Next Question →' : 'Go to Section B →'}
          </button>
        </div>
      </div>
    </main>
  )
}

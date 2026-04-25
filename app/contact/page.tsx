'use client'

import { useState } from 'react'
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }, 800)
  }

  const contactMethods = [
    { icon: PhoneCall, label: 'Phone', value: '+1 (800) 123-4567', desc: 'Toll-free 24/7' },
    { icon: Mail, label: 'Email', value: 'support@thiranzihub.com', desc: 'We reply within 2 hrs' },
    { icon: MapPin, label: 'Headquarters', value: 'iHUB, ThiranZ', desc: 'Innovation Wing' },
    { icon: Clock, label: 'Business Hours', value: 'Mon - Fri, 9AM - 6PM EST', desc: 'Weekend support available for Pro' },
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

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-sm text-sm font-bold text-white tracking-widest uppercase mb-4">
            Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto font-medium drop-shadow-md">
            Need assistance or have feedback? Reach out to our dedicated support squad. We're here to help you succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Contact Details Panel */}
          <div className="lg:col-span-2 space-y-4">
            {contactMethods.map((method, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/10 p-5 flex items-start gap-4 transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <method.icon className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300 tracking-wider uppercase mb-0.5">{method.label}</p>
                  <p className="font-bold text-white text-base mb-0.5 drop-shadow-sm">{method.value}</p>
                  <p className="text-xs font-medium text-slate-200">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Panel */}
          <div className="lg:col-span-3 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/10 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white drop-shadow-md">Send a Message</h2>
            </div>

            {submitted && (
              <div className="mb-8 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
                <p className="text-sm text-emerald-100 font-semibold drop-shadow-sm">Message delivered successfully! Our team will respond shortly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white/10 transition-all outline-none font-medium text-sm"
                    placeholder="name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white/10 transition-all outline-none font-medium text-sm"
                    placeholder="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white/10 transition-all outline-none font-medium text-sm [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing & Access</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 focus:bg-white/10 transition-all outline-none font-medium text-sm resize-y"
                  placeholder="How can we help you today?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

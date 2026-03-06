'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Zap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
    } else {
      router.replace('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C8F135]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-3xl bg-[#2F2F2F] flex items-center justify-center mb-5 shadow-lg">
            {/* Flüxa wordmark placeholder */}
            <span className="text-white font-bold text-lg font-display tracking-tight">Fl</span>
          </div>
          <h1 className="text-2xl font-bold text-ink font-display tracking-tight">Bem-vindo ao Flüxa</h1>
          <p className="text-sm text-ink-muted mt-1">Entre com sua conta para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E8E6] p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 text-base font-semibold flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-muted mt-6">
          Flüxa CRM · Acesso restrito
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { Camera, LogOut, Save, User, Briefcase, Mail } from 'lucide-react'

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || '')
  const [role, setRole] = useState(user?.user_metadata?.role || 'Vendedor')
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { name, role, avatar_url: avatar }
    })
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    // Convert to base64 data URL for preview (in prod, upload to Supabase Storage)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Configurações" subtitle="Gerencie seu perfil" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-lg mx-auto space-y-6">

          {/* Profile card */}
          <div className="card-base p-8">
            <h3 className="text-base font-bold text-ink font-display mb-6">Perfil do Usuário</h3>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-2xl text-white font-bold overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : initials}
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2F2F2F] rounded-full flex items-center justify-center shadow-md hover:bg-black transition-colors">
                  {uploading
                    ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Camera className="w-3.5 h-3.5 text-white" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{name}</p>
                <p className="text-xs text-ink-muted">{user?.email}</p>
                <p className="text-xs text-ink-muted mt-0.5 bg-[#F4F4F2] px-2 py-0.5 rounded-lg inline-block mt-1">{role}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                  <User className="w-3 h-3" /> Nome de exibição
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-base" placeholder="Seu nome..." />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input type="text" value={user?.email || ''} disabled
                  className="input-base opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">
                  <Briefcase className="w-3 h-3" /> Cargo
                </label>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                  className="input-base" placeholder="Ex: Vendedor, Gerente..." />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
              {saving
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saved ? '✓ Salvo!' : 'Salvar alterações'}
            </button>
          </div>

          {/* Danger zone */}
          <div className="card-base p-6">
            <h3 className="text-sm font-bold text-ink font-display mb-1">Sessão</h3>
            <p className="text-xs text-ink-muted mb-4">Encerre sua sessão em todos os dispositivos.</p>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-2xl transition-all">
              <LogOut className="w-4 h-4" /> Sair da conta
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

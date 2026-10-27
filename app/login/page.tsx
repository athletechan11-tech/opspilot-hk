'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">{isSignUp ? '註冊' : '登入'}</h1>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-black" required />
        <input type="password" placeholder="密碼" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-black" required />
        <button className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium hover:bg-indigo-700 transition">
          {isSignUp ? '註冊' : '登入'}
        </button>
        <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-sm text-indigo-600 hover:underline">
          {isSignUp ? '已經有帳號？登入' : '未有帳號？註冊'}
        </button>
      </form>
    </div>
  )
}

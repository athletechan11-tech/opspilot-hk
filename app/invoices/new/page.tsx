'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewInvoice() {
  const [customerName, setCustomerName] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase.from('invoices').insert({
        customer_name: customerName,
        amount: parseFloat(amount),
        user_id: user.id
      })

      if (error) {
        alert('儲存失敗：' + error.message)
        setLoading(false)
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto text-slate-800">
      <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← 返回上一頁
      </button>
      
      <h1 className="text-2xl font-bold mb-6">新增發票</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm space-y-4 border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">客戶名稱</label>
          <input 
            type="text" 
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-black"
            placeholder="例如：陳記貿易"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">金額 (HKD)</label>
          <input 
            type="number" 
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-black"
            placeholder="0.00"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 text-white rounded-lg py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? '儲存中...' : '儲存發票'}
        </button>
      </form>
    </div>
  )
}

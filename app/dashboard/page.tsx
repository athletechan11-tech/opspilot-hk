'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data: invoicesData } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })

    if (invoicesData) setInvoices(invoicesData)
    setLoading(false)
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation() // 防止觸發跳去詳情頁
    if (!window.confirm('確定要刪除呢張發票嗎？')) return
    
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (!error) {
      setInvoices(invoices.filter(inv => inv.id !== id))
    } else {
      alert('刪除失敗：' + error.message)
    }
  }

  async function toggleStatus(e: React.MouseEvent, id: string, currentStatus: string) {
    e.stopPropagation() // 防止觸發跳去詳情頁
    const newStatus = currentStatus === 'unpaid' ? 'paid' : 'unpaid'
    
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', id)
      
    if (!error) {
      setInvoices(invoices.map(inv => 
        inv.id === id ? { ...inv, status: newStatus } : inv
      ))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>

  const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0)

  return (
    <div className="p-8 max-w-4xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold">OpsPilot HK</h1>
          <p className="text-sm text-slate-500">歡迎，{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition">
          登出
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-2">建立新發票</h2>
          <p className="text-slate-500 text-sm mb-4">為你嘅客戶建立一張新嘅報價單或發票。</p>
          <a href="/invoices/new" className="block text-center bg-indigo-600 text-white px-4 py-2.5 rounded-lg w-full font-medium hover:bg-indigo-700 transition">
            + 新增發票
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-2">總收入概況</h2>
          <p className="text-slate-500 text-sm mb-4">所有已開出嘅發票總額。</p>
          <div className="text-3xl font-bold text-slate-800">
            HKD {totalAmount.toLocaleString('en-HK', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-700">最近發票</h2>
        </div>
        
        {invoices.length === 0 ? (
          <div className="p-8 text-center text-slate-500">暫時未有發票紀錄。</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <div 
                key={inv.id} 
               onClick={() => router.push(`/invoices/view?id=${inv.id}`)}
                className="p-4 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
              >
                <div>
                  <div className="font-medium">{inv.customer_name}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(inv.created_at).toLocaleDateString('zh-HK')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-semibold">
                      HKD {Number(inv.amount).toLocaleString('en-HK', { minimumFractionDigits: 2 })}
                    </div>
                    <button 
                      onClick={(e) => toggleStatus(e, inv.id, inv.status)}
                      className={`text-xs px-2 py-1 rounded-full inline-block mt-1 transition ${
                        inv.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {inv.status === 'paid' ? '已付款' : '未付款'}
                    </button>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, inv.id)}
                    className="text-slate-300 hover:text-red-500 transition p-2 text-lg"
                    title="刪除發票"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

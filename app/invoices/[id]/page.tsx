'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

export default function InvoiceDetail() {
  const pathname = usePathname()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoice() {
      // 直接從網址拆解出 id
      const id = pathname.split('/').pop()
      if (!id) return

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) setInvoice(data)
      if (error) console.error(error)
      setLoading(false)
    }
    fetchInvoice()
  }, [pathname])

  if (loading) return <div className="p-8 text-center">載入中...</div>
  if (!invoice) return <div className="p-8 text-center text-red-500">搵唔到呢張發票。</div>

  return (
    <div className="p-8 max-w-2xl mx-auto text-slate-800">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button onClick={() => router.push('/dashboard')} className="text-sm text-indigo-600 hover:underline">
          ← 返回儀表板
        </button>
        <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition">
          🖨️ 列印 / 儲存 PDF
        </button>
      </div>

      <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">INVOICE</h1>
            <p className="text-slate-500 mt-1">發票編號: {invoice.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">OpsPilot HK</div>
            <div className="text-sm text-slate-500">香港中小企營運助手</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-1">客戶名稱</h3>
            <div className="font-medium text-lg">{invoice.customer_name}</div>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-1">開立日期</h3>
            <div>{new Date(invoice.created_at).toLocaleDateString('zh-HK')}</div>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
              <th className="pb-2">項目描述</th>
              <th className="pb-2 text-right">金額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 border-b border-slate-100">服務費用 / 貨品</td>
              <td className="py-4 border-b border-slate-100 text-right font-mono">
                HKD {Number(invoice.amount).toLocaleString('en-HK', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-slate-800">
              <span>總計 (HKD)</span>
              <span className="font-mono">
                {Number(invoice.amount).toLocaleString('en-HK', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
          多謝惠顧！如有任何查詢，請隨時聯絡我們。
        </div>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const fmt = (n: number) => '₹' + (n / 100000).toFixed(1) + 'L'

const levelColor = (level: string) => {
  if (['L5','E4','L59','A'].includes(level)) return 'bg-blue-100 text-blue-700 border-blue-200'
  if (['L4','E3','SDE2'].includes(level)) return 'bg-violet-100 text-violet-700 border-violet-200'
  if (['L6','L62'].includes(level)) return 'bg-purple-100 text-purple-700 border-purple-200'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

const levelBarColor = (level: string) => {
  if (['L5','E4','L59','A'].includes(level)) return 'from-blue-400 to-indigo-500'
  if (['L4','E3','SDE2'].includes(level)) return 'from-violet-400 to-purple-500'
  if (['L6','L62'].includes(level)) return 'from-purple-500 to-pink-500'
  return 'from-gray-300 to-gray-400'
}

export default function CompanyPage() {
  const { company } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/company/${company}`).then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [company])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-300 text-lg">Loading...</div>
  if (data?.error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-400">Company not found.</div>

  const maxTC = Math.max(...data.salaries.map((s: any) => s.total_compensation))

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-50 text-gray-900">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <nav className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">C</div>
          <a href="/" className="font-bold text-lg tracking-tight">CompIntel</a>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="/salaries" className="hover:text-gray-900 transition-colors">Salaries</a>
          <a href="/compare" className="hover:text-gray-900 transition-colors">Compare</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <a href="/salaries" className="inline-flex items-center gap-1 text-gray-400 text-sm hover:text-violet-600 transition-colors mb-8 font-medium">
          ← Back to salaries
        </a>

        {/* Company header */}
        <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-lg shadow-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold capitalize tracking-tight mb-1">{company}</h1>
              <p className="text-violet-200">{data.salaries.length} compensation entries</p>
            </div>
            <div className="text-right bg-white/10 rounded-2xl px-8 py-5 backdrop-blur-sm">
              <div className="text-xs text-violet-200 uppercase tracking-widest mb-1">Median TC</div>
              <div className="text-3xl font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(data.median)}</div>
            </div>
          </div>
        </div>

        {/* Level distribution */}
        <div className="mb-8">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-semibold">Level distribution</div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(data.levelDistribution).map(([level, count]) => (
              <div key={level} className={`border-2 rounded-2xl px-5 py-3 text-center min-w-24 ${levelColor(level)}`}>
                <div className="text-xl font-bold">{level}</div>
                <div className="text-xs opacity-60 mt-0.5">{count as number} {(count as number) === 1 ? 'entry' : 'entries'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary cards */}
        <div className="space-y-4">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-semibold">Compensation breakdown</div>
          {data.salaries.map((s: any) => (
            <div key={s.id} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 ${levelColor(s.level)}`}>{s.level}</span>
                  <span className="text-gray-700 font-medium">{s.role}</span>
                  <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">{s.location}</span>
                  <span className="text-gray-400 text-xs">{s.experience_years}y exp</span>
                </div>
                <span className="text-violet-600 font-bold text-lg" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(s.total_compensation)}</span>
              </div>
              {/* TC bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full bg-gradient-to-r ${levelBarColor(s.level)} rounded-full transition-all`}
                  style={{ width: `${(s.total_compensation / maxTC) * 100}%` }} />
              </div>
              <div className="flex gap-6 text-xs font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
                <span className="text-gray-600">Base <span className="text-gray-900">{fmt(s.base_salary)}</span></span>
                <span className="text-gray-600">Bonus <span className="text-indigo-600">{fmt(s.bonus)}</span></span>
                <span className="text-gray-600">Stock <span className="text-pink-600">{fmt(s.stock)}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
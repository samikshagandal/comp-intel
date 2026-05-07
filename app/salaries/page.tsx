'use client'
import { useEffect, useState } from 'react'

interface Salary {
  id: number; company: string; role: string; level: string
  location: string; experience_years: number; base_salary: number
  bonus: number; stock: number; total_compensation: number
}

const fmt = (n: number) => '₹' + (n / 100000).toFixed(1) + 'L'

const levelColor = (level: string) => {
  if (['L6', 'L62', 'SDE3', 'E5'].some(l => level.includes(l))) return 'bg-purple-100 text-purple-700 border-purple-200'
  if (['L5', 'E4', 'L59', 'A'].includes(level)) return 'bg-blue-100 text-blue-700 border-blue-200'
  if (['L4', 'E3', 'SDE2'].includes(level)) return 'bg-violet-100 text-violet-700 border-violet-200'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ company: '', role: '', level: '', location: '' })
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fetchWithFilters = async (f: typeof filters, dir: 'asc' | 'desc' = 'desc') => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(f).forEach(([k, v]) => v && params.set(k, v))
    params.set('sort', dir)
    const res = await fetch('/api/salaries?' + params.toString())
    setSalaries(await res.json())
    setLoading(false)
  }
useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initial = {
      company: params.get('company') || '',
      role: params.get('role') || '',
      level: params.get('level') || '',
      location: params.get('location') || '',
    }
    setFilters(initial)
    fetchWithFilters(initial, 'desc')
  }, [])

  const fetchSalaries = (dir?: 'asc' | 'desc') => {
    fetchWithFilters(filters, dir || sortDir)
  }

  const toggleSort = () => {
    const newDir = sortDir === 'desc' ? 'asc' : 'desc'
    setSortDir(newDir)
    fetchWithFilters(filters, newDir)
  }

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-50 text-gray-900">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <nav className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">C</div>
          <a href="/" className="font-bold text-lg tracking-tight">CompIntel</a>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="/salaries" className="text-violet-600 font-semibold">Salaries</a>
          <a href="/companies" className="hover:text-gray-900 transition-colors">Companies</a>
          <a href="/compare" className="hover:text-gray-900 transition-colors">Compare</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Salary Table</h1>
            <p className="text-gray-600 text-sm mt-1 font-medium">{salaries.length} entries · sorted by total compensation</p>
          </div>
          <div className="flex gap-2">
            {['google', 'amazon', 'meta'].map(co => (
              <button key={co} onClick={() => {
                const f = { company: co, role: '', level: '', location: '' }
                setFilters(f)
                fetchWithFilters(f, sortDir)
              }}
                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-all capitalize font-medium">
                {co}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-4 gap-3 mb-3">
            {(['company', 'role', 'level', 'location'] as const).map(f => (
              <input key={f}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all bg-white text-gray-800"
                value={filters[f]}
                onChange={e => setFilters(p => ({ ...p, [f]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && fetchSalaries()}
              />
            ))}
          </div>
          <button onClick={() => fetchSalaries()}
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="text-center py-32 text-gray-500 text-lg">Loading...</div>
        ) : salaries.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-gray-100">
            <div className="text-gray-500 font-semibold text-lg">No results found</div>
            <div className="text-gray-400 text-sm mt-1">Try adjusting your filters</div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  {['Company', 'Role', 'Level', 'Location', 'Exp', 'Base', 'Bonus', 'Stock'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                  <th onClick={toggleSort}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    Total TC {sortDir === 'desc' ? '↓' : '↑'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s, i) => (
                  <tr key={s.id} className={`border-b border-gray-50 hover:bg-violet-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-4">
                      <a href={`/company/${s.company}`} className="font-semibold capitalize hover:text-violet-600 transition-colors">{s.company}</a>
                    </td>
                    <td className="px-5 py-4 text-gray-800">{s.role}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${levelColor(s.level)}`}>{s.level}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-800">{s.location}</td>
                    <td className="px-5 py-4 text-gray-800">{s.experience_years}y</td>
                    <td className="px-5 py-4 text-gray-900 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(s.base_salary)}</td>
                    <td className="px-5 py-4 text-gray-900 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(s.bonus)}</td>
                    <td className="px-5 py-4 text-gray-900 font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(s.stock)}</td>
                    <td className="px-5 py-4 font-bold text-violet-600" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(s.total_compensation)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
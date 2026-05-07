'use client'
import { useEffect, useState } from 'react'

const fmt = (n: number) => '₹' + (n / 100000).toFixed(1) + 'L'

const companyInitial = (name: string) => name.charAt(0).toUpperCase()

const companyColor = (name: string) => {
  const colors = [
    'from-violet-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-cyan-500',
    'from-fuchsia-500 to-purple-500',
    'from-red-500 to-pink-500',
    'from-green-500 to-emerald-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const levelColor = (level: string) => {
  if (['L6','L62','E5'].some(l => level.includes(l))) return 'bg-purple-100 text-purple-700'
  if (['L5','E4','L59','A'].includes(level)) return 'bg-blue-100 text-blue-700'
  if (['L4','E3','SDE2'].includes(level)) return 'bg-violet-100 text-violet-700'
  return 'bg-gray-100 text-gray-600'
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

useEffect(() => {
    fetch('/api/companies')
      .then(r => r.json())
      .then(d => {
        setCompanies(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

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
          <a href="/companies" className="text-violet-600 font-semibold">Companies</a>
          <a href="/compare" className="hover:text-gray-900 transition-colors">Compare</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Companies</h1>
          <p className="text-gray-600 mb-6">{companies.length} companies tracked · sorted by median total compensation</p>

          <input
            className="w-full max-w-md border-2 border-gray-200 rounded-2xl px-5 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-400 transition-all bg-white text-gray-800 font-medium"
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-32 text-gray-500 text-lg">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-gray-400 font-semibold text-lg">No companies found</div>
            <div className="text-gray-400 text-sm mt-1">Try a different search</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((company) => (
              <a key={company.name} href={`/company/${company.name}`}
                className="bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all group">

                {/* Company header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${companyColor(company.name)} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                    {companyInitial(company.name)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 capitalize text-lg group-hover:text-violet-600 transition-colors">{company.name}</div>
                    <div className="text-gray-500 text-sm">{company.count} {company.count === 1 ? 'entry' : 'entries'}</div>
                  </div>
                </div>

                {/* Median TC */}
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl px-5 py-4 mb-4">
                  <div className="text-xs text-violet-500 font-semibold uppercase tracking-widest mb-1">Median TC</div>
                  <div className="text-2xl font-bold text-violet-700" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {fmt(company.medianTC)}
                  </div>
                </div>

                {/* TC range */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Min TC</div>
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(company.minTC)}</div>
                  </div>
                  <div className="flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${companyColor(company.name)} rounded-full`} style={{ width: '60%' }} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Max TC</div>
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(company.maxTC)}</div>
                  </div>
                </div>

                {/* Levels */}
                <div className="flex flex-wrap gap-1.5">
                  {company.levels.sort().map((level: string) => (
                    <span key={level} className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelColor(level)}`}>
                      {level}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
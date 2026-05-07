'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (term: string) => {
    const lower = term.toLowerCase()
    const levels = ['l3','l4','l5','l6','e3','e4','e5','sde1','sde2','sde3']
    const locations = ['bangalore','hyderabad','noida','remote','mumbai','delhi']
    
    if (levels.includes(lower)) {
      router.push(`/salaries?level=${term}`)
    } else if (locations.includes(lower)) {
      router.push(`/salaries?location=${term}`)
    } else {
      router.push(`/salaries?company=${term}`)
    }
  }

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-white text-gray-900">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <nav className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">C</div>
          <span className="font-bold text-lg tracking-tight">CompIntel</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="/salaries" className="hover:text-gray-900 transition-colors">Salaries</a>
          <a href="/companies" className="hover:text-gray-900 transition-colors">Companies</a>
          <a href="/compare" className="hover:text-gray-900 transition-colors">Compare</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-violet-100 via-indigo-50 to-pink-50 rounded-full blur-3xl opacity-60 -z-10" />

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-full px-4 py-2 text-xs font-semibold text-violet-700 mb-8">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          Levels-based compensation intelligence · India & Global
        </div>

        <h1 className="text-6xl font-bold leading-tight tracking-tight mb-6">
          Same title.<br />
          <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Very different pay.
          </span>
        </h1>

        <p className="text-gray-500 text-xl max-w-xl mb-12 leading-relaxed">
          L4 at Google ≠ L4 at Amazon. Real compensation data structured by level — so you can actually compare, not just browse.
        </p>

        <div className="flex gap-3 max-w-2xl mb-6">
          <input
            className="flex-1 border-2 border-gray-200 rounded-2xl px-6 py-4 text-sm placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-all shadow-sm"
            placeholder="Search company, role, or level..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(search)}
          />
          <button
            onClick={() => handleSearch(search)}
            className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-violet-200"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 flex-wrap text-xs">
          <span className="text-gray-400">Try:</span>
          {['google', 'amazon', 'L4', 'Bangalore', 'meta'].map(tag => (
            <button key={tag} onClick={() => handleSearch(tag)}
              className="bg-gray-100 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border border-gray-200 px-3 py-1.5 rounded-full transition-all text-gray-600 font-medium">
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl">
          {[
            { value: '20+', label: 'Verified entries', color: 'from-violet-500 to-indigo-500' },
            { value: '8', label: 'Companies tracked', color: 'from-pink-500 to-rose-500' },
            { value: 'L3–E4', label: 'Levels mapped', color: 'from-amber-500 to-orange-500' },
          ].map(({ value, label, color }) => (
            <div key={label} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}>{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm">
          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 px-8 py-4">
            <div className="text-white font-semibold text-sm">Why levels matter — not titles</div>
          </div>
          <div className="p-6 bg-white grid grid-cols-2 gap-3">
            {[
              { co: 'Google L3', tc: '₹34.8L', color: 'violet' },
              { co: 'Google L5', tc: '₹86.0L', color: 'violet' },
              { co: 'Amazon L4', tc: '₹24.0L', color: 'pink' },
              { co: 'Amazon L6', tc: '₹65.0L', color: 'pink' },
            ].map(({ co, tc, color }) => (
              <div key={co} className={`flex items-center justify-between rounded-2xl px-5 py-4 ${color === 'violet' ? 'bg-violet-50 border border-violet-100' : 'bg-pink-50 border border-pink-100'}`}>
                <span className="text-sm font-medium text-gray-700">{co}</span>
                <span className={`font-bold text-sm ${color === 'violet' ? 'text-violet-600' : 'text-pink-600'}`}>{tc} TC</span>
              </div>
            ))}
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-gray-400 text-sm">Same company. Same title. <span className="font-semibold text-gray-600">2.5× difference in pay.</span></p>
          </div>
        </div>
      </div>
    </main>
  )
}
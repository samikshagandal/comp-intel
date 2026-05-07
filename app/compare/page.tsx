'use client'
import { useEffect, useState } from 'react'

const fmt = (n: number) => '₹' + (n / 100000).toFixed(1) + 'L'

export default function ComparePage() {
    const [salaries, setSalaries] = useState<any[]>([])
    const [id1, setId1] = useState('')
    const [id2, setId2] = useState('')
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/salaries').then(r => r.json()).then(setSalaries)
    }, [])

    const compare = async () => {
        setError(''); setResult(null)
        if (!id1 || !id2) { setError('Please select both salaries'); return }
        if (id1 === id2) { setError('Please select two different salaries'); return }
        const res = await fetch(`/api/compare?id1=${id1}&id2=${id2}`)
        const data = await res.json()
        if (data.error) { setError(data.error); return }
        setResult(data)
    }

    const metrics = result ? [
        { label: 'Base Salary', k: 'base_salary', dk: 'base' },
        { label: 'Bonus', k: 'bonus', dk: 'bonus' },
        { label: 'Stock (RSU)', k: 'stock', dk: 'stock' },
        { label: 'Total TC', k: 'total_compensation', dk: 'total', highlight: true },
    ] : []

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
                    <a href="/companies" className="hover:text-gray-900 transition-colors">Companies</a>
                    <a href="/compare" className="text-violet-600 font-semibold">Compare</a>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Compare Salaries</h1>
                    <p className="text-gray-400">Select two entries for a structured level-by-level breakdown</p>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 mb-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[{ label: 'Salary A', val: id1, set: setId1, color: 'violet' }, { label: 'Salary B', val: id2, set: setId2, color: 'indigo' }].map(({ label, val, set, color }) => (
                            <div key={label}>
                                <label className={`text-xs font-bold uppercase tracking-widest block mb-2 text-${color}-600`}>{label}</label>
                                <select
                                    className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-${color}-400 transition-all font-medium`}
                                    value={val} onChange={e => set(e.target.value)}
                                >
                                    <option value="">Select a salary entry...</option>
                                    {salaries.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.company} · {s.role} · {s.level} · {(s.total_compensation / 100000).toFixed(0)}L TC
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <button onClick={compare}
                        className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-3.5 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-violet-200">
                        Compare Now →
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-100 text-red-600 text-sm px-5 py-3 rounded-2xl mb-6 font-medium">{error}</div>
                )}

                {result && (
                    <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="grid grid-cols-4 border-b-2 border-gray-100">
                            <div className="px-6 py-5 text-xs text-gray-400 uppercase tracking-widest font-semibold">Metric</div>
                            <div className="px-6 py-5 bg-violet-50 border-l-2 border-violet-100">
                                <div className="text-sm font-bold capitalize text-violet-700">{result.salary1.company}</div>
                                <div className="text-xs text-violet-400 mt-0.5">{result.salary1.level} · {result.salary1.location}</div>
                            </div>
                            <div className="px-6 py-5 bg-indigo-50 border-l-2 border-indigo-100">
                                <div className="text-sm font-bold capitalize text-indigo-700">{result.salary2.company}</div>
                                <div className="text-xs text-indigo-400 mt-0.5">{result.salary2.level} · {result.salary2.location}</div>
                            </div>
                            <div className="px-6 py-5 text-xs text-gray-400 uppercase tracking-widest font-semibold border-l-2 border-gray-100">Diff</div>
                        </div>

                        {metrics.map(({ label, k, dk, highlight }) => {
                            const d = result.difference[dk]
                            const isPos = d >= 0
                            return (
                                <div key={label} className={`grid grid-cols-4 border-b border-gray-50 ${highlight ? 'bg-gradient-to-r from-violet-50 to-indigo-50' : ''}`}>
                                    <div className={`px-6 py-4 text-sm flex items-center gap-2 ${highlight ? 'font-bold' : 'text-gray-600 font-medium'}`}>
                                        {label}
                                    </div>
                                    <div className={`px-6 py-4 text-sm border-l border-gray-50 ${highlight ? 'font-bold text-violet-600' : 'text-gray-700 font-medium'}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                                        {fmt(result.salary1[k])}
                                    </div>
                                    <div className={`px-6 py-4 text-sm border-l border-gray-50 ${highlight ? 'font-bold text-indigo-600' : 'text-gray-700 font-medium'}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                                        {fmt(result.salary2[k])}
                                    </div>
                                    <div className={`px-6 py-4 text-sm font-bold border-l border-gray-50 ${isPos ? 'text-emerald-600' : 'text-red-500'}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isPos ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                            {isPos ? '▲' : '▼'} {fmt(Math.abs(d))}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="grid grid-cols-4 bg-gray-50">
                            <div className="px-6 py-4 text-sm text-gray-500 font-medium">Level</div>
                            <div className="px-6 py-4 text-sm font-bold text-violet-600 border-l border-gray-100">{result.salary1.level}</div>
                            <div className="px-6 py-4 text-sm font-bold text-indigo-600 border-l border-gray-100">{result.salary2.level}</div>
                            <div className="px-6 py-4 text-sm text-gray-400 border-l border-gray-100">{result.difference.level}</div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
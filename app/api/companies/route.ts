export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const salaries = await prisma.salary.findMany()

  const companyMap: Record<string, {
    name: string
    count: number
    medianTC: number
    topLevel: string
    levels: string[]
    maxTC: number
    minTC: number
  }> = {}

  for (const s of salaries) {
    if (!companyMap[s.company]) {
      companyMap[s.company] = {
        name: s.company,
        count: 0,
        medianTC: 0,
        topLevel: '',
        levels: [],
        maxTC: 0,
        minTC: Infinity,
      }
    }
    const c = companyMap[s.company]
    c.count++
    c.levels.push(s.level)
    c.maxTC = Math.max(c.maxTC, s.total_compensation)
    c.minTC = Math.min(c.minTC, s.total_compensation)
  }

  for (const name of Object.keys(companyMap)) {
    const companySalaries = salaries
      .filter(s => s.company === name)
      .map(s => s.total_compensation)
      .sort((a, b) => a - b)
    const mid = Math.floor(companySalaries.length / 2)
    companyMap[name].medianTC = companySalaries[mid]
    companyMap[name].topLevel = companyMap[name].levels
      .sort((a, b) => b.localeCompare(a))[0]
    companyMap[name].levels = [...new Set(companyMap[name].levels)]
  }

  const companies = Object.values(companyMap).sort((a, b) => b.medianTC - a.medianTC)
  return NextResponse.json(companies)
}
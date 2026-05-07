import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { company: string } }) {
  const company = params.company.toLowerCase()

  const salaries = await prisma.salary.findMany({
    where: { company: { contains: company } },
    orderBy: { total_compensation: 'desc' },
  })

  if (salaries.length === 0) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  const totals = salaries.map(s => s.total_compensation)
  const median = totals.sort((a, b) => a - b)[Math.floor(totals.length / 2)]

  const levelDist: Record<string, number> = {}
  salaries.forEach(s => {
    levelDist[s.level] = (levelDist[s.level] || 0) + 1
  })

  return NextResponse.json({ salaries, median, levelDistribution: levelDist })
}
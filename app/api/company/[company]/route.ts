import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, context: any) {
  const params = await context.params
  const company = params.company.toLowerCase()

  const salaries = await prisma.salary.findMany({
    where: { company: { contains: company } },
    orderBy: { total_compensation: "desc" },
  })

  if (salaries.length === 0) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }

  const totals = salaries.map((s: any) => s.total_compensation)
  const sorted = [...totals].sort((a: number, b: number) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]

  const levelDist: Record<string, number> = {}
  salaries.forEach((s: any) => {
    levelDist[s.level] = (levelDist[s.level] || 0) + 1
  })

  return NextResponse.json({ salaries, median, levelDistribution: levelDist })
}
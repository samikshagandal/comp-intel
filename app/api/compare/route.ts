import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id1 = searchParams.get('id1')
  const id2 = searchParams.get('id2')

  if (!id1 || !id2) {
    return NextResponse.json({ error: 'Provide id1 and id2' }, { status: 400 })
  }

  const [a, b] = await Promise.all([
    prisma.salary.findUnique({ where: { id: Number(id1) } }),
    prisma.salary.findUnique({ where: { id: Number(id2) } }),
  ])

  if (!a || !b) {
    return NextResponse.json({ error: 'One or both salaries not found' }, { status: 404 })
  }

  return NextResponse.json({
    salary1: a,
    salary2: b,
    difference: {
      base: a.base_salary - b.base_salary,
      bonus: a.bonus - b.bonus,
      stock: a.stock - b.stock,
      total: a.total_compensation - b.total_compensation,
      level: `${a.level} vs ${b.level}`,
    },
  })
}
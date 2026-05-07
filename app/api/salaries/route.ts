import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const company = searchParams.get('company')
  const role = searchParams.get('role')
  const level = searchParams.get('level')
  const location = searchParams.get('location')
  const sort = searchParams.get('sort') || 'desc'

  const salaries = await prisma.salary.findMany({
    where: {
      ...(company && { company: { contains: company.toLowerCase() } }),
      ...(role && { role: { contains: role, mode: 'insensitive' } }),
      ...(level && { level: level.toUpperCase() }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
    },
    orderBy: { total_compensation: sort === 'asc' ? 'asc' : 'desc' },
  })

  return NextResponse.json(salaries)
}
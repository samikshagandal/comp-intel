import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { company, role, level, location, experience_years, base_salary, bonus, stock, confidence_score } = body

    if (!company || !role || !level || !location || !experience_years || !base_salary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const normalizedCompany = company.trim().toLowerCase()
    const b = Number(base_salary)
    const bon = Number(bonus) || 0
    const st = Number(stock) || 0

    if (isNaN(b) || b <= 0) {
      return NextResponse.json({ error: 'Invalid base_salary' }, { status: 400 })
    }

    const total = b + bon + st

    const salary = await prisma.salary.create({
      data: {
        company: normalizedCompany,
        role: role.trim(),
        level: level.trim().toUpperCase(),
        location: location.trim(),
        experience_years: Number(experience_years),
        base_salary: b,
        bonus: bon,
        stock: st,
        total_compensation: total,
        confidence_score: Number(confidence_score) || 0.8,
      },
    })

    return NextResponse.json(salary, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
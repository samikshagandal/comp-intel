import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const data = [
    { company: 'google', role: 'Software Engineer', level: 'L3', location: 'Bangalore', experience_years: 2, base_salary: 2400000, bonus: 480000, stock: 600000 },
    { company: 'google', role: 'Software Engineer', level: 'L4', location: 'Bangalore', experience_years: 5, base_salary: 3600000, bonus: 720000, stock: 1200000 },
    { company: 'google', role: 'Software Engineer', level: 'L5', location: 'Bangalore', experience_years: 8, base_salary: 5000000, bonus: 1200000, stock: 2400000 },
    { company: 'microsoft', role: 'Software Engineer', level: 'L59', location: 'Hyderabad', experience_years: 3, base_salary: 2000000, bonus: 300000, stock: 500000 },
    { company: 'microsoft', role: 'Software Engineer', level: 'L62', location: 'Hyderabad', experience_years: 6, base_salary: 3200000, bonus: 600000, stock: 1000000 },
    { company: 'amazon', role: 'SDE', level: 'L4', location: 'Bangalore', experience_years: 2, base_salary: 1800000, bonus: 200000, stock: 400000 },
    { company: 'amazon', role: 'SDE', level: 'L5', location: 'Bangalore', experience_years: 5, base_salary: 2800000, bonus: 400000, stock: 900000 },
    { company: 'amazon', role: 'SDE', level: 'L6', location: 'Bangalore', experience_years: 9, base_salary: 4000000, bonus: 700000, stock: 1800000 },
    { company: 'meta', role: 'Software Engineer', level: 'E3', location: 'Remote', experience_years: 1, base_salary: 2200000, bonus: 400000, stock: 800000 },
    { company: 'meta', role: 'Software Engineer', level: 'E4', location: 'Remote', experience_years: 4, base_salary: 3400000, bonus: 700000, stock: 1500000 },
    { company: 'flipkart', role: 'SDE', level: 'SDE1', location: 'Bangalore', experience_years: 1, base_salary: 1200000, bonus: 150000, stock: 200000 },
    { company: 'flipkart', role: 'SDE', level: 'SDE2', location: 'Bangalore', experience_years: 4, base_salary: 2000000, bonus: 300000, stock: 500000 },
    { company: 'swiggy', role: 'Software Engineer', level: 'L3', location: 'Bangalore', experience_years: 2, base_salary: 1500000, bonus: 200000, stock: 300000 },
    { company: 'razorpay', role: 'Software Engineer', level: 'L3', location: 'Bangalore', experience_years: 2, base_salary: 1800000, bonus: 250000, stock: 400000 },
    { company: 'razorpay', role: 'Software Engineer', level: 'L4', location: 'Bangalore', experience_years: 5, base_salary: 2800000, bonus: 450000, stock: 800000 },
    { company: 'adobe', role: 'Software Engineer', level: 'L3', location: 'Noida', experience_years: 2, base_salary: 1600000, bonus: 200000, stock: 300000 },
    { company: 'adobe', role: 'Software Engineer', level: 'L4', location: 'Noida', experience_years: 5, base_salary: 2600000, bonus: 400000, stock: 700000 },
    { company: 'goldman sachs', role: 'Software Engineer', level: 'AS', location: 'Bangalore', experience_years: 2, base_salary: 2000000, bonus: 600000, stock: 0 },
    { company: 'goldman sachs', role: 'Software Engineer', level: 'A', location: 'Bangalore', experience_years: 5, base_salary: 3000000, bonus: 1200000, stock: 0 },
    { company: 'atlassian', role: 'Software Engineer', level: 'L4', location: 'Remote', experience_years: 4, base_salary: 2400000, bonus: 350000, stock: 600000 },
  ]

  for (const d of data) {
    await prisma.salary.create({
      data: { ...d, total_compensation: d.base_salary + d.bonus + d.stock, confidence_score: 0.8 }
    })
  }

  console.log('Seeded 20 salaries!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
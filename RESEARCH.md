# Phase 1: Compensation Intelligence — Platform Research

## 1. Platform Analysis

### Levels.fyi
**What works:**
- Compensation is tied to levels (L3/L4/L5), not just titles
- Total compensation = base + bonus + stock — shown clearly
- Company-specific level mapping (Google L5 ≠ Amazon L5)
- Structured submission flow forces standardized input
- Percentile ranges make data comparable across companies
- High data confidence because submissions are verified

**What fails:**
- Primarily US-focused; India data is sparse and unreliable
- No regional purchasing power adjustment
- Submission flow is long and discourages contributions

---

### 6figr
**What works:**
- India-specific compensation data
- Level-based structure similar to Levels.fyi
- Clean comparison interface

**What fails:**
- Smaller dataset, less coverage outside top 5 companies
- No confidence scoring on entries
- Level standardization is inconsistent across companies

---

### AmbitionBox
**What works:**
- Large India dataset
- Company reviews alongside salary data
- Good SEO and discoverability

**What fails:**
- Title-based, not level-based — the core problem
- "Software Engineer" at Google and a startup look identical
- No total compensation breakdown (base only)
- No stock/bonus visibility
- Data is not structured or queryable — just listing
- Cannot compare two specific entries

---

### Glassdoor
**What works:**
- Large dataset globally
- Brand recognition drives submissions

**What fails:**
- Title-based, same problem as AmbitionBox
- Salary ranges are too wide to be useful
- No level standardization
- Comparison feature is weak
- India data quality is poor
- Paywalled features reduce utility

---

## 2. Key Differences

| Problem | AmbitionBox / Glassdoor | Levels.fyi / CompIntel |
|---|---|---|
| Unit of comparison | Job title | Level (L3/L4/L5) |
| Compensation breakdown | Base only | Base + Bonus + Stock = TC |
| Queryability | Browse only | Filter by level, role, location |
| Comparability | Cannot compare entries | Side-by-side structured compare |
| Data trust | No confidence score | Confidence score per entry |
| India coverage | Good but unstructured | Structured, growing |

---

## 3. Gaps in Existing Platforms

1. **No level-based India data** — AmbitionBox has volume but no structure
2. **No total compensation visibility** — stock and bonus are hidden or absent
3. **No queryable API** — existing platforms are browse-only, not decision-ready
4. **No structured comparison** — users cannot compare two specific salary entries
5. **No confidence scoring** — no way to know how reliable an entry is
6. **No normalization** — "Google" and "google" and "GOOGLE" are treated differently

---

## 4. Feature Mapping Sheet

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? |
|---|---|---|---|---|---|
| Level-based compensation | ✅ | ✅ | ❌ | ❌ | ✅ YES |
| Total TC (base+bonus+stock) | ✅ | ✅ | ❌ | ❌ | ✅ YES |
| Salary table with filters | ✅ | ✅ | ❌ | ❌ | ✅ YES |
| Company page with median | ✅ | ✅ | ✅ | ✅ | ✅ YES |
| Level distribution per company | ✅ | ❌ | ❌ | ❌ | ✅ YES |
| Side-by-side comparison | ✅ | ❌ | ❌ | ❌ | ✅ YES |
| Confidence score per entry | ✅ | ❌ | ❌ | ❌ | ✅ YES |
| Company name normalization | ✅ | ❌ | ❌ | ❌ | ✅ YES |
| Duplicate entry detection | ✅ | ❌ | ❌ | ❌ | ✅ YES |
| Structured ingest API | ✅ | ❌ | ❌ | ❌ | ✅ YES |
| Auth / login | ✅ | ✅ | ✅ | ✅ | ❌ NO |
| Reviews / ratings | ❌ | ❌ | ✅ | ✅ | ❌ NO |
| Chat / Q&A | ❌ | ❌ | ❌ | ✅ | ❌ NO |
| Salary ranges / percentiles | ✅ | ✅ | ✅ | ✅ | ❌ NO |
| Mobile app | ✅ | ❌ | ✅ | ✅ | ❌ NO |

---

## 5. Product Principle

> AmbitionBox and Glassdoor fail because they are salary listing sites.
> Levels.fyi works because it is a compensation intelligence system.
> The difference: structured → comparable → decision-ready.

A "Software Engineer" at a startup and a "Software Engineer" at Google
are not comparable. An L4 at Google and an L4 at Microsoft are.
Level standardization is the core insight that makes compensation data useful.

---

## 6. What We Built (CompIntel)

- PostgreSQL database with normalized, level-tagged salary entries
- REST APIs: ingest, query, company view, comparison
- Frontend: salary table with filters + sorting, company page, compare page
- Edge case handling: duplicate detection, company normalization, missing bonus/stock defaults to 0
- Stack: Next.js + Tailwind + Prisma + PostgreSQL
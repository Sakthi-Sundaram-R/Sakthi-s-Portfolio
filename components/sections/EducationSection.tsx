'use client';

import { FadeIn } from '@/components/FadeIn';

const education = [
  {
    period: '2025 — Present',
    degree: 'B.Tech, Artificial Intelligence & Data Science',
    institution: 'Sri Krishna College of Engineering and Technology (SKCET)',
    location: 'Coimbatore, Tamil Nadu, India',
    detail: '2nd Year · CGPA: 8.67 / 10.0',
  },
  {
    period: '2025',
    degree: 'Higher Secondary — Class XII (CBSE)',
    institution: 'Sidhar Gnana Peedam Senior Secondary School',
    location: 'Coimbatore, Tamil Nadu',
    detail: 'Percentage: 70%',
  },
  {
    period: '2023',
    degree: 'Secondary School — Class X (CBSE)',
    institution: 'Sidhar Gnana Peedam Senior Secondary School',
    location: 'Coimbatore, Tamil Nadu',
    detail: 'Percentage: 72%',
  },
];

export function EducationSection() {
  return (
    <section id="education" className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 md:mb-24">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-center">
          Education
        </h2>
      </FadeIn>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto flex flex-col">
        {education.map((item, idx) => (
          <FadeIn
            key={item.degree}
            delay={idx * 0.1}
            y={20}
            className="border-b border-[#D7E2EA]/15 last:border-0 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8"
          >
            <p className="flex-shrink-0 w-full sm:w-40 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/40">
              {item.period}
            </p>
            <div className="flex-1 flex flex-col gap-1.5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium">{item.degree}</h3>
              <p className="text-sm sm:text-base text-[#D7E2EA]/60">{item.institution}</p>
              <p className="text-xs sm:text-sm text-[#D7E2EA]/40">{item.location}</p>
              <p className="text-sm sm:text-base font-medium text-[#D7E2EA]/80 mt-1">{item.detail}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

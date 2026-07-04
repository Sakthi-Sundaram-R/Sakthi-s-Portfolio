'use client';

import Image from 'next/image';
import { FadeIn } from '@/components/FadeIn';

const certifications = [
  {
    name: 'Conesta Forge — 5-Day AI Build Sprint',
    issuer: 'Conesta Forge, in partnership with Fludigo',
    date: 'June 26, 2026',
    detail: 'Top 8 of 62 builders · Forge Score 2,080 · for building & shipping Sleep-Scribe',
    image: '/certs/conesta-forge.jpg',
    featured: true,
  },
  {
    name: 'Machine Learning with Python',
    issuer: 'IBM, via Coursera',
    date: 'May 30, 2026',
    detail: 'Verify: coursera.org/verify/IP3RVZ0WK8TB',
    link: 'https://coursera.org/verify/IP3RVZ0WK8TB',
    image: '/certs/coursera-ml-with-python.png',
  },
  {
    name: 'Intro to ML Workshop',
    issuer: "Petrichor'26 Techno Cultural Fest, IIT Palakkad",
    date: 'September 27, 2025',
    detail: 'Certificate of Participation',
    image: '/certs/iit-palakkad.jpg',
  },
  {
    name: 'Machine Learning Internship',
    issuer: 'Eron Techno Solutions Pvt. Ltd.',
    date: 'May 2026',
    detail: 'Internship completion certificate',
    image: '/certs/eron-internship.jpg',
    portrait: true,
  },
];

export function CertificationsSection() {
  return (
    <section id="certifications" className="bg-[#0C0C0C] text-[#D7E2EA] py-20 sm:py-24 md:py-32 overflow-hidden">
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 px-5 sm:px-8 md:px-10">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2rem,8.5vw,140px)] text-center">
          Certifications
        </h2>
      </FadeIn>

      {/* Horizontal Scroll */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-5 sm:px-8 md:px-10 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {certifications.map((cert, idx) => (
          <FadeIn
            key={cert.name}
            delay={idx * 0.08}
            y={20}
            className={`
              snap-start flex-shrink-0 w-[85vw] sm:w-[420px]
              border-2 rounded-3xl p-6 sm:p-8 flex flex-col gap-4
              ${cert.featured ? 'border-[#B600A8]/60' : 'border-[#D7E2EA]/20'}
            `}
          >
            {cert.image && (
              <div
                className={`relative w-full rounded-2xl overflow-hidden border border-[#D7E2EA]/10 ${
                  cert.portrait ? 'aspect-[3/4] bg-[#D7E2EA]/5' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className={cert.portrait ? 'object-contain' : 'object-cover'}
                  sizes="420px"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              {cert.featured && (
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#B600A8]">Featured</p>
              )}
              <h3 className="text-lg sm:text-xl font-medium">{cert.name}</h3>
              <p className="text-sm sm:text-base text-[#D7E2EA]/60">{cert.issuer}</p>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/40">{cert.date}</p>
              {cert.link ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-[#D7E2EA]/70 hover:text-[#D7E2EA] underline underline-offset-4 mt-1"
                >
                  {cert.detail}
                </a>
              ) : (
                <p className="text-sm font-light text-[#D7E2EA]/70 mt-1">{cert.detail}</p>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

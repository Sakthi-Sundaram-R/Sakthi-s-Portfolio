'use client';

import { FadeIn } from '@/components/FadeIn';

const status = [
  {
    label: 'Currently',
    title: 'Second-Year Student',
    since: 'Since 2025',
    description:
      'Second-Year B.Tech Artificial Intelligence & Data Science Student at Sri Krishna College of Engineering and Technology (SKCET), Coimbatore.',
  },
  {
    label: 'Looking For',
    title: 'Internships',
    since: 'Open · Available Now',
    description:
      'Actively seeking internship opportunities in AI, Machine Learning, and Full-Stack Development to grow with a real team.',
  },
];

const responsibilities = [
  'Developed machine learning applications and predictive models using Python.',
  'Worked on data preprocessing, feature engineering, model training, and performance evaluation.',
  'Built classification and prediction models using Scikit-learn, Pandas, and TensorFlow.',
  'Collaborated under industry mentors while gaining practical experience in real-world AI and data science workflows.',
];

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-center">
          Experience
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {status.map((item, idx) => (
            <FadeIn
              key={item.label}
              delay={idx * 0.1}
              y={20}
              className="border-2 border-[#D7E2EA]/20 rounded-3xl p-6 sm:p-8 flex flex-col gap-3"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/40">
                {item.label}
              </p>
              <h3 className="text-xl sm:text-2xl font-medium">{item.title}</h3>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-[#D7E2EA]/50">{item.since}</p>
              <p className="text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/70">
                {item.description}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Internship */}
        <FadeIn delay={0.2} y={20} className="border-2 border-[#D7E2EA]/20 rounded-3xl p-6 sm:p-8 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-medium">Machine Learning Intern</h3>
              <p className="text-sm sm:text-base text-[#D7E2EA]/60">Eron Techno Solutions Pvt. Ltd.</p>
            </div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/40">May 2026</p>
          </div>
          <ul className="flex flex-col gap-3">
            {responsibilities.map((point) => (
              <li key={point} className="flex gap-3 text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/70">
                <span className="text-[#D7E2EA]/40">—</span>
                {point}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

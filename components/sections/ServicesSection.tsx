'use client';

import { FadeIn } from '@/components/FadeIn';

const services = [
  {
    number: '01',
    name: 'Programming Languages',
    skills: ['Python', 'C++', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    number: '02',
    name: 'Frontend Development',
    skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    number: '03',
    name: 'Backend & Databases',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'Supabase', 'REST APIs'],
  },
  {
    number: '04',
    name: 'AI & Machine Learning',
    skills: ['Machine Learning', 'Generative AI', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Data Preprocessing'],
  },
  {
    number: '05',
    name: 'Developer Tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'npm', 'pnpm'],
  },
  {
    number: '06',
    name: 'Currently Learning',
    skills: ['LLMs', 'AI Agents', 'RAG', 'LangChain', 'Docker', 'Cloud Deployment'],
  },
];

export function ServicesSection() {
  return (
    <section id="skills" className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      {/* Heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 md:mb-28">
        <h2 className="font-black uppercase text-[clamp(3rem,12vw,160px)] text-center leading-none">
          Skills
        </h2>
      </FadeIn>

      {/* Services List */}
      <div className="max-w-5xl mx-auto">
        {services.map((service, idx) => (
          <FadeIn
            key={service.number}
            delay={idx * 0.1}
            y={20}
            className="border-b border-[rgba(12,12,12,0.15)] last:border-0 py-8 sm:py-10 md:py-12 flex gap-6 sm:gap-8 md:gap-12"
          >
            <div className="flex-shrink-0">
              <p className="font-black text-[clamp(2.5rem,8vw,110px)] leading-none text-[#0C0C0C]">
                {service.number}
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-3 sm:gap-4">
              <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] leading-tight text-[#0C0C0C]">
                {service.name}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {service.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[rgba(12,12,12,0.2)] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-light text-[#0C0C0C]/70"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

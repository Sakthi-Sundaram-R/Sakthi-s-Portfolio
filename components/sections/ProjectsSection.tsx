'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { LiveProjectButton } from '@/components/Buttons';

const projects = [
  {
    number: '01',
    name: 'Sleep-Scribe',
    category: 'AI Dream Journal · Personal Project',
    status: 'Live',
    description:
      "An AI-powered sleep journal & dream analyst — record dreams by text or voice and a real LLM decodes symbols, emotional tone, and themes, tracking patterns across nights. Pairs a cinematic 6-scene WebGL landing experience with a full authenticated product: a per-user dream journal, analytics dashboard, follow-up AI chat, and a weekly AI sleep-coach digest.",
    tags: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Groq LLM', 'JWT Auth', 'Three.js'],
    href: 'https://sleepscribe.vercel.app/',
  },
  {
    number: '02',
    name: 'FashionVerse',
    category: 'AI Fashion E-Commerce · Personal Project',
    status: 'Live',
    description:
      'A full-stack AI-powered fashion e-commerce platform combining generative AI styling advice, a 3D/AR virtual try-on experience, and NFT-based product authenticity certificates. Built with React 19 + TypeScript and Supabase, with Razorpay payments and Solidity smart contracts on Polygon powering an ERC-20 loyalty token program.',
    tags: ['React 19', 'TypeScript', 'Supabase', 'Three.js', 'Solidity', 'Razorpay', 'Gemini AI'],
    href: 'https://fashionverseonline.vercel.app/',
  },
  {
    number: '03',
    name: 'N-1729 Academy',
    category: 'Marketing Website · Client Project',
    status: 'Live',
    description:
      "A fully responsive marketing website for a Coimbatore-based tuition centre, built for a real client with a premium navy-and-gold theme. Showcases services, achievements, and a photo gallery, and drives enrollments through WhatsApp-integrated 'Book a Demo' and 'Become a Tutor' forms.",
    tags: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'WhatsApp API'],
    href: 'https://n-1729.vercel.app/',
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 - (projects.length - 1 - index) * 0.03]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        top: `${index * 28}px`,
      }}
      className="sticky min-h-[60vh] flex items-center justify-center px-4 sm:px-6 md:px-8 z-20"
    >
      <div className="w-full bg-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-6 sm:p-8 md:p-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <p className="font-black text-[clamp(2rem,8vw,120px)] leading-none text-[#D7E2EA] mb-2">
              {project.number}
            </p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <p className="text-xs sm:text-sm md:text-base text-[#D7E2EA]/60 uppercase tracking-widest">
                  {project.category}
                </p>
                <span className="text-xs font-medium uppercase tracking-widest text-[#4ADE80] border border-[#4ADE80]/40 rounded-full px-2.5 py-0.5">
                  {project.status}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-medium uppercase text-[#D7E2EA]">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.href} />
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base font-light leading-relaxed text-[#D7E2EA]/70 max-w-3xl mb-6">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#D7E2EA]/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-light text-[#D7E2EA]/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 pb-20 relative z-10">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-20 sm:mb-24 md:mb-32">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-[#D7E2EA]">
          Projects
        </h2>
      </div>

      {/* Cards Stack */}
      <div className="max-w-7xl mx-auto pb-[20vh] md:pb-0 md:h-[220vh] relative">
        {projects.map((project, idx) => (
          <ProjectCard key={project.number} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}

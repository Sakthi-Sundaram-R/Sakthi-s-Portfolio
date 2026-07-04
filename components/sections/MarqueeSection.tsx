'use client';

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

type TechIcon = {
  name: string;
  slug: string;
  color: string;
};

const icon = (name: string, slug: string, color: string): TechIcon => ({ name, slug, color });

const techIcons: TechIcon[] = [
  icon('Python', 'python', '3776AB'),
  icon('JavaScript', 'javascript', 'F7DF1E'),
  icon('TypeScript', 'typescript', '3178C6'),
  icon('React', 'react', '61DAFB'),
  icon('Next.js', 'nextdotjs', 'FFFFFF'),
  icon('Node.js', 'nodedotjs', '339933'),
  icon('Express', 'express', 'FFFFFF'),
  icon('MongoDB', 'mongodb', '47A248'),
  icon('Supabase', 'supabase', '3ECF8E'),
  icon('Tailwind CSS', 'tailwindcss', '06B6D4'),
  icon('Framer Motion', 'framer', 'FFFFFF'),
  icon('Three.js', 'threedotjs', 'FFFFFF'),
  icon('Git', 'git', 'F05032'),
  icon('GitHub', 'github', 'FFFFFF'),
  icon('C++', 'cplusplus', '00599C'),
  icon('TensorFlow', 'tensorflow', 'FF6F00'),
  icon('Scikit-learn', 'scikitlearn', 'F7931E'),
  icon('Docker', 'docker', '2496ED'),
];

const row2Icons = [...techIcons.slice(9), ...techIcons.slice(0, 9)];

const GAP = 12;
const CARD_WIDTH = 180;
const SET_WIDTH = techIcons.length * (CARD_WIDTH + GAP);
const DRIFT_SPEED = 0.028; // px per ms

function TechCard({ tech }: { tech: TechIcon }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[180px] h-[140px] rounded-2xl border-2 border-[#D7E2EA]/15 flex flex-col items-center justify-center gap-3 transition-colors duration-300 hover:border-[#B600A8]/50"
    >
      <div className="relative w-11 h-11 opacity-70 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-110">
        <Image
          src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
          alt={tech.name}
          fill
          sizes="44px"
          className="object-contain"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/60 transition-colors duration-300 group-hover:text-[#D7E2EA]">
        {tech.name}
      </span>
    </div>
  );
}

function MarqueeRow({
  icons,
  direction = 'right',
  scrollX,
}: {
  icons: TechIcon[];
  direction?: 'left' | 'right';
  scrollX: ReturnType<typeof useMotionValue<number>>;
}) {
  const tripled = [...icons, ...icons, ...icons];
  const drift = useMotionValue(0);

  useAnimationFrame((_t, delta) => {
    drift.set(drift.get() + DRIFT_SPEED * delta);
  });

  const x = useTransform([drift, scrollX], (values: number[]) => {
    const [d, s] = values;
    const v = d + (s - 200);
    const m = ((v % SET_WIDTH) + SET_WIDTH) % SET_WIDTH;
    return direction === 'right' ? -SET_WIDTH + m : -m;
  });

  return (
    <motion.div
      className="flex gap-3"
      style={{
        x,
        willChange: 'transform',
      }}
    >
      {tripled.map((tech, idx) => (
        <TechCard key={idx} tech={tech} />
      ))}
    </motion.div>
  );
}

export function MarqueeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const sectionTop = ref.current.getBoundingClientRect().top + window.scrollY;
      const scrollOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      scrollX.set(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollX]);

  return (
    <section
      ref={ref}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-x-hidden"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow icons={techIcons} direction="right" scrollX={scrollX} />
        <MarqueeRow icons={row2Icons} direction="left" scrollX={scrollX} />
      </div>
    </section>
  );
}

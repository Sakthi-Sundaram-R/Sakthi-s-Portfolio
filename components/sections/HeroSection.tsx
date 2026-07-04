'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/Buttons';
import { Hero3D } from '@/components/Hero3D';

export function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-between bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip relative">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full">
        <nav className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center px-5 md:px-10 pt-5 md:pt-8">
          <div className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider">
            SAKTHI
          </div>
          <div className="flex gap-x-4 gap-y-2 md:gap-6 lg:gap-8 flex-wrap justify-start md:justify-end items-center">
            {['About', 'Education', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs md:text-sm lg:text-base font-medium uppercase tracking-wider hover:opacity-70 transition-opacity duration-200"
              >
                {item}
              </a>
            ))}
            <a
              href="https://github.com/Sakthi-Sundaram-R"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:opacity-70 transition-opacity duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 md:w-5 md:h-5"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 2.89-.39c.98 0 1.96.13 2.89.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/sakthi-sundaram-r-245b8337b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:opacity-70 transition-opacity duration-200"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 md:w-5 md:h-5"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
          </div>
        </nav>
      </FadeIn>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        {/* 3D Background Element */}
        <Hero3D />

        {/* Greeting character */}
        <FadeIn delay={0.1} y={20} className="relative z-10 mb-4 sm:mb-6">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-fit"
          >
            {/* Speech bubble */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute top-1 left-[82%] z-10 whitespace-nowrap"
            >
              <div className="rounded-full border-2 border-[#B600A8]/60 bg-[#18011F]/90 px-4 py-1.5 shadow-[0_0_20px_rgba(182,0,168,0.4)]">
                <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-[#D7E2EA]">
                  hii!
                </span>
              </div>
              <div className="absolute -bottom-[6px] left-3 h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-[#B600A8]/60 bg-[#18011F]" />
            </motion.div>

            {/* Character */}
            <motion.div
              animate={{ rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/avatar.png"
                alt="Sakthi's avatar saying hii"
                width={811}
                height={1023}
                priority
                className="drop-shadow-[0_0_30px_rgba(182,0,168,0.3)]"
                style={{ height: 'clamp(150px, 24vh, 230px)', width: 'auto' }}
              />
            </motion.div>
          </motion.div>
        </FadeIn>

        {/* Hero Heading */}
        <FadeIn delay={0.15} y={40} className="relative z-10 w-full text-center px-4">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(2.5rem,10vw,180px)]">
            Hi, i&apos;m Sakthi
          </h1>
        </FadeIn>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full left-0 right-0">
          <FadeIn delay={0.35} y={20} className="w-full" as="div">
            <div className="flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
              <p
                className="
                  font-light uppercase tracking-wide leading-snug
                  text-[clamp(0.75rem,1.4vw,1.5rem)]
                  max-w-[160px] sm:max-w-[220px] md:max-w-[260px]
                "
              >
                a second-year AI & Data Science student building projects
                and exploring machine learning
              </p>
              <FadeIn delay={0.5} y={20} as="div">
                <ContactButton />
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

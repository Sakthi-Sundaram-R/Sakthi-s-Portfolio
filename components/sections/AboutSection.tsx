'use client';

import { FadeIn } from '@/components/FadeIn';
import { ContactButton } from '@/components/Buttons';
import Image from 'next/image';

const bullets = [
  '2nd Year B.Tech AI & Data Science student at SKCET, Coimbatore, passionate about building real-world solutions with AI and software development.',
  'Focused on Artificial Intelligence, Machine Learning, Generative AI, and Full-Stack Web Development.',
  'Hands-on with Python, C++, JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, MongoDB, Supabase, and Git.',
  'Built projects like Sleep-Scribe and FashionVerse, and completed a Machine Learning Internship covering data preprocessing, feature engineering, and model development.',
  'Secured Top 8 in the Conesta Forge 5-Day AI Build Sprint. Aspiring AI Engineer building intelligent, scalable, impactful software.',
];

const stats = [
  { value: '8.67', label: 'CGPA out of 10.0' },
  { value: '5+', label: 'AI, ML & Full-Stack Projects' },
  { value: '1', label: 'Machine Learning Internship' },
  { value: '4', label: 'Certifications Earned' },
];

const contactInfo = [
  { label: 'Phone', value: '+91 63798 50682' },
  { label: 'Email', value: 'sakthisundaram.rajeshkannan@gmail.com' },
  { label: 'College', value: 'Sri Krishna College of Engineering and Technology' },
  { label: 'Location', value: 'Coimbatore, Tamil Nadu, India' },
];

export function AboutSection() {
  return (
    <section id="about" className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] relative flex items-center justify-center px-5 sm:px-8 md:px-10 py-20 sm:py-24 overflow-hidden">
      {/* Decorative Images */}
      {/* Top Left - Moon Icon */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0">
        <Image
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon"
          width={210}
          height={210}
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto"
        />
      </FadeIn>

      {/* Bottom Left - Design Element */}
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0">
        <Image
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="Design element"
          width={180}
          height={180}
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto"
        />
      </FadeIn>

      {/* Top Right - Lego Icon */}
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0">
        <Image
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego"
          width={210}
          height={210}
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto"
        />
      </FadeIn>

      {/* Bottom Right - Design Elements */}
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0">
        <Image
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="Design elements"
          width={220}
          height={220}
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto"
        />
      </FadeIn>

      {/* Content */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-12 sm:gap-16 relative z-10">
        {/* Profile Photo */}
        <FadeIn delay={0} y={20}>
          <div className="relative w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] rounded-full overflow-hidden border-2 border-[#D7E2EA]/30 ring-4 ring-[#B600A8]/20">
            <Image
              src="/profile.jpg"
              alt="Sakthi Sundaram R"
              fill
              sizes="170px"
              className="object-cover"
            />
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.05} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,160px)] text-center">
            About me
          </h2>
        </FadeIn>

        {/* Bullet Points */}
        <div className="w-full flex flex-col gap-6 sm:gap-7">
          {bullets.map((bullet, idx) => (
            <FadeIn key={idx} delay={idx * 0.08} y={20} className="flex items-start gap-4 sm:gap-5">
              <span className="w-2 h-2 rounded-full bg-[#B600A8] flex-shrink-0 mt-[0.55em]" aria-hidden="true" />
              <p className="text-[#D7E2EA]/80 font-light leading-relaxed text-[clamp(0.9rem,1.6vw,1.15rem)]">
                {bullet}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <FadeIn
              key={stat.label}
              delay={idx * 0.1}
              y={20}
              className="border-2 border-[#D7E2EA]/20 rounded-3xl p-5 sm:p-6 flex flex-col gap-1"
            >
              <p className="hero-heading font-black text-[clamp(1.75rem,4vw,2.75rem)] leading-none">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-light uppercase tracking-wide text-[#D7E2EA]/60">
                {stat.label}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Contact Info Card */}
        <FadeIn delay={0.15} y={20} className="w-full">
          <div className="border-2 border-[#D7E2EA]/20 rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/40">
                  {item.label}
                </p>
                <p className="text-sm sm:text-base font-light text-[#D7E2EA]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Contact Button */}
        <FadeIn delay={0.2} y={20} className="flex justify-center">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

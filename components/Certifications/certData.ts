/**
 * Certificate data for the 3D gallery.
 *
 * Names, issuers, dates, details and images are carried over verbatim from the
 * previous CertificationsSection — only presentational metadata (`type`,
 * `rank`, `portrait`) is added here for the gallery labels.
 */
export type Certificate = {
  name: string;
  issuer: string;
  date: string;
  detail: string;
  image: string;
  /** Short kicker shown above the title in the gallery label. */
  type: string;
  /** Highlighted achievement line, rendered with a trophy. */
  rank?: string;
  /** External verification link. */
  link?: string;
  featured?: boolean;
  portrait?: boolean;
};

export const certifications: Certificate[] = [
  {
    name: 'Conesta Forge — 5-Day AI Build Sprint',
    issuer: 'Conesta Forge, in partnership with Fludigo',
    date: 'June 26, 2026',
    detail: 'Top 8 of 62 builders · Forge Score 2,080 · for building & shipping Sleep-Scribe',
    image: '/certs/conesta-forge.jpg',
    type: 'Build Sprint',
    rank: 'Top 8 of 62 · Forge Score 2,080',
    featured: true,
  },
  {
    name: 'Full Stack Development Internship',
    issuer: 'QAROO India Pvt. Ltd., Coimbatore',
    date: 'July 1, 2026',
    detail: 'Internship completion certificate · 01 June – 20 June 2026',
    image: '/certs/qaroo-internship.jpg',
    type: 'Internship',
  },
  {
    name: 'Machine Learning with Python',
    issuer: 'IBM, via Coursera',
    date: 'May 30, 2026',
    detail: 'Verify: coursera.org/verify/IP3RVZ0WK8TB',
    link: 'https://coursera.org/verify/IP3RVZ0WK8TB',
    image: '/certs/coursera-ml-with-python.png',
    type: 'Certification',
  },
  {
    name: 'Intro to ML Workshop',
    issuer: "Petrichor'26 Techno Cultural Fest, IIT Palakkad",
    date: 'September 27, 2025',
    detail: 'Certificate of Participation',
    image: '/certs/iit-palakkad.jpg',
    type: 'Workshop',
  },
  {
    name: 'Machine Learning Internship',
    issuer: 'Eron Techno Solutions Pvt. Ltd.',
    date: 'May 2026',
    detail: 'Internship completion certificate',
    image: '/certs/eron-internship.jpg',
    type: 'Internship',
    portrait: true,
  },
];

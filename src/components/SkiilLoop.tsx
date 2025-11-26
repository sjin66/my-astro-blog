import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiAstro,
  SiGit,
  SiDocker,
} from 'react-icons/si';

import LogoLoop from './LogoLoop';

const techLogos = [
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  {
    node: <SiTypescript />,
    title: 'TypeScript',
    href: 'https://www.typescriptlang.org',
  },
  {
    node: <SiTailwindcss />,
    title: 'Tailwind CSS',
    href: 'https://tailwindcss.com',
  },
  { node: <SiAstro />, title: 'Astro', href: 'https://astro.build' },
  { node: <SiGit />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com' },
];

export function SkillLoop() {
  return (
    <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
      <LogoLoop
        logos={techLogos}
        speed={80}
        direction="left"
        logoHeight={48}
        gap={50}
        pauseOnHover
        scaleOnHover
        fadeOut={false}
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );
}

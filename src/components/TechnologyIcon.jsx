import { HiOutlineCode } from 'react-icons/hi';
import {
  SiAngular, SiBootstrap, SiCss, SiDocker, SiExpress, SiFigma, SiGit,
  SiHtml5, SiJavascript, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPython, SiReact, SiRedux, SiTailwindcss, SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';

const iconMap = {
  react: SiReact,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  express: SiExpress,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  html: SiHtml5,
  css: SiCss,
  bootstrap: SiBootstrap,
  redux: SiRedux,
  mongodb: SiMongodb,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  database: SiPostgresql,
  git: SiGit,
  docker: SiDocker,
  figma: SiFigma,
  vue: SiVuedotjs,
  angular: SiAngular,
};

const normalise = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function getTechnologyIcon(technology) {
  const iconKey = normalise(technology.icon);
  const nameKey = normalise(technology.name);
  const match = Object.keys(iconMap).find(key => iconKey.includes(key) || nameKey.includes(key));
  return match ? iconMap[match] : HiOutlineCode;
}

export default function TechnologyIcon({ technology, size = 24, className = '' }) {
  if (technology.custom_icon) {
    return <img src={technology.custom_icon} alt={`${technology.name} icon`} className={`h-full w-full object-cover ${className}`} />;
  }

  const Icon = getTechnologyIcon(technology);
  return <Icon size={size} aria-hidden="true" className={className} />;
}

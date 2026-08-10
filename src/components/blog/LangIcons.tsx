import React from 'react';
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiPython,
  SiDocker,
  SiHtml5,
  SiCss3,
  SiGo,
} from 'react-icons/si';
import { CurlyBraces, FileCode, Terminal } from 'lucide-react';
import { IconDatabase } from '@tabler/icons-react';

type IconComponent = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
}>;

export const LANGUAGE_ICON_MAP: Record<
  string,
  {
    Icon: IconComponent;
    aliases: string[];
    color: string;
    name: string;
    ext: string;
  }
> = {
  javascript: {
    Icon: SiJavascript,
    aliases: ['js', 'javascript'],
    color: '#F7DF1E',
    name: 'JavaScript',
    ext: 'js',
  },
  typescript: {
    Icon: SiTypescript,
    aliases: ['ts', 'typescript'],
    color: '#3178C6',
    name: 'TypeScript',
    ext: 'ts',
  },
  tsx: {
    Icon: SiReact,
    aliases: ['tsx', 'jsx', 'react'],
    color: '#61DAFB',
    name: 'React / TSX',
    ext: 'tsx',
  },
  python: {
    Icon: SiPython,
    aliases: ['python', 'py'],
    color: '#3776AB',
    name: 'Python',
    ext: 'py',
  },
  docker: {
    Icon: SiDocker,
    aliases: ['docker', 'dockerfile'],
    color: '#2496ED',
    name: 'Docker',
    ext: 'dockerfile',
  },
  html: {
    Icon: SiHtml5,
    aliases: ['html', 'htm'],
    color: '#E34F26',
    name: 'HTML',
    ext: 'html',
  },
  css: {
    Icon: SiCss3,
    aliases: ['css'],
    color: '#1572B6',
    name: 'CSS',
    ext: 'css',
  },
  go: {
    Icon: SiGo,
    aliases: ['go', 'golang'],
    color: '#00ADD8',
    name: 'Go',
    ext: 'go',
  },
  sql: {
    Icon: IconDatabase,
    aliases: ['sql', 'mysql', 'sqlite', 'postgresql', 'database'],
    color: '#00758F',
    name: 'SQL',
    ext: 'sql',
  },
};

const SHELL_ALIASES = ['bash', 'sh', 'shell', 'zsh', 'powershell', 'ps1'];
const SHELL_EXT: Record<string, string> = {
  bash: 'sh',
  sh: 'sh',
  shell: 'sh',
  zsh: 'zsh',
  powershell: 'ps1',
  ps1: 'ps1',
};

function findEntry(normalizedLang: string) {
  return Object.values(LANGUAGE_ICON_MAP).find((item) =>
    item.aliases.includes(normalizedLang),
  );
}

export const getLanguageIcon = (lang: string, className = 'w-4 h-4') => {
  const normalizedLang = lang.toLowerCase().trim();
  const entry = findEntry(normalizedLang);

  if (entry) {
    return <entry.Icon className={className} style={{ color: entry.color }} />;
  }
  if (SHELL_ALIASES.includes(normalizedLang)) {
    return <Terminal className={`${className} text-green-500`} />;
  }
  if (normalizedLang === 'json') {
    return <CurlyBraces className={`${className} text-blue-500`} />;
  }
  return <FileCode className={`${className} text-purple-500`} />;
};

export const getFileExtension = (lang: string): string => {
  const normalizedLang = lang.toLowerCase().trim();
  const entry = findEntry(normalizedLang);

  if (entry) return entry.ext;
  if (SHELL_EXT[normalizedLang]) return SHELL_EXT[normalizedLang];
  if (normalizedLang === 'json') return 'json';
  if (normalizedLang === 'markdown' || normalizedLang === 'md') return 'md';
  if (normalizedLang === 'yaml' || normalizedLang === 'yml') return 'yml';

  return normalizedLang || 'txt';
};

export const getDownloadFilename = (lang: string): string => {
  const normalizedLang = lang.toLowerCase().trim();
  if (normalizedLang === 'docker' || normalizedLang === 'dockerfile') {
    return 'Dockerfile';
  }
  return `code.${getFileExtension(lang)}`;
};

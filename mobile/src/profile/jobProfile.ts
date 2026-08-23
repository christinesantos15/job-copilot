export type JobProfile = {
  targetRoles: string[];
  preferredSkills: string[];
  preferredLocations: string[];
  preferredLevels: string[];
};

export const jobProfile: JobProfile = {
  targetRoles: [
    'software engineer',
    'software developer',
    'frontend developer',
    'frontend engineer',
    'full stack developer',
    'full stack engineer',
    'ui/ux designer',
    'product designer',
  ],

  preferredSkills: [
    'react',
    'next.js',
    'typescript',
    'javascript',
    'python',
    'fastapi',
    'postgresql',
    'rest api',
    'git',
    'docker',
  ],

  preferredLocations: [
    'singapore',
  ],

  preferredLevels: [
    'junior',
    'graduate',
    'entry level',
    'intern',
  ],
};
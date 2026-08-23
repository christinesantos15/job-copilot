export type JobProfile = {
  targetRoles: string[];
  preferredSkills: string[];
  preferredLocations: string[];
  preferredLevels: string[];

  seniorLevels: string[];
  unrelatedSpecializations: string[];
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
    'figma',
  ],

  preferredLocations: [
    'singapore',
  ],

  preferredLevels: [
    'junior',
    'graduate',
    'entry level',
    'entry-level',
    'intern',
    'associate',
  ],

  seniorLevels: [
    'senior',
    'lead',
    'principal',
    'staff',
    'manager',
    'director',
    'head of',
  ],

  unrelatedSpecializations: [
    'cyber security',
    'cybersecurity',
    'security engineer',
    'embedded',
    'blockchain',
  ],
};
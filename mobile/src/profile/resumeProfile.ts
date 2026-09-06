export type ResumeExperience = {
  id: string;

  company: string;

  role: string;

  location: string;

  startDate: string;

  endDate: string;

  description: string;
};

export type ResumeProject = {
  id: string;

  name: string;

  description: string;

  technologies: string[];

  link: string;
};

export type ResumeEducation = {
  id: string;

  school: string;

  qualification: string;

  location: string;

  startDate: string;

  endDate: string;
};

export type ResumeProfile = {
  name: string;

  email: string;

  phone: string;

  location: string;

  linkedinUrl: string;

  githubUrl: string;

  portfolioUrl: string;

  headline: string;

  summary: string;

  skills: string[];

  experience: ResumeExperience[];

  projects: ResumeProject[];

  education: ResumeEducation[];
};

export const defaultResumeProfile: ResumeProfile = {
  name: '',

  email: '',

  phone: '',

  location: '',

  linkedinUrl: '',

  githubUrl: '',

  portfolioUrl: '',

  headline: '',

  summary: '',

  skills: [],

  experience: [],

  projects: [],

  education: [],
};
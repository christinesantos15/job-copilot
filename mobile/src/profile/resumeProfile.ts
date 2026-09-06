export type ResumeExperience = {
  id: string;
  company: string;
  role: string;
  description: string;
};

export type ResumeProject = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
};

export type ResumeEducation = {
  id: string;
  school: string;
  qualification: string;
};

export type ResumeProfile = {
  name: string;
  headline: string;
  summary: string;

  skills: string[];

  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
};

export const defaultResumeProfile: ResumeProfile = {
  name: '',

  headline: '',

  summary: '',

  skills: [],

  experience: [],

  projects: [],

  education: [],
};
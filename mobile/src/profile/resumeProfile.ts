export type ResumeSkillGroup = {
  id: string;

  label: string;

  skills: string[];
};

export type ResumeExperience = {
  id: string;

  company: string;

  role: string;

  location: string;

  startDate: string;

  endDate: string;

  /*
   * Kept for backward compatibility
   * with older saved Resume Profiles.
   */
  description: string;

  bullets: string[];
};

export type ResumeProject = {
  id: string;

  name: string;

  /*
   * Kept for backward compatibility
   * with older saved Resume Profiles.
   */
  description: string;

  technologies: string[];

  bullets: string[];

  link: string;
};

export type ResumeEducation = {
  id: string;

  school: string;

  qualification: string;

  location: string;

  startDate: string;

  endDate: string;

  details: string[];
};

export type ResumeCertification = {
  id: string;

  name: string;

  issuer: string;

  date: string;
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

  /*
   * Flat skills remain available because
   * the matcher already depends on them.
   */
  skills: string[];

  /*
   * Groups are used primarily for
   * formatted resume output.
   */
  skillGroups: ResumeSkillGroup[];

  experience: ResumeExperience[];

  projects: ResumeProject[];

  education: ResumeEducation[];

  certifications: ResumeCertification[];
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

  skillGroups: [],

  experience: [],

  projects: [],

  education: [],

  certifications: [],
};
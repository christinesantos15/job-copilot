export type Job = {
  id: string;

  title: string;
  company: string;
  location: string;

  salary?: string;
  type: string;

  source: string;
  sourceUrl: string;

  description: string;

  postedDate?: string;
  closingDate?: string;

  skills: string[];
};
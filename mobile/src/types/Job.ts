export type ApplicationStatus =
  | 'interested'
  | 'applied'
  | 'interview'
  | 'rejected'
  | 'offer';
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

  applicationStatus?: ApplicationStatus;
};
export type JobSourceType =
  | 'linkedin'
  | 'mycareersfuture'
  | 'indeed'
  | 'jobstreet'
  | 'lever'
  | 'greenhouse'
  | 'ashby'
  | 'company'
  | 'mock';

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

  source: JobSourceType;

  sourceLabel: string;

  sourceUrl: string;

  description: string;

  postedDate?: string;

  closingDate?: string;

  skills: string[];

  applicationStatus?: ApplicationStatus;

  matchScore?: number;

  matchReasons?: string[];

  notes?: string;

  appliedDate?: string;

  interviewDate?: string;

  followUpDate?: string;
};
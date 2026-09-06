import { Job } from '../types/Job';

export type JobSource = {
  id: string;

  label: string;

  fetchJobs: () => Promise<Job[]>;
};
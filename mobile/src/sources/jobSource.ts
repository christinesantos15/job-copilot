import { Job } from '../types/Job';

export type JobSource = {
  name: string;
  fetchJobs: () => Promise<Job[]>;
};
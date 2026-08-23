import { Job } from '../types/Job';
import { jobs } from '../data/jobs';
import { JobSource } from './jobSource';

export const mockSource: JobSource = {
  name: 'Mock Source',

  async fetchJobs(): Promise<Job[]> {
    return jobs;
  },
};
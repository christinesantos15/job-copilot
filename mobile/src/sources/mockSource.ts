import { Job } from '../types/Job';
import { mockJobs } from '../data/mockJobs';
import { JobSource } from './jobSource';

export const mockSource: JobSource = {
  name: 'Mock Source',

  async fetchJobs(): Promise<Job[]> {
    return mockJobs;
  },
};
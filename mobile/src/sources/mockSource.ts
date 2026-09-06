import { mockJobs } from '../data/mockJobs';
import { JobSource } from './jobSource';

export const mockSource: JobSource = {
  id: 'mock',
  label: 'Mock Source',

  async fetchJobs() {
    return mockJobs;
  },
};

export default mockSource;
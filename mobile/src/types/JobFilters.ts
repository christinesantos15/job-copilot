export type JobFilters = {
  keyword: string;
  location: string;
  jobType: string;
  source: string;
  minimumMatchScore: number;
};

export const defaultJobFilters: JobFilters = {
  keyword: '',
  location: '',
  jobType: '',
  source: '',
  minimumMatchScore: 0,
};
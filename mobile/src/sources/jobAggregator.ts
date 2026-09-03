import { Job } from '../types/Job';
import { JobSource } from './jobSource';
import { mockSource } from './mockSource';
import { leverSource } from './leverSource';
import { addMatchScores } from '../matching/jobMatcher';

const sources: JobSource[] = [
  mockSource,
  leverSource,
];

function createJobKey(job: Job): string {
  return [
    job.title.trim().toLowerCase(),
    job.company.trim().toLowerCase(),
    job.location.trim().toLowerCase(),
  ].join('|');
}

function removeDuplicateJobs(
  jobs: Job[]
): Job[] {
  const seenJobs = new Set<string>();

  return jobs.filter((job) => {
    const key = createJobKey(job);

    if (seenJobs.has(key)) {
      return false;
    }

    seenJobs.add(key);

    return true;
  });
}

function interleaveSources(
  jobGroups: Job[][]
): Job[] {
  const result: Job[] = [];

  let index = 0;

  while (true) {
    let addedJob = false;

    for (const group of jobGroups) {
      if (index < group.length) {
        result.push(group[index]);
        addedJob = true;
      }
    }

    if (!addedJob) {
      break;
    }

    index++;
  }

  return result;
}

export async function fetchAllJobs(): Promise<Job[]> {
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        const jobs = await source.fetchJobs();

        console.log(
          `${source.name}: loaded ${jobs.length} jobs`
        );

        return jobs;
      } catch (error) {
        console.error(
          `${source.name} source failed:`,
          error
        );

        return [];
      }
    })
  );

  const mixedJobs =
    interleaveSources(results);

  const uniqueJobs =
    removeDuplicateJobs(
      mixedJobs
    );

  return addMatchScores(
    uniqueJobs
  );
}

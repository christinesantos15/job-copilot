import { Job } from '../types/Job';
import { JobSource } from './jobSource';

import { leverSource } from './leverSource';

import {
  greenhouseSource,
} from './greenhouseSource';

import {
  ashbySource,
} from './ashbySource';

/*
 * LIVE PRODUCTION SOURCES
 *
 * mockSource is intentionally
 * excluded.
 */

const jobSources: JobSource[] = [
  leverSource,
  greenhouseSource,
  ashbySource,
];

function normalizeText(
  value?: string
) {
  return (value ?? '')
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      ' '
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim();
}

function getDuplicateKey(
  job: Job
) {
  return [
    normalizeText(
      job.company
    ),

    normalizeText(
      job.title
    ),

    normalizeText(
      job.location
    ),
  ].join('|');
}

function deduplicateJobs(
  jobs: Job[]
) {
  const seenIds =
    new Set<string>();

  const seenListings =
    new Set<string>();

  const uniqueJobs:
    Job[] = [];

  for (const job of jobs) {
    /*
     * Exact provider ID match.
     */

    if (
      seenIds.has(job.id)
    ) {
      continue;
    }

    const duplicateKey =
      getDuplicateKey(job);

    /*
     * Cross-provider duplicate.
     *
     * Example:
     * the same company/title/location
     * appearing through two ATS feeds.
     */

    if (
      seenListings.has(
        duplicateKey
      )
    ) {
      continue;
    }

    seenIds.add(job.id);

    seenListings.add(
      duplicateKey
    );

    uniqueJobs.push(job);
  }

  return uniqueJobs;
}

export async function fetchAllJobs():
  Promise<Job[]> {
  console.log(
    '[Job Aggregator] Fetching live jobs...'
  );

  const results =
    await Promise.allSettled(
      jobSources.map(
        async (source) => {
          const startedAt =
            Date.now();

          const jobs =
            await source.fetchJobs();

          const duration =
            Date.now() -
            startedAt;

          console.log(
            `[Job Aggregator] ${source.label}: ${jobs.length} jobs (${duration}ms)`
          );

          return jobs;
        }
      )
    );

  const collectedJobs:
    Job[] = [];

  results.forEach(
    (result, index) => {
      const source =
        jobSources[index];

      if (
        result.status ===
        'fulfilled'
      ) {
        collectedJobs.push(
          ...result.value
        );

        return;
      }

      console.warn(
        `[Job Aggregator] Source failed: ${source.label}`,
        result.reason
      );
    }
  );

  const deduplicatedJobs =
    deduplicateJobs(
      collectedJobs
    );

  const removedCount =
    collectedJobs.length -
    deduplicatedJobs.length;

  console.log(
    `[Job Aggregator] Total fetched: ${collectedJobs.length}`
  );

  console.log(
    `[Job Aggregator] Duplicates removed: ${removedCount}`
  );

  console.log(
    `[Job Aggregator] Discover jobs: ${deduplicatedJobs.length}`
  );

  return deduplicatedJobs;
}
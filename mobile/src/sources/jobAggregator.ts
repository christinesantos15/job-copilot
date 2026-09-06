import {
  Job,
} from '../types/Job';

import {
  JobSource,
} from './jobSource';

import {
  leverSource,
} from './leverSource';

import {
  greenhouseSource,
} from './greenhouseSource';

/*
 * PRODUCTION SOURCES
 *
 * mockSource is intentionally
 * NOT included here anymore.
 */

const jobSources:
  JobSource[] = [
    leverSource,
    greenhouseSource,
  ];

/*
 * NORMALIZE TEXT FOR
 * DEDUPLICATION.
 */

function normalizeText(
  value?: string
) {
  return (
    value ?? ''
  )
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

/*
 * Jobs can appear through
 * multiple feeds.
 *
 * Primary identity remains the
 * source-prefixed ID.
 *
 * For cross-source duplicates,
 * compare:
 *
 * company + title + location
 */

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

  for (
    const job of jobs
  ) {
    if (
      seenIds.has(
        job.id
      )
    ) {
      continue;
    }

    const duplicateKey =
      getDuplicateKey(
        job
      );

    if (
      seenListings.has(
        duplicateKey
      )
    ) {
      continue;
    }

    seenIds.add(
      job.id
    );

    seenListings.add(
      duplicateKey
    );

    uniqueJobs.push(
      job
    );
  }

  return uniqueJobs;
}

/*
 * FETCH SOURCES IN PARALLEL.
 *
 * Promise.allSettled means one
 * provider failing does not
 * destroy the entire Discover
 * feed.
 */

export async function fetchAllJobs():
  Promise<Job[]> {
  const results =
    await Promise.allSettled(
      jobSources.map(
        async (
          source
        ) => {
          const jobs =
            await source.fetchJobs();

          console.log(
            `[Job Aggregator] ${source.label}: ${jobs.length} jobs`
          );

          return jobs;
        }
      )
    );

  const collectedJobs:
    Job[] = [];

  results.forEach(
    (
      result,
      index
    ) => {
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

  console.log(
    `[Job Aggregator] Total: ${collectedJobs.length}`
  );

  console.log(
    `[Job Aggregator] After dedupe: ${deduplicatedJobs.length}`
  );

  return deduplicatedJobs;
}
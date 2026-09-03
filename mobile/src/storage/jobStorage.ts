import AsyncStorage from '@react-native-async-storage/async-storage';

import { Job } from '../types/Job';

const INTERESTED_JOBS_KEY =
  'job-copilot:interested-jobs';

const SEEN_JOB_IDS_KEY =
  'job-copilot:seen-job-ids';

/*
 * INTERESTED / APPLICATION JOBS
 */

export async function saveInterestedJobs(
  jobs: Job[]
) {
  await AsyncStorage.setItem(
    INTERESTED_JOBS_KEY,
    JSON.stringify(jobs)
  );
}

export async function loadInterestedJobs(): Promise<Job[]> {
  const storedJobs =
    await AsyncStorage.getItem(
      INTERESTED_JOBS_KEY
    );

  if (!storedJobs) {
    return [];
  }

  try {
    return JSON.parse(storedJobs);
  } catch {
    return [];
  }
}

/*
 * SEEN JOB IDS
 */

export async function saveSeenJobIds(
  jobIds: string[]
) {
  await AsyncStorage.setItem(
    SEEN_JOB_IDS_KEY,
    JSON.stringify(jobIds)
  );
}

export async function loadSeenJobIds(): Promise<string[]> {
  const storedIds =
    await AsyncStorage.getItem(
      SEEN_JOB_IDS_KEY
    );

  if (!storedIds) {
    return [];
  }

  try {
    return JSON.parse(storedIds);
  } catch {
    return [];
  }
}

/*
 * RESTART FEED ONLY
 */

export async function clearFeedSession() {
  await AsyncStorage.removeItem(
    SEEN_JOB_IDS_KEY
  );
}

/*
 * FULL RESET
 *
 * Clears old development/test data.
 */

export async function clearAllJobData() {
  await AsyncStorage.multiRemove([
    INTERESTED_JOBS_KEY,
    SEEN_JOB_IDS_KEY,
  ]);
}
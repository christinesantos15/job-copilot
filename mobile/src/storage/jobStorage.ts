import AsyncStorage from '@react-native-async-storage/async-storage';

import { Job } from '../types/Job';

const CURRENT_INDEX_KEY = 'job-copilot:current-index';
const INTERESTED_JOBS_KEY = 'job-copilot:interested-jobs';

export async function saveCurrentIndex(
  currentIndex: number
) {
  await AsyncStorage.setItem(
    CURRENT_INDEX_KEY,
    currentIndex.toString()
  );
}

export async function loadCurrentIndex() {
  const storedIndex = await AsyncStorage.getItem(
    CURRENT_INDEX_KEY
  );

  if (storedIndex === null) {
    return 0;
  }

  return Number(storedIndex);
}

export async function saveInterestedJobs(
  jobs: Job[]
) {
  await AsyncStorage.setItem(
    INTERESTED_JOBS_KEY,
    JSON.stringify(jobs)
  );
}

export async function loadInterestedJobs(): Promise<Job[]> {
  const storedJobs = await AsyncStorage.getItem(
    INTERESTED_JOBS_KEY
  );

  if (storedJobs === null) {
    return [];
  }

  return JSON.parse(storedJobs);
}
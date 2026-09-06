import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  JobProfile,
  jobProfile,
} from '../profile/jobProfile';

const JOB_PREFERENCES_KEY =
  'job-copilot:job-preferences';

export async function saveJobPreferences(
  preferences: JobProfile
) {
  await AsyncStorage.setItem(
    JOB_PREFERENCES_KEY,
    JSON.stringify(preferences)
  );
}

export async function loadJobPreferences(): Promise<JobProfile> {
  const storedPreferences =
    await AsyncStorage.getItem(
      JOB_PREFERENCES_KEY
    );

  if (!storedPreferences) {
    return jobProfile;
  }

  try {
    const parsed: Partial<JobProfile> =
      JSON.parse(storedPreferences);

    return {
      ...jobProfile,
      ...parsed,
    };
  } catch {
    return jobProfile;
  }
}

export async function resetJobPreferences() {
  await AsyncStorage.removeItem(
    JOB_PREFERENCES_KEY
  );
}

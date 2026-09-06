import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  defaultResumeProfile,
  ResumeProfile,
} from '../profile/resumeProfile';

const RESUME_PROFILE_KEY =
  'job-copilot:resume-profile';

export async function saveResumeProfile(
  profile: ResumeProfile
) {
  await AsyncStorage.setItem(
    RESUME_PROFILE_KEY,
    JSON.stringify(profile)
  );
}

export async function loadResumeProfile():
  Promise<ResumeProfile> {
  const stored =
    await AsyncStorage.getItem(
      RESUME_PROFILE_KEY
    );

  if (!stored) {
    return defaultResumeProfile;
  }

  try {
    const parsed: Partial<ResumeProfile> =
      JSON.parse(stored);

    return {
      ...defaultResumeProfile,
      ...parsed,

      skills:
        parsed.skills ?? [],

      experience:
        parsed.experience ?? [],

      projects:
        parsed.projects ?? [],

      education:
        parsed.education ?? [],
    };
  } catch {
    return defaultResumeProfile;
  }
}

export async function resetResumeProfile() {
  await AsyncStorage.removeItem(
    RESUME_PROFILE_KEY
  );
}
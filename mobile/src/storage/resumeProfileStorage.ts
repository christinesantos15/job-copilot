import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  defaultResumeProfile,
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeProfile,
  ResumeProject,
  ResumeSkillGroup,
} from '../profile/resumeProfile';

const STORAGE_KEY =
  'job-copilot:resume-profile';

function createFallbackId(
  prefix: string
) {
  return (
    `${prefix}-` +
    `${Date.now()}-` +
    `${Math.random()
      .toString(36)
      .slice(2, 8)}`
  );
}

function normalizeStringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
        'string'
    )
    .map((item) =>
      item.trim()
    )
    .filter(Boolean);
}

function normalizeSkillGroup(
  value: Partial<ResumeSkillGroup>
): ResumeSkillGroup {
  return {
    id:
      value.id ??
      createFallbackId(
        'skill-group'
      ),

    label:
      value.label ?? '',

    skills:
      normalizeStringArray(
        value.skills
      ),
  };
}

function normalizeExperience(
  value: Partial<ResumeExperience>
): ResumeExperience {
  return {
    id:
      value.id ??
      createFallbackId(
        'experience'
      ),

    company:
      value.company ?? '',

    role:
      value.role ?? '',

    location:
      value.location ?? '',

    startDate:
      value.startDate ?? '',

    endDate:
      value.endDate ?? '',

    description:
      value.description ?? '',

    bullets:
      normalizeStringArray(
        value.bullets
      ),
  };
}

function normalizeProject(
  value: Partial<ResumeProject>
): ResumeProject {
  return {
    id:
      value.id ??
      createFallbackId(
        'project'
      ),

    name:
      value.name ?? '',

    description:
      value.description ?? '',

    technologies:
      normalizeStringArray(
        value.technologies
      ),

    bullets:
      normalizeStringArray(
        value.bullets
      ),

    link:
      value.link ?? '',
  };
}

function normalizeEducation(
  value: Partial<ResumeEducation>
): ResumeEducation {
  return {
    id:
      value.id ??
      createFallbackId(
        'education'
      ),

    school:
      value.school ?? '',

    qualification:
      value.qualification ?? '',

    location:
      value.location ?? '',

    startDate:
      value.startDate ?? '',

    endDate:
      value.endDate ?? '',

    details:
      normalizeStringArray(
        value.details
      ),
  };
}

function normalizeCertification(
  value: Partial<ResumeCertification>
): ResumeCertification {
  return {
    id:
      value.id ??
      createFallbackId(
        'certification'
      ),

    name:
      value.name ?? '',

    issuer:
      value.issuer ?? '',

    date:
      value.date ?? '',
  };
}

function normalizeResumeProfile(
  value: Partial<ResumeProfile>
): ResumeProfile {
  return {
    name:
      value.name ?? '',

    email:
      value.email ?? '',

    phone:
      value.phone ?? '',

    location:
      value.location ?? '',

    linkedinUrl:
      value.linkedinUrl ?? '',

    githubUrl:
      value.githubUrl ?? '',

    portfolioUrl:
      value.portfolioUrl ?? '',

    headline:
      value.headline ?? '',

    summary:
      value.summary ?? '',

    skills:
      normalizeStringArray(
        value.skills
      ),

    skillGroups:
      Array.isArray(
        value.skillGroups
      )
        ? value.skillGroups.map(
            normalizeSkillGroup
          )
        : [],

    experience:
      Array.isArray(
        value.experience
      )
        ? value.experience.map(
            normalizeExperience
          )
        : [],

    projects:
      Array.isArray(
        value.projects
      )
        ? value.projects.map(
            normalizeProject
          )
        : [],

    education:
      Array.isArray(
        value.education
      )
        ? value.education.map(
            normalizeEducation
          )
        : [],

    certifications:
      Array.isArray(
        value.certifications
      )
        ? value.certifications.map(
            normalizeCertification
          )
        : [],
  };
}

export async function saveResumeProfile(
  profile: ResumeProfile
) {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profile)
  );
}

export async function loadResumeProfile():
Promise<ResumeProfile> {
  try {
    const stored =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );

    if (!stored) {
      return {
        ...defaultResumeProfile,
      };
    }

    const parsed =
      JSON.parse(stored) as
        Partial<ResumeProfile>;

    return normalizeResumeProfile(
      parsed
    );
  } catch (error) {
    console.error(
      'Failed to load Resume Profile:',
      error
    );

    return {
      ...defaultResumeProfile,
    };
  }
}

export async function resetResumeProfile() {
  await AsyncStorage.removeItem(
    STORAGE_KEY
  );

  return {
    ...defaultResumeProfile,
  };
}
import { Job } from '../types/Job';

import {
  JobProfile,
  jobProfile,
} from '../profile/jobProfile';

export type MatchResult = {
  score: number;
  reasons: string[];
  warnings: string[];
  matchedSkills: string[];
  missingSkills: string[];
};

function findMissingSkills(
  job: Job,
  matchedSkills: string[]
): string[] {
  const normalizedMatched =
    matchedSkills.map((skill) =>
      skill.toLowerCase()
    );

  return job.skills.filter(
    (skill) =>
      !normalizedMatched.includes(
        skill.toLowerCase()
      )
  );
}

function extractRequiredYears(
  text: string
): number | null {
  const patterns = [
    // 3+ years
    /(\d+)\s*\+\s*years?/i,

    // 3-5 years or 3–5 years
    /(\d+)\s*[-–]\s*\d+\s*years?/i,

    // 3 to 5 years
    /(\d+)\s*to\s*\d+\s*years?/i,

    // minimum 3 years / minimum of 3 years
    /minimum\s+(?:of\s+)?(\d+)\s*years?/i,

    // at least 3 years
    /at\s+least\s+(\d+)\s*years?/i,

    // 3 years of experience
    // 3 years relevant experience
    /(\d+)\s*years?['’]?\s+(?:of\s+)?(?:relevant\s+)?experience/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

export function evaluateJob(
  job: Job,
  profile: JobProfile = jobProfile
): MatchResult {
  const title =
    job.title.toLowerCase();

  const location =
    job.location.toLowerCase();

  const searchableText = [
    job.title,
    job.description,
    job.skills.join(' '),
  ]
    .join(' ')
    .toLowerCase();

  let score = 0;

  const reasons: string[] = [];
  const warnings: string[] = [];
  const matchedSkills: string[] = [];

  // -------------------------
  // TARGET ROLE
  // Maximum: +30
  // -------------------------

  const targetRole =
    profile.targetRoles.find(
      (role) =>
        title.includes(
          role.toLowerCase()
        )
    );

  if (targetRole) {
    score += 30;

    reasons.push(
      `Target role: ${targetRole}`
    );
  }

  // -------------------------
  // LOCATION
  // Maximum: +20
  // -------------------------

  const locationMatch =
    profile.preferredLocations.find(
      (preferredLocation) =>
        location.includes(
          preferredLocation.toLowerCase()
        )
    );

  if (locationMatch) {
    score += 20;

    reasons.push(
      `Location: ${locationMatch}`
    );
  }

  // -------------------------
  // CAREER LEVEL
  // Maximum: +15
  // -------------------------

  const preferredLevel =
    profile.preferredLevels.find(
      (level) =>
        title.includes(
          level.toLowerCase()
        )
    );

  if (preferredLevel) {
    score += 15;

    reasons.push(
      `Career level: ${preferredLevel}`
    );
  }

  // -------------------------
  // SKILLS
  // Maximum: +35
  // -------------------------

  for (
    const skill of
    profile.preferredSkills
  ) {
    if (
      searchableText.includes(
        skill.toLowerCase()
      )
    ) {
      matchedSkills.push(skill);
    }
  }

  const uniqueMatchedSkills = [
    ...new Set(matchedSkills),
  ];

  const missingSkills =
    findMissingSkills(
      job,
      uniqueMatchedSkills
    );

  const skillScore = Math.min(
    uniqueMatchedSkills.length * 7,
    35
  );

  score += skillScore;

  uniqueMatchedSkills.forEach(
    (skill) => {
      reasons.push(
        `Skill: ${skill}`
      );
    }
  );

  // -------------------------
  // MISSING SKILLS PENALTY
  // -------------------------

  if (missingSkills.length >= 4) {
    score -= 15;

    warnings.push(
      `Several requested skills are missing: ${missingSkills
        .slice(0, 3)
        .join(', ')}`
    );
  } else if (
    missingSkills.length >= 2
  ) {
    score -= 5;

    warnings.push(
      `Some requested skills are missing: ${missingSkills
        .slice(0, 3)
        .join(', ')}`
    );
  }

  // -------------------------
  // SENIORITY PENALTY
  // -------------------------

  const seniorLevel =
    profile.seniorLevels.find(
      (level) =>
        title.includes(
          level.toLowerCase()
        )
    );

  if (seniorLevel) {
    score -= 25;

    warnings.push(
      `Seniority mismatch: ${seniorLevel}`
    );
  }

  // -------------------------
  // EXPERIENCE / FRESH GRAD
  // Maximum positive: +15
  // -------------------------

  const freshGraduateSignals = [
    'fresh graduate',
    'fresh graduates',
    'new graduate',
    'new graduates',
    'recent graduate',
    'recent graduates',
    '0-1 years',
    '0 - 1 years',
    '0 to 1 years',
    'no experience required',
    'no prior experience required',
  ];

  const freshGraduateMatch =
    freshGraduateSignals.find(
      (signal) =>
        searchableText.includes(
          signal
        )
    );

  const requiredYears =
    extractRequiredYears(
      searchableText
    );

  if (freshGraduateMatch) {
    score += 15;

    reasons.push(
      'Fresh graduate / entry-level friendly'
    );
  } else if (
    requiredYears !== null
  ) {
    if (requiredYears <= 1) {
      score += 10;

      reasons.push(
        'Experience requirement fits: 0-1 year'
      );
    } else if (
      requiredYears === 2
    ) {
      score += 5;

      reasons.push(
        'Experience requirement is still reasonable: 2 years'
      );
    } else if (
      requiredYears >= 3
    ) {
      score -= 20;

      warnings.push(
        `Experience requirement may be high: ${requiredYears}+ years`
      );
    }
  }

  // -------------------------
  // SPECIALIZATION PENALTY
  // -------------------------

  const unrelatedSpecialization =
    profile.unrelatedSpecializations.find(
      (specialization) =>
        title.includes(
          specialization.toLowerCase()
        )
    );

  if (unrelatedSpecialization) {
    score -= 15;

    warnings.push(
      `Specialization mismatch: ${unrelatedSpecialization}`
    );
  }

  // -------------------------
  // FINAL SCORE
  // Clamp between 0 and 100
  // -------------------------

  const finalScore = Math.max(
    0,
    Math.min(score, 100)
  );

  return {
    score: finalScore,

    reasons: [
      ...new Set(reasons),
    ],

    warnings: [
      ...new Set(warnings),
    ],

    matchedSkills:
      uniqueMatchedSkills,

    missingSkills,
  };
}

export function addMatchScores(
  jobs: Job[],
  profile: JobProfile = jobProfile
): Job[] {
  return jobs.map((job) => {
    const result =
      evaluateJob(
        job,
        profile
      );

    return {
      ...job,

      matchScore:
        result.score,

      matchReasons: [
        ...result.reasons,
        ...result.warnings,
      ],
    };
  });
}

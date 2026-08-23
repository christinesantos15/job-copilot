import { Job } from '../types/Job';
import { jobProfile } from '../profile/jobProfile';

export type MatchResult = {
  score: number;
  reasons: string[];
  warnings: string[];
  matchedSkills: string[];
};

export function evaluateJob(
  job: Job
): MatchResult {
  const title = job.title.toLowerCase();
  const location = job.location.toLowerCase();

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

  const targetRole = jobProfile.targetRoles.find(
    (role) => title.includes(role)
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
    jobProfile.preferredLocations.find(
      (preferredLocation) =>
        location.includes(
          preferredLocation
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
    jobProfile.preferredLevels.find(
      (level) => title.includes(level)
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
    jobProfile.preferredSkills
  ) {
    if (searchableText.includes(skill)) {
      matchedSkills.push(skill);
    }
  }

  const uniqueMatchedSkills = [
    ...new Set(matchedSkills),
  ];

  const skillScore = Math.min(
    uniqueMatchedSkills.length * 7,
    35
  );

  score += skillScore;

  uniqueMatchedSkills.forEach((skill) => {
    reasons.push(`Skill: ${skill}`);
  });

  // -------------------------
  // SENIORITY PENALTY
  // -------------------------

  const seniorLevel =
    jobProfile.seniorLevels.find(
      (level) => title.includes(level)
    );

  if (seniorLevel) {
    score -= 25;

    warnings.push(
      `Seniority mismatch: ${seniorLevel}`
    );
  }

  // -------------------------
  // SPECIALIZATION PENALTY
  // -------------------------

  const unrelatedSpecialization =
    jobProfile.unrelatedSpecializations.find(
      (specialization) =>
        title.includes(specialization)
    );

  if (unrelatedSpecialization) {
    score -= 15;

    warnings.push(
      `Specialization mismatch: ${unrelatedSpecialization}`
    );
  }

  // Never return below 0 or above 100.

  const finalScore = Math.max(
    0,
    Math.min(score, 100)
  );

  return {
    score: finalScore,
    reasons: [...new Set(reasons)],
    warnings: [...new Set(warnings)],
    matchedSkills: uniqueMatchedSkills,
  };
}

export function addMatchScores(
  jobs: Job[]
): Job[] {
  return jobs.map((job) => {
    const result = evaluateJob(job);

    return {
      ...job,
      matchScore: result.score,
      matchReasons: [
        ...result.reasons,
        ...result.warnings,
      ],
    };
  });
}
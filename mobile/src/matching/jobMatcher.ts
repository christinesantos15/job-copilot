import { Job } from '../types/Job';
import { jobProfile } from '../profile/jobProfile';

type MatchResult = {
  score: number;
  reasons: string[];
};

export function evaluateJob(
  job: Job
): MatchResult {
  const searchableText = [
    job.title,
    job.description,
    job.skills.join(' '),
  ]
    .join(' ')
    .toLowerCase();

  const title =
    job.title.toLowerCase();

  const location =
    job.location.toLowerCase();

  let score = 0;

  const reasons: string[] = [];

  for (const role of jobProfile.targetRoles) {
    if (title.includes(role)) {
      score += 20;
      reasons.push(`Target role: ${role}`);
    } else if (
      searchableText.includes(role)
    ) {
      score += 10;
      reasons.push(`Related role: ${role}`);
    }
  }

  for (
    const skill of
    jobProfile.preferredSkills
  ) {
    if (
      searchableText.includes(skill)
    ) {
      score += 10;
      reasons.push(`Skill: ${skill}`);
    }
  }

  for (
    const level of
    jobProfile.preferredLevels
  ) {
    if (title.includes(level)) {
      score += 20;
      reasons.push(`Level: ${level}`);
    }
  }

  for (
    const preferredLocation of
    jobProfile.preferredLocations
  ) {
    if (
      location.includes(
        preferredLocation
      )
    ) {
      score += 10;
      reasons.push(
        `Location: ${preferredLocation}`
      );
    }
  }

  return {
    score,
    reasons: [
      ...new Set(reasons),
    ],
  };
}

export function addMatchScores(
  jobs: Job[]
): Job[] {
  return jobs.map((job) => {
    const result =
      evaluateJob(job);

    return {
      ...job,
      matchScore: result.score,
      matchReasons:
        result.reasons,
    };
  });
}
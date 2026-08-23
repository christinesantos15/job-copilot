import { Job } from '../types/Job';

type CandidateProfile = {
  targetRoles: string[];
  preferredLocations: string[];
  skills: string[];
};

export function calculateMatchScore(
  job: Job,
  profile: CandidateProfile
) {
  let score = 0;
  const reasons: string[] = [];

  const title = job.title.toLowerCase();
  const location = job.location.toLowerCase();

  const roleMatch = profile.targetRoles.some((role) =>
    title.includes(role.toLowerCase())
  );

  if (roleMatch) {
    score += 30;
    reasons.push(`Target role: ${job.title}`);
  }

  const locationMatch = profile.preferredLocations.some((preferred) =>
    location.includes(preferred.toLowerCase())
  );

  if (locationMatch) {
    score += 20;
    reasons.push(`Location: ${job.location}`);
  }

  const matchedSkills = job.skills.filter((skill) =>
    profile.skills.some(
      (candidateSkill) =>
        candidateSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  const skillScore = Math.min(matchedSkills.length * 10, 50);

  score += skillScore;

  matchedSkills.forEach((skill) => {
    reasons.push(`Skill: ${skill}`);
  });

  return {
    score: Math.min(score, 100),
    reasons,
  };
}
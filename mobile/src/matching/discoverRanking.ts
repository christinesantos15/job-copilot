import { Job } from '../types/Job';

type RankedJob = {
  job: Job;
  score: number;
};

function normalizeText(value?: string) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(
  text: string,
  terms: string[]
) {
  return terms.some((term) =>
    text.includes(term)
  );
}

function calculateDiscoverScore(
  job: Job
) {
  /*
   * Start with the existing match score.
   *
   * Your matcher already scores jobs
   * against the user's saved preferences,
   * skills, roles, location, etc.
   */
  let score =
    (job.matchScore ?? 0) * 1.5;

  const title =
    normalizeText(job.title);

  const location =
    normalizeText(job.location);

  const description =
    normalizeText(job.description);

  const skills =
    normalizeText(
      (job.skills ?? []).join(' ')
    );

  const fullText = [
    title,
    description,
    skills,
  ].join(' ');

  /*
   * LEVEL BOOSTS
   *
   * Prioritize realistic early-career
   * opportunities.
   */

  const juniorTerms = [
    'junior',
    'graduate',
    'new grad',
    'entry level',
    'entry-level',
    'associate',
  ];

  const internshipTerms = [
    'intern',
    'internship',
  ];

  if (
    includesAny(
      title,
      juniorTerms
    )
  ) {
    score += 45;
  }

  if (
    includesAny(
      title,
      internshipTerms
    )
  ) {
    score += 28;
  }

  /*
   * TARGET SOFTWARE ROLES
   */

  const strongTargetRoles = [
    'software engineer',
    'software developer',
    'frontend engineer',
    'frontend developer',
    'front end engineer',
    'front end developer',
    'full stack engineer',
    'full stack developer',
    'fullstack engineer',
    'fullstack developer',
  ];

  if (
    includesAny(
      title,
      strongTargetRoles
    )
  ) {
    score += 40;
  }

  /*
   * ADJACENT ROLES
   *
   * Still relevant, but below the
   * strongest software matches.
   */

  const adjacentRoles = [
    'web developer',
    'application developer',
    'mobile developer',
    'mobile engineer',
    'react developer',
    'react native',
    'product engineer',
    'ui developer',
    'ux engineer',
    'ui ux',
    'product designer',
    'ui designer',
    'ux designer',
    'qa engineer',
    'test engineer',
    'automation engineer',
    'data engineer',
    'devops engineer',
    'cloud engineer',
  ];

  if (
    includesAny(
      title,
      adjacentRoles
    )
  ) {
    score += 18;
  }

  /*
   * SINGAPORE BOOST
   */

  if (
    location.includes(
      'singapore'
    )
  ) {
    score += 20;
  }

  /*
   * RELEVANT TECHNOLOGIES
   */

  const usefulSkills = [
    'react',
    'react native',
    'next.js',
    'nextjs',
    'typescript',
    'javascript',
    'python',
    'fastapi',
    'postgresql',
    'sql',
    'rest api',
    'docker',
    'git',
    'html',
    'css',
    'figma',
  ];

  let skillMatches = 0;

  for (
    const skill of usefulSkills
  ) {
    if (
      fullText.includes(skill)
    ) {
      skillMatches += 1;
    }
  }

  /*
   * Cap this so jobs listing lots of
   * technologies don't automatically
   * dominate the feed.
   */
  score += Math.min(
    skillMatches * 4,
    28
  );

  /*
   * SENIORITY PENALTIES
   *
   * We DO NOT remove these jobs.
   * They simply appear much later.
   */

  const seniorTerms = [
    'senior',
    'staff',
    'principal',
    'lead',
    'manager',
    'director',
    'head of',
    'vp ',
    'vice president',
  ];

  if (
    includesAny(
      title,
      seniorTerms
    )
  ) {
    score -= 75;
  }

  /*
   * Very senior engineering titles
   * get an additional penalty.
   */

  const verySeniorTerms = [
    'distinguished',
    'chief',
    'engineering manager',
    'technical lead',
    'tech lead',
  ];

  if (
    includesAny(
      title,
      verySeniorTerms
    )
  ) {
    score -= 35;
  }

  /*
   * UNRELATED ROLE PENALTIES
   *
   * Keep them searchable, but push
   * them below relevant technical jobs.
   */

  const unrelatedRoles = [
    'account executive',
    'sales',
    'recruiter',
    'recruiting',
    'human resources',
    'hr ',
    'finance',
    'legal',
    'counsel',
    'marketing',
    'operations manager',
    'customer success',
    'business development',
    'office manager',
  ];

  if (
    includesAny(
      title,
      unrelatedRoles
    )
  ) {
    score -= 85;
  }

  /*
   * Specialized technical paths that
   * are less aligned with the target.
   */

  const specializedRoles = [
    'security engineer',
    'cybersecurity',
    'cyber security',
    'embedded engineer',
    'embedded software',
    'blockchain',
  ];

  if (
    includesAny(
      title,
      specializedRoles
    )
  ) {
    score -= 30;
  }

  return score;
}

export function rankDiscoverJobs(
  jobs: Job[]
): Job[] {
  const ranked: RankedJob[] =
    jobs.map((job) => ({
      job,
      score:
        calculateDiscoverScore(
          job
        ),
    }));

  ranked.sort(
    (a, b) =>
      b.score - a.score
  );

  return ranked.map(
    ({ job }) => job
  );
}
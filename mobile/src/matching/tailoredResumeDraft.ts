import {
  ResumeEducation,
  ResumeExperience,
  ResumeProfile,
  ResumeProject,
} from '../profile/resumeProfile';

import {
  Job,
} from '../types/Job';

import {
  analyzeResumeMatch,
} from './resumeMatchAnalysis';

export type TailoredResumeExperience = {
  id: string;
  role: string;
  company: string;
  description: string;
  relevanceScore: number;
};

export type TailoredResumeProject = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  relevanceScore: number;
};

export type TailoredResumeDraft = {
  name: string;
  targetRole: string;
  headline: string;
  summary: string;
  skills: string[];
  experience:
    TailoredResumeExperience[];
  projects:
    TailoredResumeProject[];
  education:
    ResumeEducation[];
  warnings: string[];
};

function normalize(
  value?: string
) {
  return (value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function containsTerm(
  text: string,
  term: string
) {
  return normalize(text).includes(
    normalize(term)
  );
}

function countMatches(
  text: string,
  terms: string[]
) {
  return terms.filter(
    (term) =>
      containsTerm(
        text,
        term
      )
  ).length;
}

function getProjectScore(
  project: ResumeProject,
  matchedSkills: string[],
  job: Job
) {
  const text =
    [
      project.name,
      project.description,
      ...project.technologies,
    ].join(' ');

  let score =
    countMatches(
      text,
      matchedSkills
    ) * 10;

  const jobSkills =
    job.skills ?? [];

  score +=
    countMatches(
      text,
      jobSkills
    ) * 5;

  return score;
}

function getExperienceScore(
  experience: ResumeExperience,
  matchedSkills: string[],
  job: Job
) {
  const text =
    [
      experience.role,
      experience.company,
      experience.description,
    ].join(' ');

  let score =
    countMatches(
      text,
      matchedSkills
    ) * 10;

  const titleWords =
    normalize(job.title)
      .split(' ')
      .filter(
        (word) =>
          word.length >= 5
      );

  score +=
    countMatches(
      text,
      titleWords
    ) * 5;

  return score;
}

function buildHeadline(
  job: Job,
  resume: ResumeProfile
) {
  /*
   * Keep the user's professional
   * headline exactly as written.
   *
   * Matching skills are already
   * prioritized in the Skills section,
   * so repeating them here makes the
   * resume look keyword-stuffed.
   */

  if (
    resume.headline.trim()
  ) {
    return resume.headline.trim();
  }

  return `${job.title} Candidate`;
}

function buildSummary(
  resume: ResumeProfile,
  job: Job,
  matchedSkills: string[]
) {
  /*
   * The user's own summary is always
   * preferred because it is factual
   * information they explicitly saved.
   */

  if (
    resume.summary.trim()
  ) {
    return resume.summary.trim();
  }

  if (
    matchedSkills.length > 0
  ) {
    const skills =
      matchedSkills
        .slice(0, 4)
        .join(', ');

    return (
      `Early-career software developer ` +
      `interested in ${job.title} opportunities, ` +
      `with hands-on experience using ${skills}.`
    );
  }

  return (
    `Early-career software developer ` +
    `interested in ${job.title} opportunities ` +
    `and continued professional growth.`
  );
}

export function generateTailoredResumeDraft(
  job: Job,
  resume: ResumeProfile
): TailoredResumeDraft {
  const match =
    analyzeResumeMatch(
      job,
      resume
    );

  /*
   * SKILLS
   *
   * Matching skills go first.
   * All remaining skills still come
   * directly from the Resume Profile.
   */

  const matchedNormalized =
    new Set(
      match.matchedSkills.map(
        normalize
      )
    );

  const matchingSkills =
    resume.skills.filter(
      (skill) =>
        matchedNormalized.has(
          normalize(skill)
        )
    );

  const remainingSkills =
    resume.skills.filter(
      (skill) =>
        !matchedNormalized.has(
          normalize(skill)
        )
    );

  const skills = [
    ...matchingSkills,
    ...remainingSkills,
  ];

  /*
   * PROJECTS
   *
   * Preserve all factual content.
   * Only change display order based
   * on relevance to the job.
   */

  const projects =
    resume.projects
      .map(
        (project) => ({
          id: project.id,

          name: project.name,

          description:
            project.description,

          technologies: [
            ...project.technologies,
          ],

          relevanceScore:
            getProjectScore(
              project,
              match.matchedSkills,
              job
            ),
        })
      )
      .sort(
        (a, b) =>
          b.relevanceScore -
          a.relevanceScore
      );

  /*
   * EXPERIENCE
   *
   * Preserve factual content and
   * prioritize relevant entries.
   */

  const experience =
    resume.experience
      .map(
        (item) => ({
          id: item.id,

          role: item.role,

          company: item.company,

          description:
            item.description,

          relevanceScore:
            getExperienceScore(
              item,
              match.matchedSkills,
              job
            ),
        })
      )
      .sort(
        (a, b) =>
          b.relevanceScore -
          a.relevanceScore
      );

  const warnings: string[] =
    [];

  if (
    !resume.name.trim()
  ) {
    warnings.push(
      'Add your name before using this draft.'
    );
  }

  if (
    resume.skills.length === 0
  ) {
    warnings.push(
      'Add your verified technical skills before using this draft.'
    );
  }

  if (
    resume.projects.length === 0
  ) {
    warnings.push(
      'No projects are currently available for this draft.'
    );
  }

  if (
    match.missingSkills.length >
    0
  ) {
    warnings.push(
      `These job-related skills were not added because they are not supported by your saved experience: ${match.missingSkills
        .slice(0, 6)
        .join(', ')}.`
    );
  }

  warnings.push(
    'Review every statement before using this draft in a real application.'
  );

  return {
    name:
      resume.name.trim(),

    targetRole:
      job.title,

    headline:
      buildHeadline(
        job,
        resume
      ),

    summary:
      buildSummary(
        resume,
        job,
        match.matchedSkills
      ),

    skills,

    experience,

    projects,

    education: [
      ...resume.education,
    ],

    warnings,
  };
}
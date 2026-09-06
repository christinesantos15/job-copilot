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
  resume: ResumeProfile,
  matchedSkills: string[]
) {
  /*
   * Preserve the user's existing
   * professional identity where
   * possible.
   */

  const base =
    resume.headline.trim() ||
    `${job.title} Candidate`;

  const topSkills =
    matchedSkills
      .slice(0, 3);

  if (
    topSkills.length === 0
  ) {
    return base;
  }

  return `${base} | ${topSkills.join(
    ' | '
  )}`;
}

function buildSummary(
  resume: ResumeProfile,
  job: Job,
  matchedSkills: string[]
) {
  /*
   * We deliberately preserve the
   * user's own summary rather than
   * inventing achievements.
   */

  if (resume.summary.trim()) {
    return resume.summary.trim();
  }

  if (
    matchedSkills.length > 0
  ) {
    return (
      `Candidate targeting ${job.title} roles ` +
      `with Resume Profile evidence in ${matchedSkills
        .slice(0, 4)
        .join(', ')}.`
    );
  }

  return (
    `Candidate targeting ${job.title} opportunities.`
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
   * Remaining real resume skills
   * stay afterward.
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
   * Keep original content.
   * Only change display order.
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
   * Same rule:
   * preserve factual content and
   * only prioritize relevant items.
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

  if (!resume.name.trim()) {
    warnings.push(
      'Add your name to Resume Profile before using this draft.'
    );
  }

  if (
    resume.skills.length === 0
  ) {
    warnings.push(
      'No skills are currently saved in Resume Profile.'
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
      `Not added to this resume because your Resume Profile does not currently support them: ${match.missingSkills
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
        resume,
        match.matchedSkills
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
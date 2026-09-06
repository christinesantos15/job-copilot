import {
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeProfile,
  ResumeProject,
  ResumeSkillGroup,
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

  location: string;

  startDate: string;

  endDate: string;

  description: string;

  bullets: string[];

  relevanceScore: number;
};

export type TailoredResumeProject = {
  id: string;

  name: string;

  description: string;

  technologies: string[];

  bullets: string[];

  link: string;

  relevanceScore: number;
};

export type TailoredResumeDraft = {
  name: string;

  targetRole: string;

  headline: string;

  summary: string;

  skills: string[];

  skillGroups:
    ResumeSkillGroup[];

  experience:
    TailoredResumeExperience[];

  projects:
    TailoredResumeProject[];

  education:
    ResumeEducation[];

  certifications:
    ResumeCertification[];

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

function uniqueStrings(
  values: string[]
) {
  const seen =
    new Set<string>();

  return values.filter(
    (value) => {
      const normalized =
        normalize(value);

      if (
        !normalized ||
        seen.has(normalized)
      ) {
        return false;
      }

      seen.add(normalized);

      return true;
    }
  );
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
      ...project.bullets,
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
      ...experience.bullets,
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

function getSkillGroupScore(
  group: ResumeSkillGroup,
  matchedSkills: string[]
) {
  return countMatches(
    [
      group.label,
      ...group.skills,
    ].join(' '),
    matchedSkills
  );
}

function buildHeadline(
  job: Job,
  resume: ResumeProfile
) {
  /*
   * Keep the user's factual professional
   * headline exactly as saved.
   *
   * We do not rewrite the user's identity
   * or claim a role they have not held.
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
   * Prefer the user's own professional
   * summary because it is verified
   * resume content.
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

function buildTailoredSkillGroups(
  resume: ResumeProfile,
  matchedSkills: string[]
) {
  /*
   * Preserve every user-created group.
   *
   * Groups containing matched job skills
   * appear first. Skills inside each group
   * are also reordered so matching skills
   * appear first.
   *
   * Nothing new is added.
   */

  const matchedNormalized =
    new Set(
      matchedSkills.map(
        normalize
      )
    );

  return resume.skillGroups
    .map(
      (group) => {
        const matching =
          group.skills.filter(
            (skill) =>
              matchedNormalized.has(
                normalize(skill)
              )
          );

        const remaining =
          group.skills.filter(
            (skill) =>
              !matchedNormalized.has(
                normalize(skill)
              )
          );

        return {
          ...group,

          skills:
            uniqueStrings([
              ...matching,
              ...remaining,
            ]),

          relevanceScore:
            getSkillGroupScore(
              group,
              matchedSkills
            ),
        };
      }
    )
    .sort(
      (a, b) =>
        b.relevanceScore -
        a.relevanceScore
    )
    .map(
      ({
        relevanceScore: _,
        ...group
      }) => group
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
   * Matching verified skills go first.
   * Remaining verified skills stay in
   * the resume.
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

  const skills =
    uniqueStrings([
      ...matchingSkills,
      ...remainingSkills,
    ]);

  const skillGroups =
    buildTailoredSkillGroups(
      resume,
      match.matchedSkills
    );

  /*
   * PROJECTS
   *
   * All factual project content is
   * preserved. Relevance changes only
   * the display order.
   */

  const projects =
    resume.projects
      .map(
        (project) => ({
          id:
            project.id,

          name:
            project.name,

          description:
            project.description,

          technologies: [
            ...project.technologies,
          ],

          bullets: [
            ...project.bullets,
          ],

          link:
            project.link,

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
   * Preserve employers, dates,
   * locations and factual bullets.
   * Relevance changes only order.
   */

  const experience =
    resume.experience
      .map(
        (item) => ({
          id:
            item.id,

          role:
            item.role,

          company:
            item.company,

          location:
            item.location,

          startDate:
            item.startDate,

          endDate:
            item.endDate,

          description:
            item.description,

          bullets: [
            ...item.bullets,
          ],

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
    resume.experience.some(
      (item) =>
        item.bullets.length === 0 &&
        item.description.trim()
    )
  ) {
    warnings.push(
      'Some experience entries still use the older paragraph description. Add factual achievement bullets when ready.'
    );
  }

  if (
    resume.projects.some(
      (item) =>
        item.bullets.length === 0 &&
        item.description.trim()
    )
  ) {
    warnings.push(
      'Some projects still use the older paragraph description. Add factual project bullets when ready.'
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

    skillGroups,

    experience,

    projects,

    education:
      resume.education.map(
        (item) => ({
          ...item,

          details: [
            ...item.details,
          ],
        })
      ),

    certifications:
      resume.certifications.map(
        (item) => ({
          ...item,
        })
      ),

    warnings,
  };
}
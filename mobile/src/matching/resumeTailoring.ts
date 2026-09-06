import {
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

export type TailoringPriority =
  | 'high'
  | 'medium'
  | 'low';

export type ResumeTailoringItem = {
  id: string;

  title: string;

  reason: string;

  priority: TailoringPriority;
};

export type ResumeGapItem = {
  skill: string;

  guidance: string;
};

export type ResumeTailoringAnalysis = {
  headlineSuggestion: string;

  skillsToEmphasize: string[];

  projectsToEmphasize:
    ResumeTailoringItem[];

  experienceToEmphasize:
    ResumeTailoringItem[];

  educationToKeep:
    ResumeTailoringItem[];

  rewordSuggestions: string[];

  gaps: ResumeGapItem[];

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

function getProjectText(
  project: ResumeProject
) {
  return normalize(
    [
      project.name,
      project.description,
      ...project.technologies,
    ].join(' ')
  );
}

function getExperienceText(
  experience: ResumeExperience
) {
  return normalize(
    [
      experience.role,
      experience.company,
      experience.description,
    ].join(' ')
  );
}

function calculateEvidenceMatches(
  text: string,
  skills: string[]
) {
  return skills.filter(
    (skill) =>
      containsTerm(
        text,
        skill
      )
  );
}

function getPriority(
  matchCount: number
): TailoringPriority {
  if (matchCount >= 3) {
    return 'high';
  }

  if (matchCount >= 1) {
    return 'medium';
  }

  return 'low';
}

function buildHeadlineSuggestion(
  job: Job,
  matchedSkills: string[]
) {
  const skills =
    matchedSkills
      .slice(0, 3)
      .join(' • ');

  if (skills) {
    return `${job.title} Candidate • ${skills}`;
  }

  return `${job.title} Candidate`;
}

export function analyzeResumeTailoring(
  job: Job,
  resume: ResumeProfile
): ResumeTailoringAnalysis {
  const match =
    analyzeResumeMatch(
      job,
      resume
    );

  const projectsToEmphasize =
    resume.projects
      .map((project) => {
        const projectText =
          getProjectText(
            project
          );

        const matches =
          calculateEvidenceMatches(
            projectText,
            match.matchedSkills
          );

        return {
          id: project.id,

          title: project.name,

          reason:
            matches.length > 0
              ? `Supports ${matches
                  .slice(0, 4)
                  .join(', ')}.`
              : 'No strong direct requirement match detected.',

          priority:
            getPriority(
              matches.length
            ),

          matchCount:
            matches.length,
        };
      })
      .filter(
        (item) =>
          item.matchCount > 0
      )
      .sort(
        (a, b) =>
          b.matchCount -
          a.matchCount
      )
      .map(
        ({
          matchCount,
          ...item
        }) => item
      );

  const experienceToEmphasize =
    resume.experience
      .map((experience) => {
        const experienceText =
          getExperienceText(
            experience
          );

        const matches =
          calculateEvidenceMatches(
            experienceText,
            match.matchedSkills
          );

        /*
         * Technical keywords are not
         * the only useful evidence.
         *
         * Basic role overlap can still
         * make an experience worth
         * emphasizing.
         */

        const jobTitleWords =
          normalize(job.title)
            .split(' ')
            .filter(
              (word) =>
                word.length >= 5
            );

        const roleOverlap =
          jobTitleWords.some(
            (word) =>
              experienceText.includes(
                word
              )
          );

        const evidenceCount =
          matches.length +
          (roleOverlap ? 1 : 0);

        const label = [
          experience.role,
          experience.company,
        ]
          .filter(Boolean)
          .join(' at ');

        return {
          id: experience.id,

          title:
            label ||
            'Previous experience',

          reason:
            matches.length > 0
              ? `Supports ${matches
                  .slice(0, 4)
                  .join(', ')}.`
              : roleOverlap
                ? 'The role has relevant title or responsibility overlap.'
                : 'No strong direct requirement match detected.',

          priority:
            getPriority(
              evidenceCount
            ),

          matchCount:
            evidenceCount,
        };
      })
      .filter(
        (item) =>
          item.matchCount > 0
      )
      .sort(
        (a, b) =>
          b.matchCount -
          a.matchCount
      )
      .map(
        ({
          matchCount,
          ...item
        }) => item
      );

  const educationToKeep =
    resume.education
      .map((education) => {
        const text =
          normalize(
            [
              education.qualification,
              education.school,
            ].join(' ')
          );

        const relevant =
          [
            'computer science',
            'software',
            'information technology',
            'information systems',
            'computer engineering',
            'computing',
          ].some(
            (term) =>
              text.includes(
                term
              )
          );

        return {
          id: education.id,

          title: [
            education.qualification,
            education.school,
          ]
            .filter(Boolean)
            .join(' — '),

          reason: relevant
            ? 'Supports your technical and academic background for this role.'
            : 'Keep if useful for education history, but it is not a major tailoring signal.',

          priority:
            relevant
              ? ('medium' as const)
              : ('low' as const),

          relevant,
        };
      })
      .filter(
        (item) =>
          item.relevant
      )
      .map(
        ({
          relevant,
          ...item
        }) => item
      );

  const rewordSuggestions:
    string[] = [];

  if (
    match.matchedSkills.length >
    0
  ) {
    rewordSuggestions.push(
      `Use the same truthful terminology as the listing where appropriate: ${match.matchedSkills
        .slice(0, 5)
        .join(', ')}.`
    );
  }

  if (
    projectsToEmphasize.length >
    0
  ) {
    rewordSuggestions.push(
      'Move your strongest relevant project higher and describe what you personally built, changed, measured, or delivered.'
    );
  }

  if (
    experienceToEmphasize.length >
    0
  ) {
    rewordSuggestions.push(
      'Describe relevant experience with concrete responsibilities and outcomes instead of generic duty statements.'
    );
  }

  rewordSuggestions.push(
    'Prefer action-led bullet points such as Built, Implemented, Designed, Tested, Improved, Automated, or Developed when they truthfully describe your work.'
  );

  rewordSuggestions.push(
    'Do not copy requirements from the job description into your resume unless your Resume Profile contains evidence that you actually have that skill or experience.'
  );

  const gaps =
    match.missingSkills.map(
      (skill) => ({
        skill,

        guidance:
          `Do not add ${skill} as a resume skill unless you can genuinely explain or demonstrate it. Treat it as an application or learning gap instead.`,
      })
    );

  const warnings: string[] =
    [];

  if (
    resume.skills.length === 0
  ) {
    warnings.push(
      'Your Resume Profile has no skills yet, so tailoring accuracy is limited.'
    );
  }

  if (
    resume.projects.length === 0
  ) {
    warnings.push(
      'No projects are saved in Resume Profile. Projects can be important evidence for junior software roles.'
    );
  }

  if (
    resume.experience.length ===
    0
  ) {
    warnings.push(
      'No experience is saved in Resume Profile.'
    );
  }

  if (
    match.missingSkills.length >
    0
  ) {
    warnings.push(
      'Missing skills are gaps, not suggestions to claim qualifications you do not have.'
    );
  }

  return {
    headlineSuggestion:
      buildHeadlineSuggestion(
        job,
        match.matchedSkills
      ),

    skillsToEmphasize:
      match.matchedSkills.slice(
        0,
        8
      ),

    projectsToEmphasize:
      projectsToEmphasize.slice(
        0,
        4
      ),

    experienceToEmphasize:
      experienceToEmphasize.slice(
        0,
        4
      ),

    educationToKeep:
      educationToKeep.slice(
        0,
        3
      ),

    rewordSuggestions,

    gaps: gaps.slice(0, 8),

    warnings,
  };
}
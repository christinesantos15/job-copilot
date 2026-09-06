import {
  ResumeProfile,
  ResumeProject,
  ResumeExperience,
} from '../profile/resumeProfile';

import {
  Job,
} from '../types/Job';

export type ResumeMatchLevel =
  | 'strong'
  | 'moderate'
  | 'developing'
  | 'weak';

export type ResumeMatchAnalysis = {
  score: number;

  level: ResumeMatchLevel;

  matchedSkills: string[];

  missingSkills: string[];

  relevantProjects: string[];

  relevantExperience: string[];

  educationMatch: boolean;

  summary: string;
};

const technologies = [
  'react',
  'react native',
  'next.js',
  'nextjs',
  'typescript',
  'javascript',
  'node.js',
  'nodejs',

  'python',
  'fastapi',
  'django',
  'flask',

  'java',
  'spring',
  'c++',
  'c#',
  'go',
  'golang',
  'rust',

  'swift',
  'kotlin',
  'flutter',

  'postgresql',
  'mysql',
  'mongodb',
  'redis',
  'sql',

  'graphql',
  'rest api',

  'docker',
  'kubernetes',
  'terraform',

  'aws',
  'azure',
  'gcp',

  'git',
  'linux',
  'ci/cd',

  'machine learning',
  'pytorch',
  'tensorflow',

  'figma',
  'html',
  'css',
];

const aliases: Record<
  string,
  string[]
> = {
  'next.js': [
    'next.js',
    'nextjs',
  ],

  'node.js': [
    'node.js',
    'nodejs',
  ],

  go: [
    'go',
    'golang',
  ],
};

function normalize(
  value?: string
) {
  return (value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(
  values: string[]
) {
  return Array.from(
    new Set(values)
  );
}

function canonicalTechnology(
  technology: string
) {
  return (
    Object.entries(
      aliases
    ).find(
      ([, values]) =>
        values.includes(
          technology
        )
    )?.[0] ??
    technology
  );
}

function hasTechnology(
  text: string,
  technology: string
) {
  const canonical =
    canonicalTechnology(
      technology
    );

  const candidates =
    aliases[canonical] ?? [
      canonical,
    ];

  return candidates.some(
    (candidate) =>
      text.includes(
        normalize(candidate)
      )
  );
}

function getJobText(
  job: Job
) {
  return normalize(
    [
      job.title,
      job.description,
      ...(job.skills ?? []),
    ].join(' ')
  );
}

function getResumeText(
  resume: ResumeProfile
) {
  const experience =
    resume.experience.map(
      (item) =>
        [
          item.role,
          item.company,
          item.description,
        ].join(' ')
    );

  const projects =
    resume.projects.map(
      (item) =>
        [
          item.name,
          item.description,
          ...item.technologies,
        ].join(' ')
    );

  const education =
    resume.education.map(
      (item) =>
        [
          item.school,
          item.qualification,
        ].join(' ')
    );

  return normalize(
    [
      resume.headline,
      resume.summary,
      ...resume.skills,
      ...experience,
      ...projects,
      ...education,
    ].join(' ')
  );
}

function detectJobTechnologies(
  jobText: string
) {
  const detected =
    technologies.filter(
      (technology) =>
        hasTechnology(
          jobText,
          technology
        )
    );

  return unique(
    detected.map(
      canonicalTechnology
    )
  );
}

function projectSupportsJob(
  project: ResumeProject,
  requiredSkills: string[]
) {
  const projectText =
    normalize(
      [
        project.name,
        project.description,
        ...project.technologies,
      ].join(' ')
    );

  return requiredSkills.some(
    (technology) =>
      hasTechnology(
        projectText,
        technology
      )
  );
}

function experienceSupportsJob(
  experience: ResumeExperience,
  requiredSkills: string[],
  job: Job
) {
  const experienceText =
    normalize(
      [
        experience.role,
        experience.company,
        experience.description,
      ].join(' ')
    );

  const skillMatch =
    requiredSkills.some(
      (technology) =>
        hasTechnology(
          experienceText,
          technology
        )
    );

  if (skillMatch) {
    return true;
  }

  /*
   * Basic role overlap.
   *
   * Ignore very small/common words.
   */

  const jobTitleWords =
    normalize(job.title)
      .split(' ')
      .filter(
        (word) =>
          word.length >= 5
      );

  return jobTitleWords.some(
    (word) =>
      experienceText.includes(
        word
      )
  );
}

function hasRelevantEducation(
  resume: ResumeProfile
) {
  const educationText =
    normalize(
      resume.education
        .map(
          (education) =>
            education.qualification
        )
        .join(' ')
    );

  const relevantTerms = [
    'computer science',
    'software',
    'information technology',
    'information systems',
    'computer engineering',
    'computing',
  ];

  return relevantTerms.some(
    (term) =>
      educationText.includes(
        term
      )
  );
}

function getLevel(
  score: number
): ResumeMatchLevel {
  if (score >= 80) {
    return 'strong';
  }

  if (score >= 60) {
    return 'moderate';
  }

  if (score >= 40) {
    return 'developing';
  }

  return 'weak';
}

function getSummary(
  score: number,
  matchedSkills: number,
  requiredSkills: number
) {
  if (requiredSkills === 0) {
    return (
      'The listing does not expose enough recognizable technical requirements for a detailed skill comparison.'
    );
  }

  if (score >= 80) {
    return (
      `Your resume provides strong evidence for this role, including ${matchedSkills} of ${requiredSkills} detected technical requirements.`
    );
  }

  if (score >= 60) {
    return (
      `Your resume supports several important parts of this role, but some requirements may need stronger evidence.`
    );
  }

  if (score >= 40) {
    return (
      `Your resume has some relevant evidence, but this application would benefit from stronger project, experience or skill alignment.`
    );
  }

  return (
    `Your current resume shows limited direct evidence for the detected requirements of this role.`
  );
}

export function analyzeResumeMatch(
  job: Job,
  resume: ResumeProfile
): ResumeMatchAnalysis {
  const jobText =
    getJobText(job);

  const resumeText =
    getResumeText(resume);

  const requiredSkills =
    detectJobTechnologies(
      jobText
    );

  const matchedSkills =
    requiredSkills.filter(
      (technology) =>
        hasTechnology(
          resumeText,
          technology
        )
    );

  const missingSkills =
    requiredSkills.filter(
      (technology) =>
        !hasTechnology(
          resumeText,
          technology
        )
    );

  const relevantProjects =
    resume.projects.filter(
      (project) =>
        projectSupportsJob(
          project,
          requiredSkills
        )
    );

  const relevantExperience =
    resume.experience.filter(
      (experience) =>
        experienceSupportsJob(
          experience,
          requiredSkills,
          job
        )
    );

  const educationMatch =
    hasRelevantEducation(
      resume
    );

  /*
   * SCORE MODEL V1
   *
   * Technical coverage = 70 points
   * Relevant projects = 15 points
   * Relevant experience = 10 points
   * Relevant education = 5 points
   *
   * Total = 100
   */

  let skillScore = 0;

  if (
    requiredSkills.length > 0
  ) {
    skillScore =
      (
        matchedSkills.length /
        requiredSkills.length
      ) * 70;
  }

  const projectScore =
    relevantProjects.length > 0
      ? 15
      : 0;

  const experienceScore =
    relevantExperience.length > 0
      ? 10
      : 0;

  const educationScore =
    educationMatch
      ? 5
      : 0;

  let score =
    Math.round(
      skillScore +
      projectScore +
      experienceScore +
      educationScore
    );

  /*
   * If the listing exposes no
   * recognizable technologies,
   * don't automatically punish
   * the resume with a near-zero
   * score.
   *
   * Evidence becomes the basis
   * for a conservative V1 score.
   */

  if (
    requiredSkills.length === 0
  ) {
    score = 30;

    if (
      relevantProjects.length >
      0
    ) {
      score += 30;
    }

    if (
      relevantExperience.length >
      0
    ) {
      score += 25;
    }

    if (educationMatch) {
      score += 15;
    }
  }

  score =
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );

  return {
    score,

    level:
      getLevel(score),

    matchedSkills,

    missingSkills,

    relevantProjects:
      relevantProjects.map(
        (project) =>
          project.name
      ),

    relevantExperience:
      relevantExperience.map(
        (experience) =>
          [
            experience.role,
            experience.company,
          ]
            .filter(Boolean)
            .join(' at ')
      ),

    educationMatch,

    summary:
      getSummary(
        score,
        matchedSkills.length,
        requiredSkills.length
      ),
  };
}
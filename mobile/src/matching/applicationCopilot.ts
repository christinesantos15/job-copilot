import {
  JobProfile,
} from '../profile/jobProfile';

import {
  ResumeProfile,
  ResumeProject,
  ResumeExperience,
} from '../profile/resumeProfile';

import {
  Job,
} from '../types/Job';

export type ApplicationCopilotResult = {
  strengths: string[];

  evidence: string[];

  gaps: string[];

  emphasize: string[];

  interviewQuestions: string[];

  checklist: string[];
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
  return text.includes(
    normalize(term)
  );
}

function includesAny(
  text: string,
  values: string[]
) {
  return values.some(
    (value) =>
      containsTerm(
        text,
        value
      )
  );
}

function unique(
  values: string[]
) {
  return Array.from(
    new Set(values)
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
  const experienceText =
    resume.experience
      .map(
        (experience) =>
          [
            experience.role,
            experience.company,
            experience.description,
          ].join(' ')
      )
      .join(' ');

  const projectText =
    resume.projects
      .map(
        (project) =>
          [
            project.name,
            project.description,
            ...project.technologies,
          ].join(' ')
      )
      .join(' ');

  const educationText =
    resume.education
      .map(
        (education) =>
          [
            education.school,
            education.qualification,
          ].join(' ')
      )
      .join(' ');

  return normalize(
    [
      resume.headline,
      resume.summary,
      ...resume.skills,
      experienceText,
      projectText,
      educationText,
    ].join(' ')
  );
}

function projectMatchesJob(
  project: ResumeProject,
  jobText: string
) {
  const projectTerms = [
    project.name,
    ...project.technologies,
  ]
    .map(normalize)
    .filter(
      (term) =>
        term.length >= 3
    );

  return projectTerms.some(
    (term) =>
      jobText.includes(term)
  );
}

function experienceMatchesJob(
  experience: ResumeExperience,
  jobText: string
) {
  const role =
    normalize(
      experience.role
    );

  if (
    role.length >= 3 &&
    jobText.includes(role)
  ) {
    return true;
  }

  const words =
    normalize(
      experience.description
    )
      .split(' ')
      .filter(
        (word) =>
          word.length >= 5
      );

  return words.some(
    (word) =>
      jobText.includes(word)
  );
}

export function generateApplicationCopilot(
  job: Job,
  preferences: JobProfile,
  resume: ResumeProfile
): ApplicationCopilotResult {
  const strengths: string[] = [];

  const evidence: string[] = [];

  const gaps: string[] = [];

  const emphasize: string[] = [];

  const jobText =
    getJobText(job);

  const resumeText =
    getResumeText(resume);

  const jobTitle =
    normalize(job.title);

  const jobLocation =
    normalize(job.location);

  /*
   * MATCH SCORE
   */

  if (
    job.matchScore !== undefined &&
    job.matchScore >= 70
  ) {
    strengths.push(
      `Strong overall job-preference match (${job.matchScore}%).`
    );
  } else if (
    job.matchScore !== undefined &&
    job.matchScore >= 50
  ) {
    strengths.push(
      `Solid job-preference match (${job.matchScore}%).`
    );
  }

  /*
   * PREFERENCE ALIGNMENT
   *
   * Preferences tell us what the
   * user wants, not what they can
   * necessarily prove on a resume.
   */

  const matchedLocation =
    preferences.preferredLocations.find(
      (location) =>
        jobLocation.includes(
          normalize(location)
        )
    );

  if (matchedLocation) {
    strengths.push(
      `${job.location} aligns with your preferred location.`
    );
  }

  const matchedRole =
    preferences.targetRoles.find(
      (role) =>
        jobTitle.includes(
          normalize(role)
        )
    );

  if (matchedRole) {
    strengths.push(
      `This position aligns with your ${matchedRole} target.`
    );
  }

  const matchedLevel =
    preferences.preferredLevels.find(
      (level) =>
        jobTitle.includes(
          normalize(level)
        )
    );

  if (matchedLevel) {
    strengths.push(
      `The ${matchedLevel} level aligns with your preferred experience level.`
    );
  }

  /*
   * RESUME SKILLS
   *
   * These ARE evidence because they
   * come from Resume Profile.
   */

  const resumeSkills =
    unique(
      resume.skills
        .map(normalize)
        .filter(Boolean)
    );

  const matchedResumeSkills =
    resumeSkills.filter(
      (skill) =>
        jobText.includes(skill)
    );

  matchedResumeSkills
    .slice(0, 6)
    .forEach(
      (skill) => {
        strengths.push(
          `${skill} is listed in your resume and appears relevant to this role.`
        );
      }
    );

  /*
   * PROJECT EVIDENCE
   */

  const relevantProjects =
    resume.projects.filter(
      (project) =>
        projectMatchesJob(
          project,
          jobText
        )
    );

  relevantProjects
    .slice(0, 3)
    .forEach(
      (project) => {
        evidence.push(
          `${project.name}: use this project as evidence of relevant technical experience.`
        );

        emphasize.push(
          `Explain ${project.name}, what you built, your contribution, and the technical decisions you made.`
        );
      }
    );

  /*
   * EXPERIENCE EVIDENCE
   */

  const relevantExperience =
    resume.experience.filter(
      (experience) =>
        experienceMatchesJob(
          experience,
          jobText
        )
    );

  relevantExperience
    .slice(0, 3)
    .forEach(
      (experience) => {
        const label =
          [
            experience.role,
            experience.company,
          ]
            .filter(Boolean)
            .join(' at ');

        evidence.push(
          `${label || 'Your experience'} contains transferable experience for this listing.`
        );

        emphasize.push(
          `Connect your ${label || 'previous experience'} to the responsibilities in this role.`
        );
      }
    );

  /*
   * EDUCATION
   */

  resume.education
    .slice(0, 2)
    .forEach(
      (education) => {
        const qualification =
          normalize(
            education.qualification
          );

        if (
          qualification.includes(
            'computer'
          ) ||
          qualification.includes(
            'software'
          ) ||
          qualification.includes(
            'information technology'
          )
        ) {
          evidence.push(
            `${education.qualification} from ${education.school} supports your technical background.`
          );
        }
      }
    );

  /*
   * TECHNOLOGY GAP DETECTION
   *
   * A job technology is considered
   * supported only when it appears
   * somewhere in Resume Profile.
   */

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

  const detectedTechnologies =
    technologies.filter(
      (technology) =>
        containsTerm(
          jobText,
          technology
        )
    );

  const uniqueTechnologies =
    detectedTechnologies.filter(
      (
        technology,
        index,
        array
      ) => {
        const canonical =
          canonicalTechnology(
            technology
          );

        return (
          array.findIndex(
            (candidate) =>
              canonicalTechnology(
                candidate
              ) === canonical
          ) === index
        );
      }
    );

  for (
    const technology of
    uniqueTechnologies
  ) {
    const canonical =
      canonicalTechnology(
        technology
      );

    const aliasesForTechnology =
      aliases[canonical] ?? [
        canonical,
      ];

    const resumeSupports =
      aliasesForTechnology.some(
        (alias) =>
          containsTerm(
            resumeText,
            alias
          )
      );

    if (!resumeSupports) {
      gaps.push(
        `${canonical} appears in the listing but is not currently supported by your Resume Profile.`
      );
    }
  }

  /*
   * SENIORITY
   */

  if (
    includesAny(
      jobTitle,
      preferences.seniorLevels
    )
  ) {
    gaps.push(
      'This role may expect more senior-level experience than your current target.'
    );
  }

  /*
   * SPECIALIZATION
   */

  const unrelatedSpecialization =
    preferences
      .unrelatedSpecializations
      .find(
        (specialization) =>
          containsTerm(
            jobText,
            specialization
          )
      );

  if (
    unrelatedSpecialization
  ) {
    gaps.push(
      `The listing includes ${unrelatedSpecialization}, which is outside your current target specialization.`
    );
  }

  /*
   * WHAT TO EMPHASIZE
   */

  if (
    matchedResumeSkills.length >
    0
  ) {
    emphasize.unshift(
      `Lead with your matching skills: ${matchedResumeSkills
        .slice(0, 5)
        .join(', ')}.`
    );
  }

  if (
    relevantProjects.length ===
      0 &&
    resume.projects.length > 0
  ) {
    emphasize.push(
      'Choose the project that best demonstrates problem solving, software design, and your ability to learn new technologies.'
    );
  }

  if (
    relevantExperience.length ===
      0 &&
    resume.experience.length > 0
  ) {
    emphasize.push(
      'Frame previous work experience around transferable skills such as teamwork, communication, responsibility, and problem solving.'
    );
  }

  if (
    emphasize.length === 0
  ) {
    emphasize.push(
      'Complete more of your Resume Profile so Job Copilot can identify specific evidence to emphasize.'
    );
  }

  /*
   * EMPTY RESUME
   */

  const hasResumeContent =
    resume.skills.length > 0 ||
    resume.projects.length > 0 ||
    resume.experience.length > 0 ||
    resume.education.length > 0;

  if (!hasResumeContent) {
    gaps.unshift(
      'Your Resume Profile is empty. Add your actual skills, projects, experience, and education for more accurate analysis.'
    );
  }

  if (gaps.length === 0) {
    gaps.push(
      'No obvious technical gap was detected from the available listing and your Resume Profile.'
    );
  }

  if (evidence.length === 0) {
    evidence.push(
      'No strong project, experience, or education evidence was automatically detected for this listing yet.'
    );
  }

  /*
   * INTERVIEW QUESTIONS
   */

  const interviewQuestions: string[] =
    [
      `Why are you interested in the ${job.title} role at ${job.company}?`,

      'Which experience or project best demonstrates that you can succeed in this role?',

      'Describe a difficult technical problem you encountered and how you approached it.',
    ];

  if (
    relevantProjects.length > 0
  ) {
    interviewQuestions.push(
      `Walk me through ${relevantProjects[0].name}. What did you personally build and what would you improve?`
    );
  }

  if (
    matchedResumeSkills.includes(
      'react'
    ) ||
    matchedResumeSkills.includes(
      'react native'
    )
  ) {
    interviewQuestions.push(
      'How do you structure React components and manage application state?'
    );
  }

  if (
    matchedResumeSkills.includes(
      'typescript'
    )
  ) {
    interviewQuestions.push(
      'Why would you use TypeScript instead of plain JavaScript in a production application?'
    );
  }

  if (
    matchedResumeSkills.includes(
      'python'
    )
  ) {
    interviewQuestions.push(
      'Walk me through a Python project you built and the technical decisions you made.'
    );
  }

  if (
    matchedResumeSkills.includes(
      'postgresql'
    ) ||
    matchedResumeSkills.includes(
      'sql'
    )
  ) {
    interviewQuestions.push(
      'How have you designed or queried a relational database in one of your projects?'
    );
  }

  if (
    matchedResumeSkills.includes(
      'docker'
    )
  ) {
    interviewQuestions.push(
      'How have you used Docker in development or deployment?'
    );
  }

  /*
   * CHECKLIST
   */

  const checklist = [
    'Read the complete job description again.',

    'Compare the listing against your Resume Profile.',

    'Tailor your resume around supported skills and evidence.',

    'Do not claim technologies you cannot explain or demonstrate.',

    'Choose 2–3 experiences or projects you can discuss clearly.',

    `Research ${job.company} and its products.`,

    'Prepare answers for the interview questions above.',

    'Review the gaps identified by Application Copilot.',

    'Verify the original listing is still active.',

    'Apply and update your application status in Job Copilot.',

    'Set a follow-up date after applying.',
  ];

  return {
    strengths:
      unique(strengths)
        .slice(0, 7),

    evidence:
      unique(evidence)
        .slice(0, 6),

    gaps:
      unique(gaps)
        .slice(0, 6),

    emphasize:
      unique(emphasize)
        .slice(0, 6),

    interviewQuestions:
      unique(
        interviewQuestions
      ).slice(0, 6),

    checklist,
  };
}
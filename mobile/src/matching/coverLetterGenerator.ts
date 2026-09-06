import {
  ResumeProfile,
  ResumeProject,
} from '../profile/resumeProfile';

import {
  JobProfile,
} from '../profile/jobProfile';

import {
  Job,
} from '../types/Job';

import {
  analyzeResumeMatch,
} from './resumeMatchAnalysis';

export type CoverLetterDraft = {
  opening: string;
  body: string[];
  closing: string;
  fullText: string;
  warnings: string[];
};

function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

function formatTechnology(
  value: string
) {
  const normalized =
    normalize(value);

  const knownNames:
    Record<string, string> = {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      java: 'Java',
      python: 'Python',
      react: 'React',
      'react native':
        'React Native',
      reactnative:
        'React Native',
      'next.js': 'Next.js',
      nextjs: 'Next.js',
      expo: 'Expo',
      fastapi: 'FastAPI',
      flask: 'Flask',
      django: 'Django',
      postgresql:
        'PostgreSQL',
      postgres: 'PostgreSQL',
      mysql: 'MySQL',
      mongodb: 'MongoDB',
      redis: 'Redis',
      docker: 'Docker',
      kubernetes:
        'Kubernetes',
      terraform: 'Terraform',
      aws: 'AWS',
      azure: 'Azure',
      gcp: 'GCP',
      git: 'Git',
      github: 'GitHub',
      html: 'HTML',
      css: 'CSS',
      figma: 'Figma',
      tensorflow:
        'TensorFlow',
      keras: 'Keras',
      pytorch: 'PyTorch',
      graphql: 'GraphQL',
      'rest api': 'REST API',
      sql: 'SQL',
      'c++': 'C++',
      'c#': 'C#',
      go: 'Go',
      golang: 'Go',
      rust: 'Rust',
      swift: 'Swift',
      kotlin: 'Kotlin',
      flutter: 'Flutter',
      linux: 'Linux',
    };

  return (
    knownNames[normalized] ??
    value.trim()
  );
}

function splitTechnologyValues(
  values: string[]
) {
  const result: string[] =
    [];

  for (const value of values) {
    const pieces =
      value
        .split(
          /[\n,;|•]+/
        )
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);

    for (const piece of pieces) {
      const formatted =
        formatTechnology(
          piece
        );

      const exists =
        result.some(
          (item) =>
            normalize(item) ===
            normalize(
              formatted
            )
        );

      if (!exists) {
        result.push(
          formatted
        );
      }
    }
  }

  return result;
}

function joinNatural(
  values: string[]
) {
  if (
    values.length === 0
  ) {
    return '';
  }

  if (
    values.length === 1
  ) {
    return values[0];
  }

  if (
    values.length === 2
  ) {
    return (
      `${values[0]} and ` +
      `${values[1]}`
    );
  }

  return (
    `${values
      .slice(0, -1)
      .join(', ')}, and ` +
    `${values[
      values.length - 1
    ]}`
  );
}

function findRelevantProject(
  job: Job,
  resume: ResumeProfile
): ResumeProject | undefined {
  const analysis =
    analyzeResumeMatch(
      job,
      resume
    );

  if (
    analysis
      .relevantProjects
      .length === 0
  ) {
    return undefined;
  }

  const relevantName =
    analysis
      .relevantProjects[0];

  return resume.projects.find(
    (item) =>
      normalize(
        item.name
      ) ===
      normalize(
        relevantName
      )
  );
}

function buildOpening(
  job: Job
) {
  return (
    `Dear Hiring Team,\n\n` +
    `I am writing to apply for the ` +
    `${job.title} position at ` +
    `${job.company}. ` +
    `I am particularly interested in ` +
    `the opportunity to contribute to ` +
    `real software products while ` +
    `continuing to grow as a developer.`
  );
}

function buildSkillsParagraph(
  job: Job,
  resume: ResumeProfile
) {
  const analysis =
    analyzeResumeMatch(
      job,
      resume
    );

  const matchedSkills =
    splitTechnologyValues(
      analysis.matchedSkills
    ).slice(
      0,
      5
    );

  if (
    matchedSkills.length === 0
  ) {
    const fallbackSkills =
      splitTechnologyValues(
        resume.skills
      ).slice(
        0,
        4
      );

    if (
      fallbackSkills.length ===
      0
    ) {
      return '';
    }

    return (
      `My technical background includes ` +
      `${joinNatural(
        fallbackSkills
      )}. Through academic work and ` +
      `software projects, I have been ` +
      `building practical experience ` +
      `with these technologies.`
    );
  }

  return (
    `My technical background includes ` +
    `${joinNatural(
      matchedSkills
    )}, which are relevant to this ` +
    `opportunity. I have developed ` +
    `practical experience with these ` +
    `technologies through academic ` +
    `work and software projects.`
  );
}

function buildProjectParagraph(
  job: Job,
  resume: ResumeProfile
) {
  const project =
    findRelevantProject(
      job,
      resume
    );

  if (!project) {
    return '';
  }

  const technologies =
    splitTechnologyValues(
      project.technologies
    ).slice(
      0,
      5
    );

  const technologyText =
    technologies.length > 0
      ? (
          `, a project built with ` +
          `${joinNatural(
            technologies
          )}`
        )
      : '';

  const description =
    project.description
      .trim();

  if (!description) {
    return (
      `One project I would highlight ` +
      `is ${project.name}` +
      `${technologyText}.`
    );
  }

  return (
    `One project I would highlight ` +
    `is ${project.name}` +
    `${technologyText}. ` +
    `${description}`
  );
}

function buildExperienceParagraph(
  job: Job,
  resume: ResumeProfile
) {
  const analysis =
    analyzeResumeMatch(
      job,
      resume
    );

  if (
    analysis
      .relevantExperience
      .length === 0
  ) {
    return '';
  }

  const relevantRole =
    analysis
      .relevantExperience[0];

  const experience =
    resume.experience.find(
      (item) =>
        normalize(
          item.role
        ) ===
        normalize(
          relevantRole
        )
    );

  if (!experience) {
    return '';
  }

  const company =
    experience.company
      .trim();

  const description =
    experience.description
      .trim();

  const companyText =
    company
      ? ` at ${company}`
      : '';

  if (!description) {
    return (
      `My experience as ` +
      `${experience.role}` +
      `${companyText} has also ` +
      `given me practical experience ` +
      `working in a professional ` +
      `environment.`
    );
  }

  return (
    `In my experience as ` +
    `${experience.role}` +
    `${companyText}, ` +
    `${description}`
  );
}

function buildEducationParagraph(
  resume: ResumeProfile
) {
  if (
    resume.education.length ===
    0
  ) {
    return '';
  }

  const education =
    resume.education[0];

  const school =
    education.school.trim();

  const qualification =
    education.qualification
      .trim();

  if (
    !school &&
    !qualification
  ) {
    return '';
  }

  if (
    school &&
    qualification
  ) {
    return (
      `My ${qualification} studies ` +
      `at ${school} have provided ` +
      `a foundation in software ` +
      `development and computer ` +
      `science fundamentals.`
    );
  }

  if (qualification) {
    return (
      `My ${qualification} studies ` +
      `have provided a foundation ` +
      `in software development and ` +
      `computer science fundamentals.`
    );
  }

  return '';
}

function buildMotivationParagraph(
  job: Job,
  preferences: JobProfile
) {
  const title =
    normalize(
      job.title
    );

  const preferredRole =
    preferences.targetRoles.some(
      (role) =>
        title.includes(
          normalize(role)
        )
    );

  if (preferredRole) {
    return (
      `This role closely aligns with ` +
      `the software engineering work ` +
      `I am pursuing. I would value ` +
      `the opportunity to contribute ` +
      `to ${job.company} while ` +
      `continuing to strengthen my ` +
      `technical and professional ` +
      `experience.`
    );
  }

  return (
    `I would value the opportunity ` +
    `to contribute to ${job.company} ` +
    `while continuing to strengthen ` +
    `my technical and professional ` +
    `experience.`
  );
}

function buildClosing(
  job: Job,
  resume: ResumeProfile
) {
  const name =
    resume.name.trim();

  const signature =
    name
      ? (
          `Sincerely,\n` +
          `${name}`
        )
      : 'Sincerely';

  return (
    `Thank you for considering my ` +
    `application. I would welcome ` +
    `the opportunity to discuss how ` +
    `my skills, projects, and ` +
    `experience could contribute to ` +
    `${job.company}.\n\n` +
    signature
  );
}

export function generateCoverLetter(
  job: Job,
  resume: ResumeProfile,
  preferences: JobProfile
): CoverLetterDraft {
  const warnings: string[] =
    [];

  if (
    !resume.name.trim()
  ) {
    warnings.push(
      'Add your name before using this cover letter.'
    );
  }

  if (
    resume.skills.length ===
    0
  ) {
    warnings.push(
      'Add your verified technical skills before using this cover letter.'
    );
  }

  if (
    resume.projects.length ===
      0 &&
    resume.experience.length ===
      0
  ) {
    warnings.push(
      'Add project or experience evidence before using this cover letter.'
    );
  }

  const opening =
    buildOpening(
      job
    );

  const body = [
    buildSkillsParagraph(
      job,
      resume
    ),

    buildProjectParagraph(
      job,
      resume
    ),

    buildExperienceParagraph(
      job,
      resume
    ),

    buildEducationParagraph(
      resume
    ),

    buildMotivationParagraph(
      job,
      preferences
    ),
  ].filter(
    (paragraph) =>
      paragraph
        .trim()
        .length > 0
  );

  const closing =
    buildClosing(
      job,
      resume
    );

  warnings.push(
    'Review and personalize this draft before sending it to an employer.'
  );

  warnings.push(
    'Do not add technologies, achievements, responsibilities, metrics, or qualifications that you cannot support with your actual experience.'
  );

  return {
    opening,

    body,

    closing,

    fullText: [
      opening,
      ...body,
      closing,
    ].join(
      '\n\n'
    ),

    warnings,
  };
}
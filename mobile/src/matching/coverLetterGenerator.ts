import {
  ResumeProfile,
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

function joinNatural(
  values: string[]
) {
  if (values.length === 0) {
    return '';
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values
    .slice(0, -1)
    .join(', ')}, and ${
    values[
      values.length - 1
    ]
  }`;
}

function buildOpening(
  job: Job,
  resume: ResumeProfile
) {
  const name =
    resume.name.trim();

  const applicantReference =
    name
      ? `My name is ${name}, and I am`
      : 'I am';

  return (
    `Dear Hiring Team,\n\n` +
    `${applicantReference} writing to apply for the ${job.title} position at ${job.company}. ` +
    `The role caught my attention because it aligns with my interest in building practical software products and continuing to grow as a developer.`
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
    analysis.matchedSkills
      .slice(0, 5);

  if (
    matchedSkills.length === 0
  ) {
    if (
      resume.skills.length === 0
    ) {
      return '';
    }

    const fallbackSkills =
      resume.skills.slice(
        0,
        4
      );

    return (
      `My current technical background includes ${joinNatural(
        fallbackSkills
      )}. I am continuing to strengthen these skills through hands-on development and project work.`
    );
  }

  return (
    `My Resume Profile shows experience with ${joinNatural(
      matchedSkills
    )}, which are relevant to this opportunity. I have been developing these skills through academic work, personal projects, and practical software development.`
  );
}

function buildProjectParagraph(
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
      .relevantProjects
      .length === 0
  ) {
    return '';
  }

  const relevantName =
    analysis
      .relevantProjects[0];

  const project =
    resume.projects.find(
      (item) =>
        normalize(
          item.name
        ) ===
        normalize(
          relevantName
        )
    );

  if (!project) {
    return '';
  }

  const technologies =
    project.technologies
      .slice(0, 5);

  const technologyText =
    technologies.length > 0
      ? ` using ${joinNatural(
          technologies
        )}`
      : '';

  return (
    `One project I would particularly highlight is ${project.name}${technologyText}. ${project.description.trim()}`
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

  const description =
    experience.description
      .trim();

  const companyText =
    experience.company.trim()
      ? ` at ${experience.company.trim()}`
      : '';

  if (!description) {
    return (
      `My experience as ${experience.role}${companyText} has also helped me build practical workplace experience that I can bring into this role.`
    );
  }

  return (
    `My experience as ${experience.role}${companyText} also strengthened my practical workplace skills. ${description}`
  );
}

function buildEducationParagraph(
  resume: ResumeProfile
) {
  if (
    resume.education.length === 0
  ) {
    return '';
  }

  const education =
    resume.education[0];

  if (
    !education.school.trim() &&
    !education.qualification.trim()
  ) {
    return '';
  }

  if (
    education.school.trim() &&
    education.qualification.trim()
  ) {
    return (
      `I also bring an academic foundation from ${education.qualification.trim()} at ${education.school.trim()}, which has supported my development in software and computer science fundamentals.`
    );
  }

  if (
    education.qualification.trim()
  ) {
    return (
      `My academic background in ${education.qualification.trim()} has also supported my development in software and computer science fundamentals.`
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
          normalize(
            role
          )
        )
    );

  if (preferredRole) {
    return (
      `This position is closely aligned with the type of role I am actively pursuing, and I would value the opportunity to contribute while continuing to grow within a professional engineering environment.`
    );
  }

  return (
    `I am interested in this opportunity because it offers a chance to contribute to real products while continuing to strengthen my technical and professional experience.`
  );
}

function buildClosing(
  job: Job
) {
  return (
    `Thank you for considering my application. I would welcome the opportunity to discuss how my current skills, projects, and experience could contribute to ${job.company}.\n\n` +
    `Sincerely`
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
      'Your Resume Profile does not currently include your name.'
    );
  }

  if (
    resume.skills.length ===
    0
  ) {
    warnings.push(
      'Your Resume Profile has no saved skills.'
    );
  }

  if (
    resume.projects.length ===
      0 &&
    resume.experience.length ===
      0
  ) {
    warnings.push(
      'Your Resume Profile has no project or experience evidence to highlight.'
    );
  }

  const opening =
    buildOpening(
      job,
      resume
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
      paragraph.trim()
        .length > 0
  );

  const closing =
    buildClosing(
      job
    );

  warnings.push(
    'Review the draft before using it in a real application.'
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
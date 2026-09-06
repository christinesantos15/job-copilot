import { Job } from '../types/Job';

export type ApplicationCopilotResult = {
  strengths: string[];
  gaps: string[];
  interviewQuestions: string[];
  checklist: string[];
};

const profileSkills = [
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

function normalize(value?: string) {
  return (value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function hasSkill(
  text: string,
  skill: string
) {
  return text.includes(
    skill.toLowerCase()
  );
}

export function generateApplicationCopilot(
  job: Job
): ApplicationCopilotResult {
  const strengths: string[] = [];
  const gaps: string[] = [];

  const jobText = normalize(
    [
      job.title,
      job.description,
      ...(job.skills ?? []),
    ].join(' ')
  );

  /*
   * MATCH STRENGTHS
   */

  if (
    job.matchScore !== undefined &&
    job.matchScore >= 70
  ) {
    strengths.push(
      `Strong overall profile match (${job.matchScore}%).`
    );
  } else if (
    job.matchScore !== undefined &&
    job.matchScore >= 50
  ) {
    strengths.push(
      `Your profile has a solid ${job.matchScore}% match with this role.`
    );
  }

  if (
    normalize(job.location).includes(
      'singapore'
    )
  ) {
    strengths.push(
      'Location aligns with your Singapore job search.'
    );
  }

  const matchedSkills =
    profileSkills.filter((skill) =>
      hasSkill(jobText, skill)
    );

  matchedSkills
    .slice(0, 5)
    .forEach((skill) => {
      strengths.push(
        `${skill} appears relevant to this role.`
      );
    });

  /*
   * EXISTING MATCHER REASONS
   */

  for (
    const reason of
    job.matchReasons ?? []
  ) {
    if (
      strengths.length >= 7
    ) {
      break;
    }

    if (
      !strengths.some(
        (item) =>
          normalize(item) ===
          normalize(reason)
      )
    ) {
      strengths.push(reason);
    }
  }

  if (strengths.length === 0) {
    strengths.push(
      'Your background has some transferable skills worth highlighting.'
    );
  }

  /*
   * SKILL GAPS
   *
   * For V1 we only flag technologies
   * clearly present in the listing that
   * are outside the current known
   * profile skill set.
   */

  const technologies = [
    'aws',
    'azure',
    'gcp',
    'kubernetes',
    'terraform',
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
    'django',
    'flask',
    'mongodb',
    'redis',
    'graphql',
    'machine learning',
    'pytorch',
    'tensorflow',
  ];

  const possibleGaps =
    technologies.filter(
      (technology) =>
        hasSkill(
          jobText,
          technology
        ) &&
        !profileSkills.includes(
          technology
        )
    );

  possibleGaps
    .slice(0, 5)
    .forEach((skill) => {
      gaps.push(
        `Review ${skill} before applying or interviewing.`
      );
    });

  const seniorTerms = [
    'senior',
    'staff',
    'principal',
    'lead',
    'manager',
  ];

  if (
    seniorTerms.some((term) =>
      normalize(job.title).includes(
        term
      )
    )
  ) {
    gaps.push(
      'This role may expect more senior-level experience.'
    );
  }

  if (gaps.length === 0) {
    gaps.push(
      'No obvious technical gap detected from the available listing data.'
    );
  }

  /*
   * INTERVIEW QUESTIONS
   */

  const interviewQuestions: string[] =
    [
      `Why are you interested in the ${job.title} role at ${job.company}?`,
      'Tell me about a project that best demonstrates your software development skills.',
      'Describe a technical problem you struggled with and how you solved it.',
    ];

  if (
    matchedSkills.includes(
      'react'
    ) ||
    matchedSkills.includes(
      'react native'
    )
  ) {
    interviewQuestions.push(
      'How do you structure React components and manage application state?'
    );
  }

  if (
    matchedSkills.includes(
      'typescript'
    )
  ) {
    interviewQuestions.push(
      'Why would you use TypeScript instead of plain JavaScript in a production project?'
    );
  }

  if (
    matchedSkills.includes(
      'python'
    )
  ) {
    interviewQuestions.push(
      'Walk me through a Python project you built and the technical decisions you made.'
    );
  }

  if (
    matchedSkills.includes(
      'postgresql'
    ) ||
    matchedSkills.includes(
      'sql'
    )
  ) {
    interviewQuestions.push(
      'How have you designed or queried a relational database in one of your projects?'
    );
  }

  if (
    matchedSkills.includes(
      'rest api'
    ) ||
    jobText.includes('api')
  ) {
    interviewQuestions.push(
      'Explain how you would design and consume a REST API.'
    );
  }

  return {
    strengths:
      strengths.slice(0, 6),

    gaps:
      gaps.slice(0, 5),

    interviewQuestions:
      interviewQuestions.slice(
        0,
        6
      ),

    checklist: [
      'Read the full job description again.',
      'Tailor your resume to the strongest matching requirements.',
      'Choose 2–3 projects or experiences you can explain clearly.',
      `Research ${job.company} and its products.`,
      'Prepare answers for the interview questions above.',
      'Open the original listing and verify it is still active.',
      'Apply and update the application status in Job Copilot.',
      'Set a follow-up date after applying.',
    ],
  };
}
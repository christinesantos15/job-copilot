import { Job } from '../types/Job';

import {
  JobProfile,
} from '../profile/jobProfile';

export type ApplicationCopilotResult = {
  strengths: string[];
  gaps: string[];
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

function hasSkill(
  text: string,
  skill: string
) {
  return text.includes(
    normalize(skill)
  );
}

function includesAny(
  text: string,
  values: string[]
) {
  return values.some(
    (value) =>
      text.includes(
        normalize(value)
      )
  );
}

export function generateApplicationCopilot(
  job: Job,
  profile: JobProfile
): ApplicationCopilotResult {
  const strengths: string[] = [];
  const gaps: string[] = [];

  /*
   * NORMALIZED PROFILE
   */

  const profileSkills =
    profile.preferredSkills.map(
      (skill) =>
        normalize(skill)
    );

  const jobTitle =
    normalize(job.title);

  const jobLocation =
    normalize(job.location);

  const jobText =
    normalize(
      [
        job.title,
        job.description,
        ...(job.skills ?? []),
      ].join(' ')
    );

  /*
   * OVERALL MATCH
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
  } else if (
    job.matchScore !== undefined
  ) {
    strengths.push(
      `Current profile match: ${job.matchScore}%. Focus on the strongest matching requirements when applying.`
    );
  }

  /*
   * LOCATION MATCH
   */

  const matchedLocation =
    profile.preferredLocations.find(
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

  /*
   * TARGET ROLE MATCH
   */

  const matchedRole =
    profile.targetRoles.find(
      (role) =>
        jobTitle.includes(
          normalize(role)
        )
    );

  if (matchedRole) {
    strengths.push(
      `The role aligns with your ${matchedRole} target.`
    );
  }

  /*
   * LEVEL MATCH
   */

  const matchedLevel =
    profile.preferredLevels.find(
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
   * SKILL MATCHES
   */

  const matchedSkills =
    profileSkills.filter(
      (skill) =>
        hasSkill(
          jobText,
          skill
        )
    );

  matchedSkills
    .slice(0, 5)
    .forEach(
      (skill) => {
        strengths.push(
          `${skill} appears relevant to this role.`
        );
      }
    );

  /*
   * EXISTING MATCH REASONS
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

    const alreadyExists =
      strengths.some(
        (item) =>
          normalize(item) ===
          normalize(reason)
      );

    if (!alreadyExists) {
      strengths.push(reason);
    }
  }

  if (
    strengths.length === 0
  ) {
    strengths.push(
      'Your background has transferable skills worth highlighting for this role.'
    );
  }

  /*
   * POSSIBLE TECHNOLOGIES
   *
   * These are technologies we know
   * how to detect from listings.
   *
   * A technology is only treated as a
   * gap when:
   *
   * 1. the listing mentions it
   * 2. it is NOT in preferredSkills
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

  const possibleGaps =
    technologies.filter(
      (technology) => {
        const normalizedTechnology =
          normalize(
            technology
          );

        const listingRequires =
          hasSkill(
            jobText,
            normalizedTechnology
          );

        const userHasSkill =
          profileSkills.some(
            (profileSkill) =>
              profileSkill ===
                normalizedTechnology ||
              profileSkill.includes(
                normalizedTechnology
              ) ||
              normalizedTechnology.includes(
                profileSkill
              )
          );

        return (
          listingRequires &&
          !userHasSkill
        );
      }
    );

  /*
   * REMOVE DUPLICATE ALIASES
   */

  const uniqueGaps =
    possibleGaps.filter(
      (
        technology,
        index,
        array
      ) => {
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

        const canonical =
          Object.entries(
            aliases
          ).find(
            ([, values]) =>
              values.includes(
                technology
              )
          )?.[0] ??
          technology;

        return (
          array.findIndex(
            (candidate) => {
              const candidateCanonical =
                Object.entries(
                  aliases
                ).find(
                  ([, values]) =>
                    values.includes(
                      candidate
                    )
                )?.[0] ??
                candidate;

              return (
                candidateCanonical ===
                canonical
              );
            }
          ) === index
        );
      }
    );

  uniqueGaps
    .slice(0, 5)
    .forEach(
      (skill) => {
        gaps.push(
          `Review ${skill} before applying or interviewing.`
        );
      }
    );

  /*
   * SENIORITY WARNING
   */

  const seniorTerms =
    profile.seniorLevels.length >
    0
      ? profile.seniorLevels
      : [
          'senior',
          'staff',
          'principal',
          'lead',
          'manager',
        ];

  if (
    includesAny(
      jobTitle,
      seniorTerms
    )
  ) {
    gaps.push(
      'This role may expect more senior-level experience than your current target.'
    );
  }

  /*
   * SPECIALIZATION WARNING
   */

  const unrelatedSpecialization =
    profile.unrelatedSpecializations.find(
      (specialization) =>
        jobText.includes(
          normalize(
            specialization
          )
        )
    );

  if (
    unrelatedSpecialization
  ) {
    gaps.push(
      `This role includes ${unrelatedSpecialization}, which is outside your current target specialization.`
    );
  }

  if (
    gaps.length === 0
  ) {
    gaps.push(
      'No obvious technical gap detected from the available listing data and your current profile.'
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
      'javascript'
    )
  ) {
    interviewQuestions.push(
      'Explain an important JavaScript concept you have used in one of your projects.'
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
      'fastapi'
    )
  ) {
    interviewQuestions.push(
      'How would you structure a FastAPI backend and handle validation or errors?'
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
      'docker'
    )
  ) {
    interviewQuestions.push(
      'How have you used Docker in development or deployment?'
    );
  }

  if (
    matchedSkills.includes(
      'rest api'
    ) ||
    jobText.includes(
      'api'
    )
  ) {
    interviewQuestions.push(
      'Explain how you would design and consume a REST API.'
    );
  }

  /*
   * CHECKLIST
   */

  const checklist = [
    'Read the full job description again.',

    'Tailor your resume to the strongest matching requirements.',

    'Choose 2–3 projects or experiences you can explain clearly.',

    `Research ${job.company} and its products.`,

    'Prepare answers for the interview questions above.',

    'Review the gaps identified by Application Copilot.',

    'Open the original listing and verify it is still active.',

    'Apply and update the application status in Job Copilot.',

    'Set a follow-up date after applying.',
  ];

  return {
    strengths:
      strengths.slice(
        0,
        7
      ),

    gaps:
      gaps.slice(
        0,
        5
      ),

    interviewQuestions:
      interviewQuestions.slice(
        0,
        6
      ),

    checklist,
  };
}
import {
  Job,
} from '../types/Job';

import {
  JobSource,
} from './jobSource';

/*
 * LEVER
 *
 * Public published-job endpoint:
 *
 * https://api.lever.co/v0/postings/{site}?mode=json
 *
 * Each company has its own
 * Lever site identifier.
 */

type LeverCategory = {
  location?: string;
  commitment?: string;
  team?: string;
  department?: string;
  allLocations?: string[];
};

type LeverSalaryRange = {
  currency?: string;
  interval?: string;
  min?: number;
  max?: number;
};

type LeverPosting = {
  id: string;

  text: string;

  categories?: LeverCategory;

  country?: string | null;

  openingPlain?: string;

  descriptionPlain?: string;

  descriptionBodyPlain?: string;

  additionalPlain?: string;

  hostedUrl?: string;

  applyUrl?: string;

  workplaceType?:
    | 'unspecified'
    | 'on-site'
    | 'remote'
    | 'hybrid';

  salaryRange?: LeverSalaryRange;

  salaryDescriptionPlain?: string;

  lists?: {
    text?: string;
    content?: string;
  }[];
};

type LeverCompany = {
  site: string;

  company: string;

  /*
   * Optional filter.
   *
   * We only want Singapore jobs
   * for Job Copilot V1.
   */

  locationKeywords?: string[];
};

/*
 * LIVE LEVER SOURCES
 *
 * Add more companies here later.
 *
 * CSIT currently publishes
 * Singapore software roles on
 * Lever.
 */

const leverCompanies:
  LeverCompany[] = [
    {
      site: 'csit',

      company:
        'Centre for Strategic Infocomm Technologies',

      locationKeywords: [
        'singapore',
      ],
    },
  ];

/*
 * BASIC TECH SKILL EXTRACTION
 *
 * This is intentionally local
 * and deterministic.
 *
 * Later the backend can perform
 * stronger parsing.
 */

const knownSkills = [
  'React',
  'React Native',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Flutter',
  'FastAPI',
  'Django',
  'Flask',
  'Spring',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQL',
  'GraphQL',
  'REST API',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Git',
  'Linux',
  'Terraform',
  'CI/CD',
  'Figma',
  'HTML',
  'CSS',
];

function stripHtml(
  value: string
) {
  return value
    .replace(
      /<[^>]*>/g,
      ' '
    )
    .replace(
      /&nbsp;/gi,
      ' '
    )
    .replace(
      /&amp;/gi,
      '&'
    )
    .replace(
      /&lt;/gi,
      '<'
    )
    .replace(
      /&gt;/gi,
      '>'
    )
    .replace(
      /&#39;/gi,
      "'"
    )
    .replace(
      /&quot;/gi,
      '"'
    )
    .replace(
      /\s+/g,
      ' '
    )
    .trim();
}

function extractSkills(
  text: string
) {
  const lower =
    text.toLowerCase();

  return knownSkills.filter(
    (skill) =>
      lower.includes(
        skill.toLowerCase()
      )
  );
}

function formatSalary(
  posting: LeverPosting
) {
  if (
    posting
      .salaryDescriptionPlain
  ) {
    return stripHtml(
      posting
        .salaryDescriptionPlain
    );
  }

  const range =
    posting.salaryRange;

  if (
    !range ||
    range.min === undefined ||
    range.max === undefined
  ) {
    return undefined;
  }

  const currency =
    range.currency ?? '';

  const interval =
    range.interval
      ? ` / ${range.interval}`
      : '';

  return `${currency} ${range.min.toLocaleString()} - ${range.max.toLocaleString()}${interval}`.trim();
}

function matchesLocation(
  posting: LeverPosting,
  keywords?: string[]
) {
  if (
    !keywords ||
    keywords.length === 0
  ) {
    return true;
  }

  const locationText = [
    posting.categories?.location ??
      '',

    ...(
      posting.categories
        ?.allLocations ?? []
    ),

    posting.country ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return keywords.some(
    (keyword) =>
      locationText.includes(
        keyword.toLowerCase()
      )
  );
}

function buildDescription(
  posting: LeverPosting
) {
  const parts = [
    posting.openingPlain,
    posting.descriptionPlain,
    posting.descriptionBodyPlain,
    posting.additionalPlain,
  ]
    .filter(
      (value):
        value is string =>
        Boolean(
          value &&
            value.trim()
        )
    )
    .map(stripHtml);

  const uniqueParts =
    Array.from(
      new Set(parts)
    );

  return (
    uniqueParts.join('\n\n') ||
    'View the original listing for full job details.'
  );
}

function normalizeLeverJob(
  posting: LeverPosting,
  company: LeverCompany
): Job {
  const description =
    buildDescription(
      posting
    );

  const skillText = [
    posting.text,
    description,

    ...(posting.lists ?? []).map(
      (list) =>
        `${list.text ?? ''} ${
          list.content ?? ''
        }`
    ),
  ].join(' ');

  const location =
    posting.categories
      ?.location ||
    posting.categories
      ?.allLocations?.[0] ||
    'Location not specified';

  const commitment =
    posting.categories
      ?.commitment ||
    'Not specified';

  const workplace =
    posting.workplaceType &&
    posting.workplaceType !==
      'unspecified'
      ? posting.workplaceType
      : '';

  const type = workplace
    ? `${commitment} • ${workplace}`
    : commitment;

  return {
    /*
     * Prefix IDs by source so
     * IDs from different ATS
     * providers cannot collide.
     */

    id: `lever:${company.site}:${posting.id}`,

    title: posting.text,

    company:
      company.company,

    location,

    salary:
      formatSalary(
        posting
      ),

    type,

    source: 'lever',

    sourceLabel: 'Lever',

    sourceUrl:
      posting.hostedUrl ||
      posting.applyUrl ||
      `https://jobs.lever.co/${company.site}/${posting.id}`,

    description,

    skills:
      extractSkills(
        skillText
      ),
  };
}

async function fetchLeverCompany(
  company: LeverCompany
): Promise<Job[]> {
  const url =
    `https://api.lever.co/v0/postings/` +
    `${company.site}` +
    `?mode=json`;

  const response =
    await fetch(url, {
      headers: {
        Accept:
          'application/json',
      },
    });

  if (!response.ok) {
    throw new Error(
      `Lever ${company.site} returned HTTP ${response.status}`
    );
  }

  const data =
    (await response.json()) as
      LeverPosting[];

  if (
    !Array.isArray(data)
  ) {
    throw new Error(
      `Unexpected Lever response for ${company.site}`
    );
  }

  return data
    .filter((posting) =>
      matchesLocation(
        posting,
        company.locationKeywords
      )
    )
    .map((posting) =>
      normalizeLeverJob(
        posting,
        company
      )
    );
}

export const leverSource:
  JobSource = {
    id: 'lever',

    label: 'Lever',

    async fetchJobs() {
      const results =
        await Promise.allSettled(
          leverCompanies.map(
            fetchLeverCompany
          )
        );

      const jobs:
        Job[] = [];

      results.forEach(
        (
          result,
          index
        ) => {
          const company =
            leverCompanies[index];

          if (
            result.status ===
            'fulfilled'
          ) {
            console.log(
              `[Lever] ${company.company}: ${result.value.length} jobs`
            );

            jobs.push(
              ...result.value
            );
          } else {
            console.warn(
              `[Lever] Failed ${company.company}:`,
              result.reason
            );
          }
        }
      );

      return jobs;
    },
  };

export default leverSource;
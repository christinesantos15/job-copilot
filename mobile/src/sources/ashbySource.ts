import { Job } from '../types/Job';
import { JobSource } from './jobSource';

/*
 * ASHBY
 *
 * Public published-job endpoint:
 *
 * https://api.ashbyhq.com/posting-api/job-board/{JOB_BOARD_NAME}
 *
 * includeCompensation=true gives us
 * compensation information when the
 * employer publishes it.
 */

type AshbySecondaryLocation = {
  location?: string;

  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
};

type AshbyPostalAddress = {
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
};

type AshbyAddress = {
  postalAddress?: AshbyPostalAddress;
};

type AshbyCompensationComponent = {
  compensationType?: string;
  interval?: string;
  currencyCode?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
};

type AshbyCompensation = {
  compensationTierSummary?: string | null;

  scrapeableCompensationSalarySummary?: string | null;

  summaryComponents?: AshbyCompensationComponent[];
};

type AshbyJob = {
  id?: string;

  title: string;

  location?: string;

  secondaryLocations?: AshbySecondaryLocation[];

  address?: AshbyAddress;

  department?: string;

  team?: string;

  employmentType?: string;

  workplaceType?: string;

  descriptionPlain?: string;

  descriptionHtml?: string;

  description?: string;

  jobUrl?: string;

  applyUrl?: string;

  isListed?: boolean;

  publishedAt?: string;

  compensation?: AshbyCompensation;
};

type AshbyResponse = {
  apiVersion?: string;
  jobs: AshbyJob[];
};

type AshbyCompany = {
  boardName: string;

  company: string;

  locationKeywords?: string[];
};

/*
 * VERIFIED ASHBY BOARDS
 *
 * These currently expose Singapore
 * listings through Ashby.
 */

const ashbyCompanies: AshbyCompany[] = [
  {
    boardName: 'cognition',
    company: 'Cognition',
    locationKeywords: ['singapore'],
  },
  {
    boardName: 'codex',
    company: 'Codex',
    locationKeywords: ['singapore'],
  },
  {
    boardName: 'ashby',
    company: 'Ashby',
    locationKeywords: ['singapore'],
  },
  {
    boardName: 'openai',
    company: 'OpenAI',
    locationKeywords: ['singapore'],
  },
  {
    boardName: 'exa',
    company: 'Exa',
    locationKeywords: ['singapore'],
  },
  {
    boardName: 'simular',
    company: 'Simular',
    locationKeywords: ['singapore'],
  },
];

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
  'REST',
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
  'Clojure',
  'Machine Learning',
  'AI',
];

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractSkills(text: string) {
  const lower = text.toLowerCase();

  return knownSkills.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );
}

function getLocationText(job: AshbyJob) {
  const secondaryLocations =
    job.secondaryLocations ?? [];

  const secondaryText = secondaryLocations.map(
    (location) =>
      [
        location.location ?? '',
        location.address?.addressLocality ?? '',
        location.address?.addressRegion ?? '',
        location.address?.addressCountry ?? '',
      ].join(' ')
  );

  const postal =
    job.address?.postalAddress;

  return [
    job.location ?? '',
    postal?.addressLocality ?? '',
    postal?.addressRegion ?? '',
    postal?.addressCountry ?? '',
    ...secondaryText,
  ]
    .join(' ')
    .toLowerCase();
}

function matchesLocation(
  job: AshbyJob,
  keywords?: string[]
) {
  if (!keywords || keywords.length === 0) {
    return true;
  }

  const locationText =
    getLocationText(job);

  return keywords.some((keyword) =>
    locationText.includes(
      keyword.toLowerCase()
    )
  );
}

function buildDisplayLocation(
  job: AshbyJob
) {
  const locations: string[] = [];

  if (job.location) {
    locations.push(job.location);
  }

  for (const secondary of
    job.secondaryLocations ?? []) {
    if (
      secondary.location &&
      !locations.some(
        (existing) =>
          existing.toLowerCase() ===
          secondary.location!.toLowerCase()
      )
    ) {
      locations.push(
        secondary.location
      );
    }
  }

  return (
    locations.join(' • ') ||
    'Location not specified'
  );
}

function buildDescription(
  job: AshbyJob
) {
  const source =
    job.descriptionPlain ||
    job.descriptionHtml ||
    job.description ||
    '';

  const description =
    stripHtml(source);

  return (
    description ||
    'View the original listing for full job details.'
  );
}

function formatCompensationComponent(
  component: AshbyCompensationComponent
) {
  if (
    component.minValue == null &&
    component.maxValue == null
  ) {
    return null;
  }

  const currency =
    component.currencyCode ?? '';

  const min =
    component.minValue != null
      ? component.minValue.toLocaleString()
      : '';

  const max =
    component.maxValue != null
      ? component.maxValue.toLocaleString()
      : '';

  let range = '';

  if (min && max) {
    range = `${min} - ${max}`;
  } else {
    range = min || max;
  }

  const interval =
    component.interval &&
    component.interval !== 'NONE'
      ? ` / ${component.interval.toLowerCase()}`
      : '';

  return `${currency} ${range}${interval}`.trim();
}

function formatSalary(
  compensation?: AshbyCompensation
) {
  if (!compensation) {
    return undefined;
  }

  if (
    compensation
      .scrapeableCompensationSalarySummary
  ) {
    return stripHtml(
      compensation
        .scrapeableCompensationSalarySummary
    );
  }

  if (
    compensation.compensationTierSummary
  ) {
    return stripHtml(
      compensation
        .compensationTierSummary
    );
  }

  const salaryComponent =
    compensation.summaryComponents?.find(
      (component) =>
        component.compensationType
          ?.toLowerCase()
          .includes('salary')
    );

  if (!salaryComponent) {
    return undefined;
  }

  return (
    formatCompensationComponent(
      salaryComponent
    ) ?? undefined
  );
}

function inferJobType(job: AshbyJob) {
  if (job.employmentType) {
    return job.workplaceType
      ? `${job.employmentType} • ${job.workplaceType}`
      : job.employmentType;
  }

  const text = [
    job.title,
    job.department ?? '',
    job.team ?? '',
    buildDescription(job),
  ]
    .join(' ')
    .toLowerCase();

  let employmentType =
    'Full-time';

  if (text.includes('intern')) {
    employmentType =
      'Internship';
  } else if (
    text.includes('part-time') ||
    text.includes('part time')
  ) {
    employmentType =
      'Part-time';
  } else if (
    text.includes('contract')
  ) {
    employmentType =
      'Contract';
  } else if (
    text.includes('temporary')
  ) {
    employmentType =
      'Temporary';
  }

  if (job.workplaceType) {
    return `${employmentType} • ${job.workplaceType}`;
  }

  return employmentType;
}

function buildStableId(
  job: AshbyJob,
  company: AshbyCompany
) {
  if (job.id) {
    return `ashby:${company.boardName}:${job.id}`;
  }

  if (job.jobUrl) {
    const urlParts =
      job.jobUrl
        .split('?')[0]
        .split('/')
        .filter(Boolean);

    const lastPart =
      urlParts[
        urlParts.length - 1
      ];

    if (lastPart) {
      return `ashby:${company.boardName}:${lastPart}`;
    }
  }

  const fallback = [
    company.boardName,
    job.title,
    job.location ?? '',
  ]
    .join(':')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `ashby:${fallback}`;
}

function normalizeAshbyJob(
  job: AshbyJob,
  company: AshbyCompany
): Job {
  const description =
    buildDescription(job);

  const searchableText = [
    job.title,
    description,
    job.department ?? '',
    job.team ?? '',
  ].join(' ');

  return {
    id: buildStableId(
      job,
      company
    ),

    title: job.title,

    company:
      company.company,

    location:
      buildDisplayLocation(job),

    salary:
      formatSalary(
        job.compensation
      ),

    type:
      inferJobType(job),

    source: 'ashby',

    sourceLabel: 'Ashby',

    sourceUrl:
      job.jobUrl ||
      job.applyUrl ||
      `https://jobs.ashbyhq.com/${company.boardName}`,

    description,

    postedDate:
      job.publishedAt,

    skills:
      extractSkills(
        searchableText
      ),
  };
}

async function fetchAshbyCompany(
  company: AshbyCompany
): Promise<Job[]> {
  const url =
    `https://api.ashbyhq.com/posting-api/job-board/` +
    `${company.boardName}` +
    `?includeCompensation=true`;

  const response =
    await fetch(url, {
      headers: {
        Accept:
          'application/json',
      },
    });

  if (!response.ok) {
    throw new Error(
      `Ashby ${company.boardName} returned HTTP ${response.status}`
    );
  }

  const data =
    (await response.json()) as
      AshbyResponse;

  if (
    !data ||
    !Array.isArray(
      data.jobs
    )
  ) {
    throw new Error(
      `Unexpected Ashby response for ${company.boardName}`
    );
  }

  /*
   * Ashby's public feed can include
   * postings marked isListed=false.
   *
   * We only want jobs intended for
   * public display.
   */

  return data.jobs
    .filter(
      (job) =>
        job.isListed !== false
    )
    .filter((job) =>
      matchesLocation(
        job,
        company.locationKeywords
      )
    )
    .map((job) =>
      normalizeAshbyJob(
        job,
        company
      )
    );
}

export const ashbySource:
  JobSource = {
    id: 'ashby',

    label: 'Ashby',

    async fetchJobs() {
      const results =
        await Promise.allSettled(
          ashbyCompanies.map(
            fetchAshbyCompany
          )
        );

      const jobs: Job[] = [];

      results.forEach(
        (result, index) => {
          const company =
            ashbyCompanies[
              index
            ];

          if (
            result.status ===
            'fulfilled'
          ) {
            console.log(
              `[Ashby] ${company.company}: ${result.value.length} jobs`
            );

            jobs.push(
              ...result.value
            );
          } else {
            console.warn(
              `[Ashby] Failed ${company.company}:`,
              result.reason
            );
          }
        }
      );

      return jobs;
    },
  };

export default ashbySource;
import { Job } from '../types/Job';
import { JobSource } from './jobSource';

/*
 * GREENHOUSE
 *
 * Public published-job endpoint:
 *
 * https://boards-api.greenhouse.io/v1/boards/{boardToken}/jobs?content=true
 *
 * GET job-board data does not require authentication.
 */

type GreenhouseLocation = {
  name?: string;
};

type GreenhouseDepartment = {
  id?: number;
  name?: string;
};

type GreenhouseOffice = {
  id?: number;
  name?: string;
  location?: string;
};

type GreenhouseJob = {
  id: number;

  internal_job_id?:
    | number
    | null;

  title: string;

  location?:
    GreenhouseLocation;

  updated_at?: string;

  absolute_url?: string;

  content?: string;

  departments?:
    GreenhouseDepartment[];

  offices?:
    GreenhouseOffice[];

  metadata?: unknown;
};

type GreenhouseResponse = {
  jobs: GreenhouseJob[];

  meta?: {
    total?: number;
  };
};

type GreenhouseCompany = {
  boardToken: string;

  company: string;

  locationKeywords?: string[];
};

/*
 * LIVE GREENHOUSE BOARDS
 *
 * Keep this list intentionally small.
 *
 * If one company changes or removes
 * its board token, the other sources
 * will still continue working.
 */

const greenhouseCompanies:
  GreenhouseCompany[] = [
    {
      boardToken:
        'greenhouse',

      company:
        'Greenhouse',

      locationKeywords: [
        'singapore',
      ],
    },

    {
      boardToken:
        'generalassembly',

      company:
        'General Assembly',

      locationKeywords: [
        'singapore',
      ],
    },

    {
      boardToken:
        'alphasense',

      company:
        'AlphaSense',

      locationKeywords: [
        'singapore',
      ],
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

/*
 * HTML ENTITY DECODER
 *
 * Some Greenhouse boards return
 * HTML that has itself been encoded.
 *
 * Example:
 *
 * &lt;strong&gt;Hello&lt;/strong&gt;
 *
 * We need to decode those entities
 * BEFORE removing HTML tags.
 */

function decodeHtmlEntities(
  value: string
) {
  return value
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
      /&#x27;/gi,
      "'"
    )

    .replace(
      /&apos;/gi,
      "'"
    )

    .replace(
      /&quot;/gi,
      '"'
    )

    .replace(
      /&ldquo;/gi,
      '"'
    )

    .replace(
      /&rdquo;/gi,
      '"'
    )

    .replace(
      /&lsquo;/gi,
      "'"
    )

    .replace(
      /&rsquo;/gi,
      "'"
    )

    .replace(
      /&ndash;/gi,
      '–'
    )

    .replace(
      /&mdash;/gi,
      '—'
    );
}

/*
 * HTML CLEANER
 *
 * Order matters:
 *
 * 1. Decode encoded HTML
 * 2. Preserve useful line breaks
 * 3. Remove remaining tags
 * 4. Decode again in case content
 *    was encoded more than once
 * 5. Remove any newly exposed tags
 * 6. Clean whitespace
 */

function stripHtml(
  value: string
) {
  let text =
    decodeHtmlEntities(
      value
    );

  /*
   * Preserve readable structure
   * before removing tags.
   */

  text = text
    .replace(
      /<br\s*\/?>/gi,
      '\n'
    )

    .replace(
      /<\/p>/gi,
      '\n\n'
    )

    .replace(
      /<\/div>/gi,
      '\n\n'
    )

    .replace(
      /<\/li>/gi,
      '\n'
    )

    .replace(
      /<li[^>]*>/gi,
      '• '
    )

    .replace(
      /<\/h[1-6]>/gi,
      '\n\n'
    )

    .replace(
      /<[^>]*>/g,
      ' '
    );

  /*
   * Some boards contain HTML that
   * has been encoded twice.
   *
   * Decode a second time, then
   * remove any tags that become
   * visible after decoding.
   */

  text =
    decodeHtmlEntities(
      text
    );

  text = text
    .replace(
      /<br\s*\/?>/gi,
      '\n'
    )

    .replace(
      /<\/p>/gi,
      '\n\n'
    )

    .replace(
      /<\/div>/gi,
      '\n\n'
    )

    .replace(
      /<\/li>/gi,
      '\n'
    )

    .replace(
      /<li[^>]*>/gi,
      '• '
    )

    .replace(
      /<\/h[1-6]>/gi,
      '\n\n'
    )

    .replace(
      /<[^>]*>/g,
      ' '
    );

  /*
   * Clean spacing without destroying
   * paragraph breaks.
   */

  return text
    .replace(
      /\r/g,
      ''
    )

    .replace(
      /[ \t]+/g,
      ' '
    )

    .replace(
      / *\n */g,
      '\n'
    )

    .replace(
      /\n{3,}/g,
      '\n\n'
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

function matchesLocation(
  job: GreenhouseJob,
  keywords?: string[]
) {
  if (
    !keywords ||
    keywords.length === 0
  ) {
    return true;
  }

  const text = [
    job.location?.name ?? '',

    ...(
      job.offices ?? []
    ).map(
      (office) =>
        `${office.name ?? ''} ${
          office.location ?? ''
        }`
    ),
  ]
    .join(' ')
    .toLowerCase();

  return keywords.some(
    (keyword) =>
      text.includes(
        keyword.toLowerCase()
      )
  );
}

function inferJobType(
  job: GreenhouseJob
) {
  /*
   * Use the cleaned description
   * instead of raw HTML.
   */

  const cleanContent =
    stripHtml(
      job.content ?? ''
    );

  const text = [
    job.title,

    cleanContent,

    ...(
      job.departments ?? []
    ).map(
      (department) =>
        department.name ?? ''
    ),
  ]
    .join(' ')
    .toLowerCase();

  if (
    text.includes(
      'intern'
    )
  ) {
    return 'Internship';
  }

  if (
    text.includes(
      'part-time'
    ) ||
    text.includes(
      'part time'
    )
  ) {
    return 'Part-time';
  }

  if (
    text.includes(
      'contract'
    )
  ) {
    return 'Contract';
  }

  if (
    text.includes(
      'temporary'
    )
  ) {
    return 'Temporary';
  }

  return 'Full-time';
}

function normalizeGreenhouseJob(
  job: GreenhouseJob,
  company: GreenhouseCompany
): Job {
  /*
   * IMPORTANT:
   *
   * Store only the cleaned,
   * human-readable description
   * inside our normalized Job.
   */

  const description =
    stripHtml(
      job.content ?? ''
    ) ||
    'View the original listing for full job details.';

  const departmentText =
    (
      job.departments ?? []
    )
      .map(
        (department) =>
          department.name ?? ''
      )
      .join(' ');

  /*
   * Skill detection also uses the
   * cleaned description so HTML
   * class names and attributes do
   * not affect matching.
   */

  const skills =
    extractSkills(
      [
        job.title,
        description,
        departmentText,
      ].join(' ')
    );

  return {
    id:
      `greenhouse:` +
      `${company.boardToken}:` +
      `${job.id}`,

    title:
      job.title,

    company:
      company.company,

    location:
      job.location?.name ||
      'Location not specified',

    type:
      inferJobType(job),

    source:
      'greenhouse',

    sourceLabel:
      'Greenhouse',

    sourceUrl:
      job.absolute_url ||
      (
        `https://job-boards.greenhouse.io/` +
        `${company.boardToken}/` +
        `jobs/${job.id}`
      ),

    description,

    postedDate:
      job.updated_at,

    skills,
  };
}

async function fetchGreenhouseCompany(
  company: GreenhouseCompany
): Promise<Job[]> {
  const url =
    `https://boards-api.greenhouse.io/v1/boards/` +
    `${company.boardToken}` +
    `/jobs?content=true`;

  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            'application/json',
        },
      }
    );

  if (!response.ok) {
    throw new Error(
      `Greenhouse ${company.boardToken} returned HTTP ${response.status}`
    );
  }

  const data =
    (
      await response.json()
    ) as GreenhouseResponse;

  if (
    !data ||
    !Array.isArray(
      data.jobs
    )
  ) {
    throw new Error(
      `Unexpected Greenhouse response for ${company.boardToken}`
    );
  }

  return data.jobs
    .filter(
      (job) =>
        matchesLocation(
          job,
          company.locationKeywords
        )
    )

    .map(
      (job) =>
        normalizeGreenhouseJob(
          job,
          company
        )
    );
}

export const greenhouseSource:
  JobSource = {
    id:
      'greenhouse',

    label:
      'Greenhouse',

    async fetchJobs() {
      const results =
        await Promise.allSettled(
          greenhouseCompanies.map(
            fetchGreenhouseCompany
          )
        );

      const jobs: Job[] = [];

      results.forEach(
        (
          result,
          index
        ) => {
          const company =
            greenhouseCompanies[
              index
            ];

          if (
            result.status ===
            'fulfilled'
          ) {
            console.log(
              `[Greenhouse] ${company.company}: ${result.value.length} jobs`
            );

            jobs.push(
              ...result.value
            );
          } else {
            console.warn(
              `[Greenhouse] Failed ${company.company}:`,
              result.reason
            );
          }
        }
      );

      return jobs;
    },
  };

export default greenhouseSource;
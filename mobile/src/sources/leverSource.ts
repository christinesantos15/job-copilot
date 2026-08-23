import { Job } from '../types/Job';
import { JobSource } from './jobSource';

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl: string;

  categories: {
    location?: string;
    commitment?: string;
    team?: string;
  };

  descriptionPlain?: string;
  createdAt?: number;
};

type LeverCompany = {
  site: string;
  name: string;
};

const LEVER_COMPANIES: LeverCompany[] = [
  {
    site: 'csit',
    name: 'CSIT',
  },
  {
    site: 'kpler',
    name: 'Kpler',
  },
  {
    site: 'GoToGroup',
    name: 'GoTo Group',
  },
];

function isSingaporeJob(job: Job): boolean {
  const location = job.location
    .trim()
    .toLowerCase();

  return location.includes('singapore');
}

function isRelevantJob(job: Job): boolean {
  const searchableText = [
    job.title,
    job.description,
  ]
    .join(' ')
    .toLowerCase();

  const relevantKeywords = [
    'software engineer',
    'software developer',
    'frontend',
    'front end',
    'backend',
    'back end',
    'full stack',
    'fullstack',
    'web developer',
    'react',
    'javascript',
    'typescript',
    'ui/ux',
    'ui ux',
    'product designer',
    'software intern',
    'engineering intern',
    'developer intern',
    'graduate engineer',
    'junior developer',
    'junior engineer',
  ];

  return relevantKeywords.some(
    (keyword) =>
      searchableText.includes(keyword)
  );
}

function isEarlyCareerJob(job: Job): boolean {
  const title = job.title
    .trim()
    .toLowerCase();

  const excludedKeywords = [
    'senior',
    'sr.',
    'lead',
    'staff',
    'principal',
    'manager',
    'head of',
    'director',
    'vp',
    'vice president',
  ];

  return !excludedKeywords.some(
    (keyword) =>
      title.includes(keyword)
  );
}

function hasTooMuchExperienceRequired(
  job: Job
): boolean {
  const text = [
    job.title,
    job.description,
  ]
    .join(' ')
    .toLowerCase();

  const experiencePatterns = [
    /\b5\+?\s*years?\b/,
    /\b6\+?\s*years?\b/,
    /\b7\+?\s*years?\b/,
    /\b8\+?\s*years?\b/,
    /\b9\+?\s*years?\b/,
    /\b10\+?\s*years?\b/,
  ];

  return experiencePatterns.some(
    (pattern) =>
      pattern.test(text)
  );
}

function interleaveJobs(
  jobGroups: Job[][]
): Job[] {
  const result: Job[] = [];

  let index = 0;

  while (true) {
    let addedJob = false;

    for (const group of jobGroups) {
      if (index < group.length) {
        result.push(group[index]);
        addedJob = true;
      }
    }

    if (!addedJob) {
      break;
    }

    index++;
  }

  return result;
}

async function fetchLeverSite(
  company: LeverCompany
): Promise<Job[]> {
  const { site, name } = company;

  const response = await fetch(
    `https://api.lever.co/v0/postings/${site}?mode=json`
  );

  if (!response.ok) {
    console.error(
      `Lever request failed for ${site}:`,
      response.status
    );

    return [];
  }

  const postings: LeverPosting[] =
    await response.json();

  const normalizedJobs: Job[] =
    postings.map((posting) => ({
      id: `lever-${site}-${posting.id}`,

      title: posting.text,

      company: name,

      location:
        posting.categories.location ??
        'Not specified',

      type:
        posting.categories.commitment ??
        'Not specified',

      source: 'company',

      sourceLabel: 'Company Careers',

      sourceUrl: posting.hostedUrl,

      description:
        posting.descriptionPlain ??
        'No description available.',

      postedDate: posting.createdAt
        ? new Date(posting.createdAt)
            .toISOString()
            .split('T')[0]
        : undefined,

      skills: [],
    }));

  const singaporeJobs =
    normalizedJobs.filter(
      isSingaporeJob
    );

  const relevantJobs =
    singaporeJobs
      .filter(isRelevantJob)
      .filter(isEarlyCareerJob)
      .filter(
        (job) =>
          !hasTooMuchExperienceRequired(
            job
          )
      );

  console.log(
    `${name}: ${relevantJobs.length} relevant early-career Singapore jobs`
  );

  return relevantJobs;
}

export const leverSource: JobSource = {
  name: 'Lever',

  async fetchJobs(): Promise<Job[]> {
    const results = await Promise.all(
      LEVER_COMPANIES.map(
        (company) =>
          fetchLeverSite(company)
      )
    );

    return interleaveJobs(results);
  },
};
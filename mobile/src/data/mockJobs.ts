import { Job } from '../types/Job';

export const mockJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Junior Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Singapore',
    salary: '$3,000 - $4,000 per month',
    type: 'Full-time',

    source: 'linkedin',
    sourceLabel: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/',

    description:
      'Fresh graduates are welcome. 0-1 years of experience. Build frontend applications using React and TypeScript.',

    skills: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
    ],
  },

  {
    id: 'job-002',
    title: 'Software Engineer',
    company: 'Innovatech',
    location: 'Singapore',
    salary: '$4,000 - $5,000 per month',
    type: 'Full-time',

    source: 'mycareersfuture',
    sourceLabel: 'MyCareersFuture',
    sourceUrl: 'https://www.mycareersfuture.gov.sg/',

    description:
      'Requires 2+ years of software development experience. Work with Python, REST APIs and PostgreSQL.',

    skills: [
      'Python',
      'REST API',
      'PostgreSQL',
      'AWS',
    ],
  },

  {
    id: 'job-003',
    title: 'Senior Cyber Security Software Engineer',
    company: 'Creative Minds',
    location: 'Singapore',
    salary: '$6,000 - $8,000 per month',
    type: 'Full-time',

    source: 'jobstreet',
    sourceLabel: 'JobStreet',
    sourceUrl: 'https://www.jobstreet.com.sg/',

    description:
      'Requires at least 5 years of relevant experience in cybersecurity and Linux systems.',

    skills: [
      'Linux',
      'C++',
      'Cybersecurity',
      'AWS',
      'Kubernetes',
    ],
  },
];
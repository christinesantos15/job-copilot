import { Job } from '../types/Job';

export const jobs: Job[] = [
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
      'Build and maintain frontend applications using React and TypeScript. Work with designers and backend engineers to deliver responsive web experiences.',

    postedDate: '2026-08-22',

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
      'Develop full-stack software features, integrate APIs, work with databases, and collaborate with the engineering team.',

    postedDate: '2026-08-21',

    skills: [
      'JavaScript',
      'Python',
      'REST API',
      'PostgreSQL',
      'Git',
    ],
  },

  {
    id: 'job-003',
    title: 'UI/UX Designer',
    company: 'Creative Minds',
    location: 'Singapore',
    salary: '$3,500 - $4,200 per month',
    type: 'Full-time',

    source: 'jobstreet',
    sourceLabel: 'JobStreet',
    sourceUrl: 'https://www.jobstreet.com.sg/',

    description:
      'Design user interfaces and experiences for web and mobile products while collaborating with product and engineering teams.',

    postedDate: '2026-08-20',

    skills: [
      'Figma',
      'UI Design',
      'UX Design',
      'Prototyping',
    ],
  },
];
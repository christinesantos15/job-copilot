import { useState } from 'react';

import { Job } from './src/types/Job';
import { jobs } from './src/data/jobs';

import InterestedJobsScreen from './src/screens/InterestedJobsScreen';
import JobFeedScreen from './src/screens/JobFeedScreen';
import NoMoreJobsScreen from './src/screens/NoMoreJobsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interestedJobs, setInterestedJobs] = useState<Job[]>([]);
  const [showInterested, setShowInterested] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [detailsOrigin, setDetailsOrigin] = useState<
    'feed' | 'interested' | null
  >(null);

  const job = jobs[currentIndex];

  function showNextJob() {
    setCurrentIndex((previousIndex) => previousIndex + 1);
  }

  function handleInterested(selectedJob: Job) {
    setInterestedJobs((previousJobs) => [
      ...previousJobs,
      selectedJob,
    ]);

    console.log('Interested:', selectedJob.title);

    showNextJob();
  }

  function handleSkipped(selectedJob: Job) {
    console.log('Skipped:', selectedJob.title);

    showNextJob();
  }

  function openJobDetailsFromFeed(selectedJob: Job) {
    setDetailsOrigin('feed');
    setSelectedJob(selectedJob);
  }

  if (selectedJob) {
    return (
      <JobDetailsScreen
        job={selectedJob}
        onBack={() => {
          setSelectedJob(null);

          if (detailsOrigin === 'interested') {
            setShowInterested(true);
          }

          setDetailsOrigin(null);
        }}
      />
    );
  }

  if (showInterested) {
    return (
      <InterestedJobsScreen
        interestedJobs={interestedJobs}
        onBack={() => setShowInterested(false)}
        onViewDetails={(selectedJob) => {
          setShowInterested(false);
          setDetailsOrigin('interested');
          setSelectedJob(selectedJob);
        }}
      />
    );
  }

  if (!job) {
    return (
      <NoMoreJobsScreen
        interestedCount={interestedJobs.length}
        onViewInterested={() => setShowInterested(true)}
      />
    );
  }

  return (
    <JobFeedScreen
      job={job}
      interestedCount={interestedJobs.length}
      onInterested={handleInterested}
      onSkipped={handleSkipped}
      onViewInterested={() => setShowInterested(true)}
      onViewDetails={openJobDetailsFromFeed}
    />
  );
}
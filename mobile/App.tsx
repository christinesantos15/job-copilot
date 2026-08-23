import { useState } from 'react';

import { Job } from './src/types/Job';
import { jobs } from './src/data/jobs';

import InterestedJobsScreen from './src/screens/InterestedJobsScreen';
import JobFeedScreen from './src/screens/JobFeedScreen';
import NoMoreJobsScreen from './src/screens/NoMoreJobsScreen';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interestedJobs, setInterestedJobs] = useState<Job[]>([]);
  const [showInterested, setShowInterested] = useState(false);

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

  if (showInterested) {
    return (
      <InterestedJobsScreen
        interestedJobs={interestedJobs}
        onBack={() => setShowInterested(false)}
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
    />
  );
}

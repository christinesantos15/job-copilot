import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  loadCurrentIndex,
  loadInterestedJobs,
  saveCurrentIndex,
  saveInterestedJobs,
} from './src/storage/jobStorage';

import {
  ApplicationStatus,
  Job,
} from './src/types/Job';

import { jobs } from './src/data/jobs';

import InterestedJobsScreen from './src/screens/InterestedJobsScreen';
import JobFeedScreen from './src/screens/JobFeedScreen';
import NoMoreJobsScreen from './src/screens/NoMoreJobsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';

type DetailsOrigin =
  | 'feed'
  | 'interested'
  | null;

export default function App() {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [
    interestedJobs,
    setInterestedJobs,
  ] = useState<Job[]>([]);

  const [
    showInterested,
    setShowInterested,
  ] = useState(false);

  const [
    selectedJob,
    setSelectedJob,
  ] = useState<Job | null>(null);

  const [
    detailsOrigin,
    setDetailsOrigin,
  ] = useState<DetailsOrigin>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const job = jobs[currentIndex];

  useEffect(() => {
    async function loadSavedState() {
      try {
        const savedIndex =
          await loadCurrentIndex();

        const savedInterestedJobs =
          await loadInterestedJobs();

        setCurrentIndex(savedIndex);

        setInterestedJobs(
          savedInterestedJobs
        );
      } catch (error) {
        console.error(
          'Failed to load saved job state:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedState();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    saveCurrentIndex(
      currentIndex
    ).catch((error) => {
      console.error(
        'Failed to save current job index:',
        error
      );
    });
  }, [currentIndex, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    saveInterestedJobs(
      interestedJobs
    ).catch((error) => {
      console.error(
        'Failed to save interested jobs:',
        error
      );
    });
  }, [interestedJobs, isLoading]);

  function handleInterested(
    selectedJob: Job
  ) {
    setInterestedJobs(
      (previousJobs) => {
        const alreadyInterested =
          previousJobs.some(
            (job) =>
              job.id === selectedJob.id
          );

        if (alreadyInterested) {
          return previousJobs;
        }

        const interestedJob: Job = {
          ...selectedJob,
          applicationStatus:
            'interested',
        };

        return [
          ...previousJobs,
          interestedJob,
        ];
      }
    );

    setCurrentIndex(
      (previousIndex) =>
        previousIndex + 1
    );

    console.log(
      'Interested:',
      selectedJob.title
    );
  }

  function handleSkipped(
    selectedJob: Job
  ) {
    setCurrentIndex(
      (previousIndex) =>
        previousIndex + 1
    );

    console.log(
      'Skipped:',
      selectedJob.title
    );
  }

  function handleStatusChange(
    jobId: string,
    status: ApplicationStatus
  ) {
    setInterestedJobs(
      (previousJobs) =>
        previousJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                applicationStatus:
                  status,
              }
            : job
        )
    );
  }

  function openJobDetailsFromFeed(
    selectedJob: Job
  ) {
    setDetailsOrigin('feed');

    setSelectedJob(selectedJob);
  }

  function openJobDetailsFromInterested(
    selectedJob: Job
  ) {
    setShowInterested(false);

    setDetailsOrigin('interested');

    setSelectedJob(selectedJob);
  }

  function closeJobDetails() {
    setSelectedJob(null);

    if (
      detailsOrigin === 'interested'
    ) {
      setShowInterested(true);
    }

    setDetailsOrigin(null);
  }

  function restartFeed() {
    setCurrentIndex(0);
  }

  if (isLoading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
        />

        <Text>
          Loading Job Copilot...
        </Text>
      </View>
    );
  }

  if (selectedJob) {
    return (
      <JobDetailsScreen
        job={selectedJob}
        onBack={closeJobDetails}
      />
    );
  }

  if (showInterested) {
    return (
      <InterestedJobsScreen
        interestedJobs={
          interestedJobs
        }
        onBack={() => {
          setShowInterested(false);
        }}
        onViewDetails={
          openJobDetailsFromInterested
        }
        onStatusChange={
          handleStatusChange
        }
      />
    );
  }

  if (!job) {
    return (
      <NoMoreJobsScreen
        interestedCount={
          interestedJobs.length
        }
        onViewInterested={() => {
          setShowInterested(true);
        }}
        onRestartFeed={
          restartFeed
        }
      />
    );
  }

  return (
    <JobFeedScreen
      job={job}
      interestedCount={
        interestedJobs.length
      }
      onInterested={
        handleInterested
      }
      onSkipped={
        handleSkipped
      }
      onViewInterested={() => {
        setShowInterested(true);
      }}
      onViewDetails={
        openJobDetailsFromFeed
      }
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
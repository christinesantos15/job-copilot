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

import { fetchAllJobs } from './src/sources/jobAggregator';

import InterestedJobsScreen from './src/screens/InterestedJobsScreen';
import JobFeedScreen from './src/screens/JobFeedScreen';
import NoMoreJobsScreen from './src/screens/NoMoreJobsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import ApplicationsScreen from './src/screens/ApplicationsScreen';

type DetailsOrigin =
  | 'feed'
  | 'interested'
  | null;

export default function App() {
  const [
    availableJobs,
    setAvailableJobs,
  ] = useState<Job[]>([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    interestedJobs,
    setInterestedJobs,
  ] = useState<Job[]>([]);

  const [
    showInterested,
    setShowInterested,
  ] = useState(false);

  const [
    showApplications,
    setShowApplications,
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

  const job =
    availableJobs[currentIndex];

  /*
   * LOAD APP DATA
   *
   * Loads:
   * - saved feed position
   * - saved interested/application jobs
   * - jobs from all configured sources
   */
  useEffect(() => {
    async function loadAppData() {
      try {
        const [
          savedIndex,
          savedInterestedJobs,
          fetchedJobs,
        ] = await Promise.all([
          loadCurrentIndex(),
          loadInterestedJobs(),
          fetchAllJobs(),
        ]);

        setAvailableJobs(
          fetchedJobs
        );

        /*
         * The number of jobs may change
         * between app launches.
         *
         * If the saved index is outside
         * the new feed, restart from 0.
         */
        if (
          savedIndex <
          fetchedJobs.length
        ) {
          setCurrentIndex(
            savedIndex
          );
        } else {
          setCurrentIndex(0);
        }

        setInterestedJobs(
          savedInterestedJobs
        );
      } catch (error) {
        console.error(
          'Failed to load Job Copilot data:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAppData();
  }, []);

  /*
   * SAVE CURRENT FEED POSITION
   */
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
  }, [
    currentIndex,
    isLoading,
  ]);

  /*
   * SAVE INTERESTED / APPLICATION JOBS
   */
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
  }, [
    interestedJobs,
    isLoading,
  ]);

  /*
   * SWIPE RIGHT
   */
  function handleInterested(
    selectedJob: Job
  ) {
    setInterestedJobs(
      (previousJobs) => {
        const alreadyInterested =
          previousJobs.some(
            (job) =>
              job.id ===
              selectedJob.id
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

  /*
   * SWIPE LEFT
   */
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

  /*
   * UPDATE APPLICATION STATUS
   */
  function handleStatusChange(
    jobId: string,
    status: ApplicationStatus
  ) {
    setInterestedJobs(
      (previousJobs) =>
        previousJobs.map(
          (job) =>
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

  /*
   * OPEN DETAILS FROM FEED
   */
  function openJobDetailsFromFeed(
    selectedJob: Job
  ) {
    setDetailsOrigin(
      'feed'
    );

    setSelectedJob(
      selectedJob
    );
  }

  /*
   * OPEN DETAILS FROM INTERESTED JOBS
   */
  function openJobDetailsFromInterested(
    selectedJob: Job
  ) {
    setShowInterested(
      false
    );

    setDetailsOrigin(
      'interested'
    );

    setSelectedJob(
      selectedJob
    );
  }

  /*
   * CLOSE JOB DETAILS
   */
  function closeJobDetails() {
    setSelectedJob(null);

    if (
      detailsOrigin ===
      'interested'
    ) {
      setShowInterested(
        true
      );
    }

    setDetailsOrigin(null);
  }

  /*
   * RESTART FEED
   *
   * Important:
   * This does NOT delete interested
   * jobs or application history.
   */
  function restartFeed() {
    setCurrentIndex(0);
  }

  /*
   * LOADING SCREEN
   */
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

  /*
   * JOB DETAILS SCREEN
   */
  if (selectedJob) {
    return (
      <JobDetailsScreen
        job={selectedJob}
        onBack={
          closeJobDetails
        }
      />
    );
  }

  /*
   * APPLICATION TRACKER
   */
  if (showApplications) {
    return (
      <ApplicationsScreen
        jobs={
          interestedJobs
        }
        onBack={() => {
          setShowApplications(
            false
          );
        }}
      />
    );
  }

  /*
   * INTERESTED JOBS
   */
  if (showInterested) {
    return (
      <InterestedJobsScreen
        interestedJobs={
          interestedJobs
        }
        onBack={() => {
          setShowInterested(
            false
          );
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

  /*
   * END OF JOB FEED
   */
  if (!job) {
    return (
      <NoMoreJobsScreen
        interestedCount={
          interestedJobs.length
        }
        onViewInterested={() => {
          setShowInterested(
            true
          );
        }}
        onRestartFeed={
          restartFeed
        }
      />
    );
  }

  /*
   * MAIN JOB FEED
   */
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
        setShowInterested(
          true
        );
      }}
      onViewDetails={
        openJobDetailsFromFeed
      }
      onViewApplications={() => {
        setShowApplications(
          true
        );
      }}
    />
  );
}

const styles =
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 12,
    },
  });
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  clearAllJobData,
  loadInterestedJobs,
  loadSeenJobIds,
  saveInterestedJobs,
  saveSeenJobIds,
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
    interestedJobs,
    setInterestedJobs,
  ] = useState<Job[]>([]);

  const [
    seenJobIds,
    setSeenJobIds,
  ] = useState<string[]>([]);

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

  /*
   * BUILD FEED FROM UNSEEN JOBS
   */

  const feedJobs =
    availableJobs.filter(
      (job) =>
        !seenJobIds.includes(
          job.id
        )
    );

  const job =
    feedJobs[0];

  /*
   * LOAD APP DATA
   */

  useEffect(() => {
    async function loadAppData() {
      try {
        const [
          savedInterestedJobs,
          savedSeenJobIds,
          fetchedJobs,
        ] = await Promise.all([
          loadInterestedJobs(),
          loadSeenJobIds(),
          fetchAllJobs(),
        ]);

        setAvailableJobs(
          fetchedJobs
        );

        setInterestedJobs(
          savedInterestedJobs
        );

        setSeenJobIds(
          savedSeenJobIds
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
   * SAVE INTERESTED /
   * APPLICATION JOBS
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
   * SAVE SEEN JOB IDS
   */

  useEffect(() => {
    if (isLoading) {
      return;
    }

    saveSeenJobIds(
      seenJobIds
    ).catch((error) => {
      console.error(
        'Failed to save seen job IDs:',
        error
      );
    });
  }, [
    seenJobIds,
    isLoading,
  ]);

  /*
   * MARK JOB AS SEEN
   */

  function markJobAsSeen(
    selectedJob: Job
  ) {
    setSeenJobIds(
      (previousIds) => {
        if (
          previousIds.includes(
            selectedJob.id
          )
        ) {
          return previousIds;
        }

        return [
          ...previousIds,
          selectedJob.id,
        ];
      }
    );
  }

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
            (savedJob) =>
              savedJob.id ===
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

    markJobAsSeen(
      selectedJob
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
    markJobAsSeen(
      selectedJob
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
          (savedJob) =>
            savedJob.id === jobId
              ? {
                  ...savedJob,
                  applicationStatus:
                    status,
                }
              : savedJob
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
   * OPEN DETAILS FROM
   * INTERESTED JOBS
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
   * CLOSE DETAILS
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
   * Development reset:
   * - clears old interested jobs
   * - clears seen jobs
   * - fetches the jobs again
   * - returns to a fresh feed
   */

  async function restartFeed() {
    try {
      setIsLoading(true);

      /*
       * Clear AsyncStorage first.
       */
      await clearAllJobData();

      /*
       * Fetch a fresh copy of
       * available jobs.
       */
      const refreshedJobs =
        await fetchAllJobs();

      /*
       * Reset React state.
       */
      setInterestedJobs([]);
      setSeenJobIds([]);

      setAvailableJobs(
        refreshedJobs
      );

      setSelectedJob(null);
      setShowInterested(false);
      setShowApplications(false);
      setDetailsOrigin(null);

      console.log(
        'Job feed restarted.'
      );

      console.log(
        'Jobs available:',
        refreshedJobs.length
      );
    } catch (error) {
      console.error(
        'Failed to restart job feed:',
        error
      );
    } finally {
      setIsLoading(false);
    }
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
   * JOB DETAILS
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
   * APPLICATIONS
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
   * END OF FEED
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
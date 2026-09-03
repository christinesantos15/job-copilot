import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  clearFeedSession,
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

import BottomNav, {
  MainTab,
} from './src/components/BottomNav';

import InterestedJobsScreen from './src/screens/InterestedJobsScreen';
import JobFeedScreen from './src/screens/JobFeedScreen';
import NoMoreJobsScreen from './src/screens/NoMoreJobsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import ApplicationsScreen from './src/screens/ApplicationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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

  const [
    activeTab,
    setActiveTab,
  ] = useState<MainTab>(
    'discover'
  );

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
   * OPEN DETAILS FROM MATCHES
   */

  function openJobDetailsFromInterested(
    selectedJob: Job
  ) {
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
      setActiveTab(
        'matches'
      );
    }

    setDetailsOrigin(null);
  }

  /*
   * RESTART FEED
   *
   * Reset only the Discover session.
   * Matches and application history stay saved.
   */

  async function restartFeed() {
    try {
      setIsLoading(true);

      await clearFeedSession();

      const refreshedJobs =
        await fetchAllJobs();

      setSeenJobIds([]);

      setAvailableJobs(
        refreshedJobs
      );

      setSelectedJob(null);
      setDetailsOrigin(null);
      setActiveTab('discover');

      console.log(
        'Discover feed restarted.'
      );

      console.log(
        'Saved matches preserved:',
        interestedJobs.length
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

        <Text
          style={
            styles.loadingText
          }
        >
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
      <View style={styles.app}>
        <View style={styles.content}>
          <JobDetailsScreen
            job={selectedJob}
            onBack={
              closeJobDetails
            }
          />
        </View>

        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedJob(null);
            setDetailsOrigin(null);
            setActiveTab(tab);
          }}
        />
      </View>
    );
  }

  /*
   * MAIN APP SHELL
   */

  return (
    <View style={styles.app}>
      <View style={styles.content}>
        {activeTab ===
          'discover' && (
          <>
            {job ? (
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
                  setActiveTab(
                    'matches'
                  );
                }}
                onViewDetails={
                  openJobDetailsFromFeed
                }
                onViewApplications={() => {
                  setActiveTab(
                    'applications'
                  );
                }}
              />
            ) : (
              <NoMoreJobsScreen
                interestedCount={
                  interestedJobs.length
                }
                onViewInterested={() => {
                  setActiveTab(
                    'matches'
                  );
                }}
                onRestartFeed={
                  restartFeed
                }
              />
            )}
          </>
        )}

        {activeTab ===
          'matches' && (
          <InterestedJobsScreen
            interestedJobs={
              interestedJobs
            }
            onBack={() => {
              setActiveTab(
                'discover'
              );
            }}
            onViewDetails={
              openJobDetailsFromInterested
            }
            onStatusChange={
              handleStatusChange
            }
          />
        )}

        {activeTab ===
          'applications' && (
          <ApplicationsScreen
            jobs={
              interestedJobs
            }
            onBack={() => {
              setActiveTab(
                'discover'
              );
            }}
          />
        )}

        {activeTab ===
          'profile' && (
          <ProfileScreen />
        )}
      </View>

      <BottomNav
        activeTab={activeTab}
        onTabChange={
          setActiveTab
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor:
        '#080D1A',
    },

    content: {
      flex: 1,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 12,
      backgroundColor:
        '#080D1A',
    },

    loadingText: {
      color: '#FFFFFF',
    },
  });
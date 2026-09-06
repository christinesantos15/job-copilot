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
  loadJobPreferences,
} from './src/storage/jobPreferencesStorage';

import {
  ApplicationStatus,
  Job,
} from './src/types/Job';

import {
  JobProfile,
  jobProfile,
} from './src/profile/jobProfile';

import {
  addMatchScores,
} from './src/matching/jobMatcher';

import {
  fetchAllJobs,
} from './src/sources/jobAggregator';

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
    preferences,
    setPreferences,
  ] = useState<JobProfile>(
    jobProfile
  );

  const [
    selectedJob,
    setSelectedJob,
  ] = useState<Job | null>(null);

  const [
    detailsOrigin,
    setDetailsOrigin,
  ] = useState<DetailsOrigin>(
    null
  );

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
   * BUILD FEED
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
          savedPreferences,
          fetchedJobs,
        ] = await Promise.all([
          loadInterestedJobs(),
          loadSeenJobIds(),
          loadJobPreferences(),
          fetchAllJobs(),
        ]);

        const scoredJobs =
          addMatchScores(
            fetchedJobs,
            savedPreferences
          );

        const scoredInterestedJobs =
          addMatchScores(
            savedInterestedJobs,
            savedPreferences
          );

        setPreferences(
          savedPreferences
        );

        setAvailableJobs(
          scoredJobs
        );

        setInterestedJobs(
          scoredInterestedJobs
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
   * SAVE INTERESTED JOBS
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
   * SAVE SEEN IDS
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
   * PROFILE PREFERENCES CHANGED
   */

  function handlePreferencesChange(
    updatedPreferences: JobProfile
  ) {
    setPreferences(
      updatedPreferences
    );

    setAvailableJobs(
      (previousJobs) =>
        addMatchScores(
          previousJobs,
          updatedPreferences
        )
    );

    setInterestedJobs(
      (previousJobs) =>
        addMatchScores(
          previousJobs,
          updatedPreferences
        )
    );

    setSelectedJob(
      (previousJob) => {
        if (!previousJob) {
          return null;
        }

        return addMatchScores(
          [previousJob],
          updatedPreferences
        )[0];
      }
    );

    console.log(
      'Job match scores refreshed.'
    );
  }

  /*
   * MARK JOB SEEN
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
   * INTERESTED
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
   * PASS
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
   * APPLICATION STATUS
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
   * OPEN DETAILS FROM DISCOVER
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
   * RESTART DISCOVER FEED
   *
   * Matches and Applications remain saved.
   */

  async function restartFeed() {
    try {
      setIsLoading(true);

      await clearFeedSession();

      const refreshedJobs =
        await fetchAllJobs();

      const scoredJobs =
        addMatchScores(
          refreshedJobs,
          preferences
        );

      setSeenJobIds([]);

      setAvailableJobs(
        scoredJobs
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
        scoredJobs.length
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
   * LOADING
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
   * MAIN APP
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
          <ProfileScreen
            onPreferencesChange={
              handlePreferencesChange
            }
          />
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
      justifyContent: 'center',
      gap: 12,
      backgroundColor:
        '#080D1A',
    },

    loadingText: {
      color: '#FFFFFF',
    },
  });
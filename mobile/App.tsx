import {
  useEffect,
  useState,
} from 'react';

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
  JobFilters,
  defaultJobFilters,
} from './src/types/JobFilters';

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
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import ApplicationsScreen from './src/screens/ApplicationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type DetailsOrigin =
  | 'feed'
  | 'interested'
  | null;

type TrackingUpdates =
  Partial<
    Pick<
      Job,
      | 'appliedDate'
      | 'interviewDate'
      | 'followUpDate'
    >
  >;

/*
 * Returns YYYY-MM-DD using the
 * device's local date.
 */

function getTodayDate() {
  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      '0'
    );

  return `${year}-${month}-${day}`;
}

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
    filters,
    setFilters,
  ] = useState<JobFilters>(
    defaultJobFilters
  );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const [
    preferences,
    setPreferences,
  ] = useState<JobProfile>(
    jobProfile
  );

  const [
    selectedJob,
    setSelectedJob,
  ] = useState<Job | null>(
    null
  );

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
   * DISCOVER
   */

  const unseenJobs =
    availableJobs.filter(
      (job) =>
        !seenJobIds.includes(
          job.id
        )
    );

  const feedJobs =
    unseenJobs.filter(
      (job) => {
        /*
         * QUICK SEARCH
         */

        const search =
          searchQuery
            .trim()
            .toLowerCase();

        if (search) {
          const searchableText = [
            job.title,
            job.company,
            job.description,
            job.skills.join(' '),
          ]
            .join(' ')
            .toLowerCase();

          if (
            !searchableText.includes(
              search
            )
          ) {
            return false;
          }
        }

        /*
         * KEYWORD
         */

        const keyword =
          filters.keyword
            .trim()
            .toLowerCase();

        if (keyword) {
          const searchableText = [
            job.title,
            job.company,
            job.description,
            job.skills.join(' '),
          ]
            .join(' ')
            .toLowerCase();

          if (
            !searchableText.includes(
              keyword
            )
          ) {
            return false;
          }
        }

        /*
         * LOCATION
         */

        const location =
          filters.location
            .trim()
            .toLowerCase();

        if (
          location &&
          !job.location
            .toLowerCase()
            .includes(
              location
            )
        ) {
          return false;
        }

        /*
         * JOB TYPE
         */

        const jobType =
          filters.jobType
            .trim()
            .toLowerCase();

        if (
          jobType &&
          !job.type
            .toLowerCase()
            .includes(
              jobType
            )
        ) {
          return false;
        }

        /*
         * SOURCE
         */

        const source =
          filters.source
            .trim()
            .toLowerCase();

        if (source) {
          const sourceText = [
            job.source,
            job.sourceLabel,
          ]
            .join(' ')
            .toLowerCase();

          if (
            !sourceText.includes(
              source
            )
          ) {
            return false;
          }
        }

        /*
         * MATCH SCORE
         */

        if (
          filters.minimumMatchScore >
          0
        ) {
          const matchScore =
            job.matchScore ??
            0;

          if (
            matchScore <
            filters.minimumMatchScore
          ) {
            return false;
          }
        }

        return true;
      }
    );

  const job =
    feedJobs[0];

  const hasUnseenJobs =
    unseenJobs.length > 0;

  /*
   * SEARCH + FILTER HELPERS
   */

  function clearSearch() {
    setSearchQuery('');
  }

  function clearFilters() {
    setFilters({
      ...defaultJobFilters,
    });
  }

  /*
   * LOAD
   */

  useEffect(() => {
    async function loadAppData() {
      try {
        const [
          savedInterestedJobs,
          savedSeenJobIds,
          savedPreferences,
          fetchedJobs,
        ] =
          await Promise.all([
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
   * SAVE SAVED JOBS
   *
   * Status, notes and application
   * timeline fields are all stored
   * inside the Job object.
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
   * PREFERENCES
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
  }

  /*
   * MARK SEEN
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
   * SAVE MATCH
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
  }

  /*
   * APPLICATION STATUS
   *
   * When a job first becomes Applied,
   * automatically record today's date.
   *
   * Existing applied dates are preserved.
   */

  function handleStatusChange(
    jobId: string,
    status: ApplicationStatus
  ) {
    setInterestedJobs(
      (previousJobs) =>
        previousJobs.map(
          (savedJob) => {
            if (
              savedJob.id !==
              jobId
            ) {
              return savedJob;
            }

            const updates: Job = {
              ...savedJob,
              applicationStatus:
                status,
            };

            if (
              status ===
                'applied' &&
              !savedJob.appliedDate
            ) {
              updates.appliedDate =
                getTodayDate();
            }

            return updates;
          }
        )
    );

    setSelectedJob(
      (previousJob) => {
        if (
          !previousJob ||
          previousJob.id !==
            jobId
        ) {
          return previousJob;
        }

        const updates: Job = {
          ...previousJob,
          applicationStatus:
            status,
        };

        if (
          status ===
            'applied' &&
          !previousJob.appliedDate
        ) {
          updates.appliedDate =
            getTodayDate();
        }

        return updates;
      }
    );
  }

  /*
   * NOTES
   */

  function handleNotesChange(
    jobId: string,
    notes: string
  ) {
    setInterestedJobs(
      (previousJobs) =>
        previousJobs.map(
          (savedJob) =>
            savedJob.id ===
            jobId
              ? {
                  ...savedJob,
                  notes,
                }
              : savedJob
        )
    );

    setSelectedJob(
      (previousJob) => {
        if (
          !previousJob ||
          previousJob.id !==
            jobId
        ) {
          return previousJob;
        }

        return {
          ...previousJob,
          notes,
        };
      }
    );
  }

  /*
   * APPLICATION TIMELINE
   */

  function handleTrackingChange(
    jobId: string,
    updates: TrackingUpdates
  ) {
    setInterestedJobs(
      (previousJobs) =>
        previousJobs.map(
          (savedJob) =>
            savedJob.id ===
            jobId
              ? {
                  ...savedJob,
                  ...updates,
                }
              : savedJob
        )
    );

    setSelectedJob(
      (previousJob) => {
        if (
          !previousJob ||
          previousJob.id !==
            jobId
        ) {
          return previousJob;
        }

        return {
          ...previousJob,
          ...updates,
        };
      }
    );
  }

  /*
   * DETAILS
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
   * RESTART DISCOVER
   *
   * Saved jobs, application status,
   * notes, dates and preferences
   * remain untouched.
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

      setSearchQuery('');

      setFilters({
        ...defaultJobFilters,
      });

      setAvailableJobs(
        scoredJobs
      );

      setSelectedJob(null);

      setDetailsOrigin(null);

      setActiveTab(
        'discover'
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
   * DETAILS SCREEN
   */

  if (selectedJob) {
    const isSavedJob =
      interestedJobs.some(
        (savedJob) =>
          savedJob.id ===
          selectedJob.id
      );

    return (
      <View
        style={styles.app}
      >
        <View
          style={styles.content}
        >
          <JobDetailsScreen
            job={
              selectedJob
            }

            onBack={
              closeJobDetails
            }

            onNotesChange={
              isSavedJob
                ? handleNotesChange
                : undefined
            }

            onTrackingChange={
              isSavedJob
                ? handleTrackingChange
                : undefined
            }
          />
        </View>

        <BottomNav
          activeTab={
            activeTab
          }

          onTabChange={(tab) => {
            setSelectedJob(
              null
            );

            setDetailsOrigin(
              null
            );

            setActiveTab(
              tab
            );
          }}
        />
      </View>
    );
  }

  /*
   * MAIN APP
   */

  return (
    <View
      style={styles.app}
    >
      <View
        style={styles.content}
      >
        {activeTab ===
          'discover' && (
          <JobFeedScreen
            job={job}

            interestedCount={
              interestedJobs.length
            }

            filters={
              filters
            }

            searchQuery={
              searchQuery
            }

            hasUnseenJobs={
              hasUnseenJobs
            }

            onSearchChange={
              setSearchQuery
            }

            onClearSearch={
              clearSearch
            }

            onFiltersChange={
              setFilters
            }

            onClearFilters={
              clearFilters
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

            onRestartFeed={
              restartFeed
            }
          />
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
        activeTab={
          activeTab
        }

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
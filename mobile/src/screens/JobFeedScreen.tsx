import {
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Job } from '../types/Job';

import {
  JobFilters,
} from '../types/JobFilters';

import JobCard from '../components/JobCard';

type JobFeedScreenProps = {
  job?: Job;

  interestedCount: number;

  filters: JobFilters;

  hasUnseenJobs: boolean;

  onFiltersChange: (
    filters: JobFilters
  ) => void;

  onClearFilters: () => void;

  onInterested: (
    job: Job
  ) => void;

  onSkipped: (
    job: Job
  ) => void;

  onViewInterested:
    () => void;

  onViewDetails: (
    job: Job
  ) => void;

  onViewApplications:
    () => void;

  onRestartFeed:
    () => void;
};

export default function JobFeedScreen({
  job,
  interestedCount,
  filters,
  hasUnseenJobs,
  onFiltersChange,
  onClearFilters,
  onInterested,
  onSkipped,
  onViewInterested,
  onViewDetails,
  onViewApplications,
  onRestartFeed,
}: JobFeedScreenProps) {
  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  const activeFilterCount = [
    filters.keyword.trim(),
    filters.location.trim(),
    filters.jobType.trim(),
    filters.source.trim(),
    filters.minimumMatchScore > 0
      ? 'score'
      : '',
  ].filter(Boolean).length;

  const hasActiveFilters =
    activeFilterCount > 0;

  function updateFilter<
    K extends keyof JobFilters
  >(
    key: K,
    value: JobFilters[K]
  ) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View
          style={styles.header}
        >
          <View>
            <Text
              style={styles.logo}
            >
              Job Copilot
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Find your next opportunity
            </Text>
          </View>

          <View
            style={
              styles.headerActions
            }
          >
            <Pressable
              style={
                styles.headerButton
              }
            >
              <Text
                style={
                  styles.headerIcon
                }
              >
                🔍
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.headerButton,
                showFilters &&
                  styles.activeHeaderButton,
              ]}
              onPress={() =>
                setShowFilters(
                  (current) =>
                    !current
                )
              }
            >
              <Text
                style={
                  styles.headerIcon
                }
              >
                ⚙
              </Text>

              {activeFilterCount >
                0 && (
                <View
                  style={
                    styles.filterBadge
                  }
                >
                  <Text
                    style={
                      styles.filterBadgeText
                    }
                  >
                    {
                      activeFilterCount
                    }
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* FILTER PANEL */}

        {showFilters && (
          <View
            style={
              styles.filterPanel
            }
          >
            <View
              style={
                styles.filterHeader
              }
            >
              <View
                style={
                  styles.filterHeaderText
                }
              >
                <Text
                  style={
                    styles.filterTitle
                  }
                >
                  Job filters
                </Text>

                <Text
                  style={
                    styles.filterSubtitle
                  }
                >
                  Narrow your Discover feed
                </Text>
              </View>

              {hasActiveFilters && (
                <Pressable
                  onPress={
                    onClearFilters
                  }
                >
                  <Text
                    style={
                      styles.clearText
                    }
                  >
                    Clear
                  </Text>
                </Pressable>
              )}
            </View>

            <Text
              style={
                styles.fieldLabel
              }
            >
              Keyword
            </Text>

            <TextInput
              value={
                filters.keyword
              }
              onChangeText={(value) =>
                updateFilter(
                  'keyword',
                  value
                )
              }
              placeholder="React, frontend, software..."
              placeholderTextColor="#666E82"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text
              style={
                styles.fieldLabel
              }
            >
              Location
            </Text>

            <TextInput
              value={
                filters.location
              }
              onChangeText={(value) =>
                updateFilter(
                  'location',
                  value
                )
              }
              placeholder="Singapore"
              placeholderTextColor="#666E82"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text
              style={
                styles.fieldLabel
              }
            >
              Job type
            </Text>

            <TextInput
              value={
                filters.jobType
              }
              onChangeText={(value) =>
                updateFilter(
                  'jobType',
                  value
                )
              }
              placeholder="Full-time, internship..."
              placeholderTextColor="#666E82"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text
              style={
                styles.fieldLabel
              }
            >
              Source
            </Text>

            <TextInput
              value={
                filters.source
              }
              onChangeText={(value) =>
                updateFilter(
                  'source',
                  value
                )
              }
              placeholder="LinkedIn, company..."
              placeholderTextColor="#666E82"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text
              style={
                styles.fieldLabel
              }
            >
              Minimum match
            </Text>

            <View
              style={
                styles.scoreOptions
              }
            >
              {[
                0,
                50,
                70,
                80,
              ].map(
                (score) => {
                  const selected =
                    filters
                      .minimumMatchScore ===
                    score;

                  return (
                    <Pressable
                      key={score}
                      style={[
                        styles.scoreChip,
                        selected &&
                          styles.selectedScoreChip,
                      ]}
                      onPress={() =>
                        updateFilter(
                          'minimumMatchScore',
                          score
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.scoreChipText,
                          selected &&
                            styles.selectedScoreChipText,
                        ]}
                      >
                        {score === 0
                          ? 'Any'
                          : `${score}%+`}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* TOP TABS */}

        <View
          style={styles.topTabs}
        >
          <View
            style={
              styles.activeTab
            }
          >
            <Text
              style={
                styles.activeTabText
              }
            >
              Discover
            </Text>
          </View>

          <Pressable
            style={
              styles.inactiveTab
            }
            onPress={
              onViewApplications
            }
          >
            <Text
              style={
                styles.inactiveTabText
              }
            >
              Applications
            </Text>
          </Pressable>
        </View>

        {/* SECTION HEADER */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <View
            style={
              styles.sectionTitleContainer
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Recommended for you
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Based on your skills and
              preferences
            </Text>
          </View>

          <View
            style={
              styles.matchCounter
            }
          >
            <Text
              style={
                styles.matchCounterText
              }
            >
              {interestedCount} saved
            </Text>
          </View>
        </View>

        {/* JOB EXISTS */}

        {job ? (
          <>
            <JobCard
              key={job.id}
              job={job}
              onInterested={
                onInterested
              }
              onSkipped={
                onSkipped
              }
            />

            <Pressable
              style={
                styles.detailsButton
              }
              onPress={() =>
                onViewDetails(job)
              }
            >
              <Text
                style={
                  styles.detailsText
                }
              >
                See details
              </Text>

              <Text
                style={
                  styles.detailsArrow
                }
              >
                ›
              </Text>
            </Pressable>

            <View
              style={
                styles.swipeActions
              }
            >
              <Pressable
                style={[
                  styles.actionButton,
                  styles.passButton,
                ]}
                onPress={() =>
                  onSkipped(job)
                }
              >
                <Text
                  style={
                    styles.passIcon
                  }
                >
                  ×
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  styles.interestedButton,
                ]}
                onPress={() =>
                  onInterested(job)
                }
              >
                <Text
                  style={
                    styles.interestedIcon
                  }
                >
                  ♥
                </Text>
              </Pressable>
            </View>

            <View
              style={
                styles.actionLabels
              }
            >
              <Text
                style={
                  styles.actionLabel
                }
              >
                Pass
              </Text>

              <Text
                style={
                  styles.actionLabel
                }
              >
                Interested
              </Text>
            </View>
          </>
        ) : hasUnseenJobs &&
          hasActiveFilters ? (
          /*
           * FILTERS RETURNED ZERO RESULTS
           */

          <View
            style={
              styles.emptyCard
            }
          >
            <Text
              style={
                styles.emptyIcon
              }
            >
              🔍
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No jobs match your filters
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              There are still jobs in
              your Discover feed, but
              none match the filters
              you've selected.
            </Text>

            <Pressable
              style={
                styles.primaryButton
              }
              onPress={
                onClearFilters
              }
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Clear filters
              </Text>
            </Pressable>
          </View>
        ) : (
          /*
           * ACTUALLY EXHAUSTED FEED
           */

          <View
            style={
              styles.emptyCard
            }
          >
            <Text
              style={
                styles.emptyIcon
              }
            >
              ✓
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              You've seen all jobs
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              You've reached the end of
              your current Discover feed.
              Restart it to review the
              available jobs again.
            </Text>

            <Pressable
              style={
                styles.primaryButton
              }
              onPress={
                onRestartFeed
              }
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Restart feed
              </Text>
            </Pressable>
          </View>
        )}

        {/* SAVED JOBS */}

        <Pressable
          style={
            styles.savedButton
          }
          onPress={
            onViewInterested
          }
        >
          <Text
            style={
              styles.savedButtonText
            }
          >
            View {interestedCount}{' '}
            {interestedCount === 1
              ? 'match'
              : 'matches'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#080D1A',
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 22,
      paddingBottom: 28,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 24,
    },

    logo: {
      color: '#FFFFFF',
      fontSize: 27,
      fontWeight: '800',
    },

    subtitle: {
      color: '#8B91A5',
      fontSize: 13,
      marginTop: 3,
    },

    headerActions: {
      flexDirection: 'row',
      gap: 10,
    },

    headerButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor:
        '#151B2B',
      alignItems: 'center',
      justifyContent: 'center',
    },

    activeHeaderButton: {
      borderWidth: 1,
      borderColor: '#8B5CF6',
      backgroundColor:
        '#211A3D',
    },

    headerIcon: {
      fontSize: 17,
    },

    filterBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#8B5CF6',
    },

    filterBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '800',
    },

    filterPanel: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 18,
      padding: 16,
      marginBottom: 22,
    },

    filterHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },

    filterHeaderText: {
      flex: 1,
      paddingRight: 12,
    },

    filterTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },

    filterSubtitle: {
      color: '#858CA0',
      fontSize: 12,
      marginTop: 3,
    },

    clearText: {
      color: '#A78BFA',
      fontSize: 13,
      fontWeight: '700',
    },

    fieldLabel: {
      color: '#D7DAE4',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 15,
      marginBottom: 7,
    },

    input: {
      minHeight: 46,
      backgroundColor:
        '#080D1A',
      borderWidth: 1,
      borderColor:
        '#2A3247',
      borderRadius: 12,
      paddingHorizontal: 13,
      color: '#FFFFFF',
      fontSize: 13,
    },

    scoreOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    scoreChip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor:
        '#181F31',
      borderWidth: 1,
      borderColor:
        '#2A3247',
    },

    selectedScoreChip: {
      backgroundColor:
        '#2A2050',
      borderColor:
        '#8B5CF6',
    },

    scoreChipText: {
      color: '#9299AC',
      fontSize: 12,
      fontWeight: '600',
    },

    selectedScoreChipText: {
      color: '#C4B5FD',
    },

    topTabs: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor:
        '#20263A',
      marginBottom: 24,
    },

    activeTab: {
      paddingHorizontal: 6,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor:
        '#8B5CF6',
      marginRight: 26,
    },

    inactiveTab: {
      paddingHorizontal: 6,
      paddingBottom: 12,
    },

    activeTabText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    inactiveTabText: {
      color: '#7F879B',
      fontSize: 15,
      fontWeight: '600',
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },

    sectionTitleContainer: {
      flex: 1,
      paddingRight: 12,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
    },

    sectionSubtitle: {
      color: '#858CA0',
      fontSize: 12,
      marginTop: 4,
    },

    matchCounter: {
      backgroundColor:
        '#171D2D',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },

    matchCounterText: {
      color: '#A78BFA',
      fontSize: 11,
      fontWeight: '700',
    },

    detailsButton: {
      marginTop: -10,
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    detailsText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },

    detailsArrow: {
      color: '#8B5CF6',
      fontSize: 24,
    },

    swipeActions: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 70,
      marginTop: 24,
    },

    actionButton: {
      width: 62,
      height: 62,
      borderRadius: 31,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },

    passButton: {
      backgroundColor:
        '#151B2B',
      borderColor:
        '#343B50',
    },

    interestedButton: {
      backgroundColor:
        '#8B5CF6',
      borderColor:
        '#A78BFA',
    },

    passIcon: {
      color: '#FFFFFF',
      fontSize: 35,
      fontWeight: '300',
      lineHeight: 38,
    },

    interestedIcon: {
      color: '#FFFFFF',
      fontSize: 26,
    },

    actionLabels: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 78,
      marginTop: 7,
    },

    actionLabel: {
      width: 60,
      textAlign: 'center',
      color: '#858CA0',
      fontSize: 12,
      fontWeight: '600',
    },

    emptyCard: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 18,
      paddingHorizontal: 24,
      paddingVertical: 34,
      alignItems: 'center',
    },

    emptyIcon: {
      fontSize: 34,
      marginBottom: 14,
    },

    emptyTitle: {
      color: '#FFFFFF',
      fontSize: 19,
      fontWeight: '700',
      textAlign: 'center',
    },

    emptyDescription: {
      color: '#858CA0',
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
      marginTop: 8,
      maxWidth: 300,
    },

    primaryButton: {
      marginTop: 20,
      backgroundColor:
        '#8B5CF6',
      paddingHorizontal: 22,
      paddingVertical: 13,
      borderRadius: 12,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },

    savedButton: {
      alignSelf: 'center',
      marginTop: 24,
      paddingVertical: 10,
      paddingHorizontal: 18,
    },

    savedButtonText: {
      color: '#A78BFA',
      fontSize: 13,
      fontWeight: '700',
    },
  });
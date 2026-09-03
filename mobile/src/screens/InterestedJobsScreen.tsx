import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ApplicationStatus,
  Job,
} from '../types/Job';

type InterestedJobsScreenProps = {
  interestedJobs: Job[];
  onBack: () => void;
  onViewDetails: (job: Job) => void;
  onStatusChange: (
    jobId: string,
    status: ApplicationStatus
  ) => void;
};

function formatStatus(
  status?: ApplicationStatus
) {
  if (!status) {
    return 'Interested';
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function getStatusStyle(
  status?: ApplicationStatus
) {
  switch (status) {
    case 'applied':
      return styles.statusApplied;

    case 'interview':
      return styles.statusInterview;

    case 'offer':
      return styles.statusOffer;

    case 'rejected':
      return styles.statusRejected;

    default:
      return styles.statusInterested;
  }
}

export default function InterestedJobsScreen({
  interestedJobs,
  onBack,
  onViewDetails,
  onStatusChange,
}: InterestedJobsScreenProps) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            JOB COPILOT
          </Text>

          <Text style={styles.heading}>
            Matches
          </Text>

          <Text style={styles.subtitle}>
            Jobs you marked as
            interesting
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text
            style={
              styles.countBadgeText
            }
          >
            {interestedJobs.length}
          </Text>
        </View>
      </View>

      {interestedJobs.length ===
      0 ? (
        <View
          style={
            styles.emptyState
          }
        >
          <View
            style={
              styles.emptyIcon
            }
          >
            <Text
              style={
                styles.emptyIconText
              }
            >
              ♡
            </Text>
          </View>

          <Text
            style={
              styles.emptyTitle
            }
          >
            No matches yet
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Swipe right on jobs
            you like and they will
            appear here.
          </Text>

          <Pressable
            style={
              styles.discoverButton
            }
            onPress={onBack}
          >
            <Text
              style={
                styles.discoverButtonText
              }
            >
              Start discovering
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Your matches
            </Text>

            <Text
              style={
                styles.sectionCount
              }
            >
              {
                interestedJobs.length
              }{' '}
              saved
            </Text>
          </View>

          {interestedJobs.map(
            (job) => {
              const status =
                job.applicationStatus ??
                'interested';

              return (
                <View
                  key={job.id}
                  style={
                    styles.jobCard
                  }
                >
                  <Pressable
                    onPress={() =>
                      onViewDetails(
                        job
                      )
                    }
                  >
                    <View
                      style={
                        styles.cardTopRow
                      }
                    >
                      <View
                        style={
                          styles.companyIcon
                        }
                      >
                        <Text
                          style={
                            styles.companyInitial
                          }
                        >
                          {job.company
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.cardHeading
                        }
                      >
                        <Text
                          style={
                            styles.jobTitle
                          }
                          numberOfLines={
                            2
                          }
                        >
                          {
                            job.title
                          }
                        </Text>

                        <Text
                          style={
                            styles.company
                          }
                          numberOfLines={
                            1
                          }
                        >
                          {
                            job.company
                          }
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.metaRow
                      }
                    >
                      <Text
                        style={
                          styles.metaIcon
                        }
                      >
                        ◉
                      </Text>

                      <Text
                        style={
                          styles.metaText
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {
                          job.location
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.metaRow
                      }
                    >
                      <Text
                        style={
                          styles.metaIcon
                        }
                      >
                        ◷
                      </Text>

                      <Text
                        style={
                          styles.metaText
                        }
                      >
                        {job.type}
                      </Text>
                    </View>

                    {job.salary && (
                      <Text
                        style={
                          styles.salary
                        }
                      >
                        {
                          job.salary
                        }
                      </Text>
                    )}

                    {job.skills &&
                      job.skills.length >
                        0 && (
                        <View
                          style={
                            styles.skills
                          }
                        >
                          {job.skills
                            .slice(
                              0,
                              3
                            )
                            .map(
                              (
                                skill
                              ) => (
                                <View
                                  key={
                                    skill
                                  }
                                  style={
                                    styles.skillChip
                                  }
                                >
                                  <Text
                                    style={
                                      styles.skillText
                                    }
                                  >
                                    {
                                      skill
                                    }
                                  </Text>
                                </View>
                              )
                            )}
                        </View>
                      )}

                    <View
                      style={
                        styles.divider
                      }
                    />

                    <View
                      style={
                        styles.cardFooter
                      }
                    >
                      <View
                        style={[
                          styles.statusBadge,
                          getStatusStyle(
                            status
                          ),
                        ]}
                      >
                        <Text
                          style={
                            styles.statusText
                          }
                        >
                          {formatStatus(
                            status
                          )}
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.detailsLink
                        }
                      >
                        View details
                        {'  '}›
                      </Text>
                    </View>
                  </Pressable>

                  <View
                    style={
                      styles.statusSection
                    }
                  >
                    <Text
                      style={
                        styles.statusLabel
                      }
                    >
                      Update status
                    </Text>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={
                        false
                      }
                      contentContainerStyle={
                        styles.statusActions
                      }
                    >
                      <StatusButton
                        label="Interested"
                        active={
                          status ===
                          'interested'
                        }
                        onPress={() =>
                          onStatusChange(
                            job.id,
                            'interested'
                          )
                        }
                      />

                      <StatusButton
                        label="Applied"
                        active={
                          status ===
                          'applied'
                        }
                        onPress={() =>
                          onStatusChange(
                            job.id,
                            'applied'
                          )
                        }
                      />

                      <StatusButton
                        label="Interview"
                        active={
                          status ===
                          'interview'
                        }
                        onPress={() =>
                          onStatusChange(
                            job.id,
                            'interview'
                          )
                        }
                      />

                      <StatusButton
                        label="Offer"
                        active={
                          status ===
                          'offer'
                        }
                        onPress={() =>
                          onStatusChange(
                            job.id,
                            'offer'
                          )
                        }
                      />

                      <StatusButton
                        label="Rejected"
                        active={
                          status ===
                          'rejected'
                        }
                        onPress={() =>
                          onStatusChange(
                            job.id,
                            'rejected'
                          )
                        }
                      />
                    </ScrollView>
                  </View>
                </View>
              );
            }
          )}
        </>
      )}
    </ScrollView>
  );
}

type StatusButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function StatusButton({
  label,
  active,
  onPress,
}: StatusButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.statusButton,
        active &&
          styles.statusButtonActive,
      ]}
    >
      <Text
        style={[
          styles.statusButtonText,
          active &&
            styles.statusButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        '#080D1A',
    },

    container: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
    },

    header: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 28,
    },

    eyebrow: {
      color: '#8B5CF6',
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.4,
      marginBottom: 5,
    },

    heading: {
      color: '#FFFFFF',
      fontSize: 30,
      fontWeight: '800',
    },

    subtitle: {
      color: '#858CA0',
      fontSize: 13,
      marginTop: 4,
    },

    countBadge: {
      minWidth: 42,
      height: 42,
      borderRadius: 21,
      paddingHorizontal: 10,
      backgroundColor:
        '#191F30',
      alignItems: 'center',
      justifyContent:
        'center',
      borderWidth: 1,
      borderColor:
        '#2A3146',
    },

    countBadgeText: {
      color: '#A78BFA',
      fontSize: 16,
      fontWeight: '800',
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },

    sectionCount: {
      color: '#7F879B',
      fontSize: 12,
      fontWeight: '600',
    },

    jobCard: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 20,
      padding: 17,
      marginBottom: 16,
    },

    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },

    companyIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor:
        '#242040',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 12,
    },

    companyInitial: {
      color: '#A78BFA',
      fontSize: 17,
      fontWeight: '800',
    },

    cardHeading: {
      flex: 1,
    },

    jobTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '700',
    },

    company: {
      color: '#979EB1',
      fontSize: 13,
      marginTop: 3,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 7,
    },

    metaIcon: {
      width: 23,
      color: '#8B5CF6',
      fontSize: 12,
    },

    metaText: {
      flex: 1,
      color: '#A1A8BA',
      fontSize: 12,
    },

    salary: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
      marginTop: 6,
    },

    skills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 14,
    },

    skillChip: {
      backgroundColor:
        '#1A2031',
      borderWidth: 1,
      borderColor:
        '#30374C',
      borderRadius: 8,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },

    skillText: {
      color: '#C3C8D5',
      fontSize: 10,
      fontWeight: '600',
    },

    divider: {
      height: 1,
      backgroundColor:
        '#252C40',
      marginVertical: 15,
    },

    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    statusBadge: {
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    statusInterested: {
      backgroundColor:
        '#2B214B',
    },

    statusApplied: {
      backgroundColor:
        '#1E3351',
    },

    statusInterview: {
      backgroundColor:
        '#45351C',
    },

    statusOffer: {
      backgroundColor:
        '#153B31',
    },

    statusRejected: {
      backgroundColor:
        '#42232B',
    },

    statusText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },

    detailsLink: {
      color: '#A78BFA',
      fontSize: 12,
      fontWeight: '700',
    },

    statusSection: {
      marginTop: 17,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor:
        '#252C40',
    },

    statusLabel: {
      color: '#777F92',
      fontSize: 10,
      fontWeight: '700',
      textTransform:
        'uppercase',
      letterSpacing: 0.7,
      marginBottom: 9,
    },

    statusActions: {
      gap: 7,
      paddingRight: 4,
    },

    statusButton: {
      borderRadius: 10,
      backgroundColor:
        '#171D2D',
      borderWidth: 1,
      borderColor:
        '#2D354A',
      paddingHorizontal: 11,
      paddingVertical: 7,
    },

    statusButtonActive: {
      backgroundColor:
        '#7C3AED',
      borderColor:
        '#8B5CF6',
    },

    statusButtonText: {
      color: '#A0A7B9',
      fontSize: 10,
      fontWeight: '700',
    },

    statusButtonTextActive: {
      color: '#FFFFFF',
    },

    emptyState: {
      flex: 1,
      minHeight: 440,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 30,
    },

    emptyIcon: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor:
        '#171D2D',
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 18,
      borderWidth: 1,
      borderColor:
        '#292F44',
    },

    emptyIconText: {
      color: '#A78BFA',
      fontSize: 34,
    },

    emptyTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 7,
    },

    emptyText: {
      color: '#858CA0',
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: 20,
    },

    discoverButton: {
      backgroundColor:
        '#7C3AED',
      paddingHorizontal: 19,
      paddingVertical: 12,
      borderRadius: 12,
    },

    discoverButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
  });
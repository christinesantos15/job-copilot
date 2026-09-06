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

type ApplicationsScreenProps = {
  jobs: Job[];
  onBack: () => void;
  onViewDetails: (job: Job) => void;
};

type ApplicationSectionProps = {
  title: string;
  subtitle: string;
  jobs: Job[];
  status: ApplicationStatus;
  onViewDetails: (job: Job) => void;
};

type DateState =
  | 'overdue'
  | 'today'
  | 'upcoming'
  | 'none';

/*
 * DATE HELPERS
 */

function parseDate(
  value?: string
) {
  if (!value) {
    return null;
  }

  const datePart =
    value.trim().split(' ')[0];

  const parts =
    datePart.split('-');

  if (parts.length !== 3) {
    return null;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    date.getFullYear() !==
      year ||
    date.getMonth() !==
      month - 1 ||
    date.getDate() !==
      day
  ) {
    return null;
  }

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
}

function getToday() {
  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return today;
}

function getDateState(
  value?: string
): DateState {
  const date =
    parseDate(value);

  if (!date) {
    return 'none';
  }

  const today =
    getToday();

  if (
    date.getTime() <
    today.getTime()
  ) {
    return 'overdue';
  }

  if (
    date.getTime() ===
    today.getTime()
  ) {
    return 'today';
  }

  return 'upcoming';
}

function formatDate(
  value?: string
) {
  const date =
    parseDate(value);

  if (!date) {
    return value || '';
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
}

function formatInterviewDate(
  value?: string
) {
  if (!value) {
    return '';
  }

  const [
    datePart,
    timePart,
  ] = value
    .trim()
    .split(' ');

  const formattedDate =
    formatDate(datePart);

  if (!timePart) {
    return formattedDate;
  }

  return `${formattedDate} · ${timePart}`;
}

function formatStatus(
  status: ApplicationStatus
) {
  return (
    status
      .charAt(0)
      .toUpperCase() +
    status.slice(1)
  );
}

function getStatusBadgeStyle(
  status: ApplicationStatus
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
      return styles.statusApplied;
  }
}

function sortByDate(
  jobs: Job[],
  getDate: (
    job: Job
  ) => string | undefined
) {
  return [...jobs].sort(
    (a, b) => {
      const aDate =
        parseDate(
          getDate(a)
        );

      const bDate =
        parseDate(
          getDate(b)
        );

      if (
        aDate &&
        bDate
      ) {
        return (
          aDate.getTime() -
          bDate.getTime()
        );
      }

      if (aDate) {
        return -1;
      }

      if (bDate) {
        return 1;
      }

      return 0;
    }
  );
}

/*
 * FOLLOW-UP BADGE
 */

function FollowUpBadge({
  date,
}: {
  date: string;
}) {
  const state =
    getDateState(date);

  let label =
    formatDate(date);

  if (
    state === 'overdue'
  ) {
    label =
      `Overdue · ${label}`;
  }

  if (
    state === 'today'
  ) {
    label =
      `Today · ${label}`;
  }

  return (
    <View
      style={[
        styles.followUpBadge,

        state ===
          'overdue' &&
          styles.followUpOverdue,

        state ===
          'today' &&
          styles.followUpToday,
      ]}
    >
      <Text
        style={
          styles.followUpBadgeText
        }
      >
        {label}
      </Text>
    </View>
  );
}

/*
 * APPLICATION CARD
 */

function DashboardJobCard({
  job,
  status,
  onViewDetails,
}: {
  job: Job;
  status: ApplicationStatus;
  onViewDetails: (
    job: Job
  ) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.jobCard,

        pressed &&
          styles.jobCardPressed,
      ]}
      onPress={() =>
        onViewDetails(job)
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
            numberOfLines={2}
          >
            {job.title}
          </Text>

          <Text
            style={
              styles.company
            }
            numberOfLines={1}
          >
            {job.company}
          </Text>
        </View>

        <Text
          style={
            styles.cardArrow
          }
        >
          ›
        </Text>
      </View>

      <View
        style={styles.metaRow}
      >
        <Text
          style={styles.metaIcon}
        >
          ◉
        </Text>

        <Text
          style={styles.metaText}
          numberOfLines={1}
        >
          {job.location}
        </Text>
      </View>

      <View
        style={styles.metaRow}
      >
        <Text
          style={styles.metaIcon}
        >
          ◷
        </Text>

        <Text
          style={styles.metaText}
        >
          {job.type}
        </Text>
      </View>

      {job.salary && (
        <Text
          style={styles.salary}
        >
          {job.salary}
        </Text>
      )}

      {(job.appliedDate ||
        job.interviewDate ||
        job.followUpDate) && (
        <View
          style={
            styles.timelinePreview
          }
        >
          {job.appliedDate && (
            <View
              style={
                styles.timelineRow
              }
            >
              <Text
                style={
                  styles.timelineLabel
                }
              >
                Applied
              </Text>

              <Text
                style={
                  styles.timelineValue
                }
              >
                {formatDate(
                  job.appliedDate
                )}
              </Text>
            </View>
          )}

          {job.interviewDate && (
            <View
              style={
                styles.timelineRow
              }
            >
              <Text
                style={
                  styles.timelineLabel
                }
              >
                Interview
              </Text>

              <Text
                style={
                  styles.timelineValue
                }
              >
                {formatInterviewDate(
                  job.interviewDate
                )}
              </Text>
            </View>
          )}

          {job.followUpDate && (
            <View
              style={
                styles.timelineRow
              }
            >
              <Text
                style={
                  styles.timelineLabel
                }
              >
                Follow up
              </Text>

              <FollowUpBadge
                date={
                  job.followUpDate
                }
              />
            </View>
          )}
        </View>
      )}

      {job.notes &&
        job.notes
          .trim()
          .length > 0 && (
          <View
            style={
              styles.notePreview
            }
          >
            <Text
              style={
                styles.noteIcon
              }
            >
              ✎
            </Text>

            <Text
              style={
                styles.noteText
              }
              numberOfLines={2}
            >
              {job.notes}
            </Text>
          </View>
        )}

      <View
        style={styles.divider}
      />

      <View
        style={styles.footerRow}
      >
        <View
          style={[
            styles.statusPill,
            getStatusBadgeStyle(
              status
            ),
          ]}
        >
          <Text
            style={
              styles.statusPillText
            }
          >
            {formatStatus(
              status
            )}
          </Text>
        </View>

        <Text
          style={styles.source}
        >
          {job.sourceLabel ??
            job.source}
        </Text>
      </View>
    </Pressable>
  );
}

/*
 * PIPELINE SECTION
 */

function ApplicationSection({
  title,
  subtitle,
  jobs,
  status,
  onViewDetails,
}: ApplicationSectionProps) {
  return (
    <View
      style={styles.section}
    >
      <View
        style={
          styles.sectionHeader
        }
      >
        <View
          style={
            styles.sectionHeaderText
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            {title}
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            {subtitle}
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            getStatusBadgeStyle(
              status
            ),
          ]}
        >
          <Text
            style={
              styles.countText
            }
          >
            {jobs.length}
          </Text>
        </View>
      </View>

      {jobs.length === 0 ? (
        <View
          style={
            styles.emptySection
          }
        >
          <Text
            style={
              styles.emptySectionText
            }
          >
            No jobs here yet
          </Text>
        </View>
      ) : (
        jobs.map((job) => (
          <DashboardJobCard
            key={job.id}
            job={job}
            status={status}
            onViewDetails={
              onViewDetails
            }
          />
        ))
      )}
    </View>
  );
}

/*
 * SCREEN
 */

export default function ApplicationsScreen({
  jobs,
  onViewDetails,
}: ApplicationsScreenProps) {
  function getJobsByStatus(
    status: ApplicationStatus
  ) {
    return jobs.filter(
      (job) =>
        job.applicationStatus ===
        status
    );
  }

  const appliedJobs =
    getJobsByStatus(
      'applied'
    );

  const interviewJobs =
    getJobsByStatus(
      'interview'
    );

  const offerJobs =
    getJobsByStatus(
      'offer'
    );

  const rejectedJobs =
    getJobsByStatus(
      'rejected'
    );

  const totalApplications =
    appliedJobs.length +
    interviewJobs.length +
    offerJobs.length +
    rejectedJobs.length;

  /*
   * UPCOMING INTERVIEWS
   */

  const upcomingInterviews =
    sortByDate(
      jobs.filter(
        (job) => {
          if (
            !job.interviewDate
          ) {
            return false;
          }

          const state =
            getDateState(
              job.interviewDate
            );

          return (
            state === 'today' ||
            state === 'upcoming'
          );
        }
      ),
      (job) =>
        job.interviewDate
    );

  /*
   * FOLLOW UPS
   */

  const followUps =
    sortByDate(
      jobs.filter(
        (job) => {
          if (
            !job.followUpDate
          ) {
            return false;
          }

          return (
            job.applicationStatus !==
            'rejected'
          );
        }
      ),
      (job) =>
        job.followUpDate
    );

  const overdueFollowUps =
    followUps.filter(
      (job) =>
        getDateState(
          job.followUpDate
        ) === 'overdue'
    ).length;

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
      {/* HEADER */}

      <View
        style={styles.header}
      >
        <Text
          style={styles.eyebrow}
        >
          JOB COPILOT
        </Text>

        <Text
          style={styles.heading}
        >
          Applications
        </Text>

        <Text
          style={styles.subtitle}
        >
          Track your job search
          progress and next actions
        </Text>
      </View>

      {/* SUMMARY */}

      <View
        style={
          styles.summaryCard
        }
      >
        <View>
          <Text
            style={
              styles.summaryLabel
            }
          >
            Active pipeline
          </Text>

          <Text
            style={
              styles.summaryNumber
            }
          >
            {totalApplications}
          </Text>

          <Text
            style={
              styles.summaryText
            }
          >
            applications being
            tracked
          </Text>
        </View>

        <View
          style={
            styles.summaryIcon
          }
        >
          <Text
            style={
              styles.summaryIconText
            }
          >
            ▣
          </Text>
        </View>
      </View>

      {/* ACTION COUNTS */}

      <View
        style={
          styles.actionSummary
        }
      >
        <View
          style={
            styles.actionSummaryItem
          }
        >
          <Text
            style={
              styles.actionSummaryNumber
            }
          >
            {
              upcomingInterviews.length
            }
          </Text>

          <Text
            style={
              styles.actionSummaryLabel
            }
          >
            Upcoming{'\n'}
            interviews
          </Text>
        </View>

        <View
          style={
            styles.actionSummaryDivider
          }
        />

        <View
          style={
            styles.actionSummaryItem
          }
        >
          <Text
            style={
              styles.actionSummaryNumber
            }
          >
            {followUps.length}
          </Text>

          <Text
            style={
              styles.actionSummaryLabel
            }
          >
            Follow-ups
          </Text>
        </View>

        <View
          style={
            styles.actionSummaryDivider
          }
        />

        <View
          style={
            styles.actionSummaryItem
          }
        >
          <Text
            style={[
              styles.actionSummaryNumber,

              overdueFollowUps >
                0 &&
                styles.overdueNumber,
            ]}
          >
            {overdueFollowUps}
          </Text>

          <Text
            style={
              styles.actionSummaryLabel
            }
          >
            Overdue
          </Text>
        </View>
      </View>

      {/* FOLLOW UPS */}

      {followUps.length > 0 && (
        <View
          style={styles.section}
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <View
              style={
                styles.sectionHeaderText
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Follow-ups
              </Text>

              <Text
                style={
                  styles.sectionSubtitle
                }
              >
                Applications needing
                your attention
              </Text>
            </View>

            <View
              style={
                styles.priorityBadge
              }
            >
              <Text
                style={
                  styles.priorityBadgeText
                }
              >
                {
                  followUps.length
                }
              </Text>
            </View>
          </View>

          {followUps.map(
            (job) => (
              <Pressable
                key={job.id}
                style={({ pressed }) => [
                  styles.actionCard,

                  pressed &&
                    styles.jobCardPressed,
                ]}
                onPress={() =>
                  onViewDetails(
                    job
                  )
                }
              >
                <View
                  style={
                    styles.actionCardTop
                  }
                >
                  <View
                    style={
                      styles.actionCardText
                    }
                  >
                    <Text
                      style={
                        styles.actionJobTitle
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {job.title}
                    </Text>

                    <Text
                      style={
                        styles.actionCompany
                      }
                      numberOfLines={
                        1
                      }
                    >
                      {job.company}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.cardArrow
                    }
                  >
                    ›
                  </Text>
                </View>

                <View
                  style={
                    styles.actionBadgeRow
                  }
                >
                  <FollowUpBadge
                    date={
                      job.followUpDate!
                    }
                  />
                </View>
              </Pressable>
            )
          )}
        </View>
      )}

      {/* UPCOMING INTERVIEWS */}

      {upcomingInterviews.length >
        0 && (
        <View
          style={styles.section}
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <View
              style={
                styles.sectionHeaderText
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Upcoming interviews
              </Text>

              <Text
                style={
                  styles.sectionSubtitle
                }
              >
                Prepare for what is
                coming next
              </Text>
            </View>

            <View
              style={
                styles.interviewCountBadge
              }
            >
              <Text
                style={
                  styles.countText
                }
              >
                {
                  upcomingInterviews.length
                }
              </Text>
            </View>
          </View>

          {upcomingInterviews.map(
            (job) => (
              <Pressable
                key={job.id}
                style={({ pressed }) => [
                  styles.interviewCard,

                  pressed &&
                    styles.jobCardPressed,
                ]}
                onPress={() =>
                  onViewDetails(
                    job
                  )
                }
              >
                <View
                  style={
                    styles.interviewIcon
                  }
                >
                  <Text
                    style={
                      styles.interviewIconText
                    }
                  >
                    ◷
                  </Text>
                </View>

                <View
                  style={
                    styles.interviewInfo
                  }
                >
                  <Text
                    style={
                      styles.actionJobTitle
                    }
                    numberOfLines={
                      1
                    }
                  >
                    {job.title}
                  </Text>

                  <Text
                    style={
                      styles.actionCompany
                    }
                    numberOfLines={
                      1
                    }
                  >
                    {job.company}
                  </Text>

                  <Text
                    style={
                      styles.interviewDateText
                    }
                  >
                    {formatInterviewDate(
                      job.interviewDate
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.cardArrow
                  }
                >
                  ›
                </Text>
              </Pressable>
            )
          )}
        </View>
      )}

      {/* PIPELINE */}

      <Text
        style={
          styles.pipelineHeading
        }
      >
        Pipeline
      </Text>

      <ApplicationSection
        title="Applied"
        subtitle="Applications sent"
        jobs={appliedJobs}
        status="applied"
        onViewDetails={
          onViewDetails
        }
      />

      <ApplicationSection
        title="Interview"
        subtitle="Interview stage"
        jobs={interviewJobs}
        status="interview"
        onViewDetails={
          onViewDetails
        }
      />

      <ApplicationSection
        title="Offers"
        subtitle="Offers received"
        jobs={offerJobs}
        status="offer"
        onViewDetails={
          onViewDetails
        }
      />

      <ApplicationSection
        title="Rejected"
        subtitle="Closed applications"
        jobs={rejectedJobs}
        status="rejected"
        onViewDetails={
          onViewDetails
        }
      />
    </ScrollView>
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
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
    },

    header: {
      marginBottom: 24,
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
      lineHeight: 19,
    },

    /*
     * SUMMARY
     */

    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 20,
      padding: 18,
      marginBottom: 12,
    },

    summaryLabel: {
      color: '#9A82F4',
      fontSize: 11,
      fontWeight: '800',
      textTransform:
        'uppercase',
      letterSpacing: 0.8,
    },

    summaryNumber: {
      color: '#FFFFFF',
      fontSize: 34,
      fontWeight: '900',
      marginTop: 3,
    },

    summaryText: {
      color: '#858CA0',
      fontSize: 12,
      marginTop: 2,
    },

    summaryIcon: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor:
        '#251D43',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    summaryIconText: {
      color: '#A78BFA',
      fontSize: 25,
    },

    actionSummary: {
      flexDirection: 'row',
      backgroundColor:
        '#0F1523',
      borderWidth: 1,
      borderColor:
        '#20273A',
      borderRadius: 16,
      marginBottom: 28,
      paddingVertical: 14,
    },

    actionSummaryItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 4,
    },

    actionSummaryDivider: {
      width: 1,
      backgroundColor:
        '#252C40',
    },

    actionSummaryNumber: {
      color: '#FFFFFF',
      fontSize: 19,
      fontWeight: '900',
    },

    overdueNumber: {
      color: '#FCA5A5',
    },

    actionSummaryLabel: {
      color: '#747C8F',
      fontSize: 9,
      lineHeight: 13,
      textAlign: 'center',
      marginTop: 3,
    },

    /*
     * SECTIONS
     */

    pipelineHeading: {
      color: '#FFFFFF',
      fontSize: 21,
      fontWeight: '900',
      marginBottom: 18,
      marginTop: 2,
    },

    section: {
      marginBottom: 26,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },

    sectionHeaderText: {
      flex: 1,
      paddingRight: 12,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
    },

    sectionSubtitle: {
      color: '#747C8F',
      fontSize: 11,
      marginTop: 3,
    },

    countBadge: {
      minWidth: 34,
      height: 28,
      borderRadius: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    countText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
    },

    priorityBadge: {
      minWidth: 34,
      height: 28,
      borderRadius: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        '#42232B',
    },

    priorityBadgeText: {
      color: '#FCA5A5',
      fontSize: 12,
      fontWeight: '800',
    },

    interviewCountBadge: {
      minWidth: 34,
      height: 28,
      borderRadius: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        '#49391D',
    },

    emptySection: {
      backgroundColor:
        '#0F1523',
      borderWidth: 1,
      borderColor:
        '#20273A',
      borderRadius: 15,
      paddingVertical: 20,
      paddingHorizontal: 15,
    },

    emptySectionText: {
      color: '#687084',
      fontSize: 12,
      textAlign: 'center',
    },

    /*
     * FOLLOW-UP CARDS
     */

    actionCard: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#352B42',
      borderRadius: 15,
      padding: 14,
      marginBottom: 9,
    },

    actionCardTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    actionCardText: {
      flex: 1,
    },

    actionBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },

    actionJobTitle: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
    },

    actionCompany: {
      color: '#858CA0',
      fontSize: 11,
      marginTop: 3,
    },

    /*
     * INTERVIEW CARDS
     */

    interviewCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#3B3428',
      borderRadius: 15,
      padding: 14,
      marginBottom: 9,
    },

    interviewIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor:
        '#49391D',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    interviewIconText: {
      color: '#FCD34D',
      fontSize: 17,
    },

    interviewInfo: {
      flex: 1,
    },

    interviewDateText: {
      color: '#D6B75B',
      fontSize: 10,
      fontWeight: '700',
      marginTop: 6,
    },

    /*
     * PIPELINE JOB CARDS
     */

    jobCard: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 18,
      padding: 16,
      marginBottom: 11,
    },

    jobCardPressed: {
      opacity: 0.78,
    },

    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },

    companyIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor:
        '#252041',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    companyInitial: {
      color: '#A78BFA',
      fontSize: 16,
      fontWeight: '800',
    },

    cardHeading: {
      flex: 1,
    },

    jobTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      lineHeight: 21,
      fontWeight: '700',
    },

    company: {
      color: '#9299AC',
      fontSize: 12,
      marginTop: 3,
    },

    cardArrow: {
      color: '#A78BFA',
      fontSize: 25,
      marginLeft: 8,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    metaIcon: {
      width: 22,
      color: '#8B5CF6',
      fontSize: 11,
    },

    metaText: {
      flex: 1,
      color: '#9CA4B7',
      fontSize: 11,
    },

    salary: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
      marginTop: 5,
    },

    /*
     * TIMELINE PREVIEW
     */

    timelinePreview: {
      backgroundColor:
        '#0C1220',
      borderRadius: 12,
      padding: 11,
      marginTop: 13,
      gap: 9,
    },

    timelineRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      gap: 10,
    },

    timelineLabel: {
      color: '#747C8F',
      fontSize: 10,
      fontWeight: '700',
    },

    timelineValue: {
      flex: 1,
      color: '#C5CBD8',
      fontSize: 10,
      fontWeight: '600',
      textAlign: 'right',
    },

    followUpBadge: {
      backgroundColor:
        '#1E3351',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },

    followUpOverdue: {
      backgroundColor:
        '#42232B',
    },

    followUpToday: {
      backgroundColor:
        '#49391D',
    },

    followUpBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: '800',
    },

    /*
     * NOTE PREVIEW
     */

    notePreview: {
      flexDirection: 'row',
      backgroundColor:
        '#171D2D',
      borderRadius: 11,
      padding: 10,
      marginTop: 10,
    },

    noteIcon: {
      color: '#A78BFA',
      fontSize: 12,
      marginRight: 8,
    },

    noteText: {
      flex: 1,
      color: '#8E96A9',
      fontSize: 10,
      lineHeight: 15,
    },

    divider: {
      height: 1,
      backgroundColor:
        '#252C40',
      marginVertical: 13,
    },

    footerRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    statusPill: {
      borderRadius: 9,
      paddingHorizontal: 9,
      paddingVertical: 6,
    },

    statusPillText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '800',
    },

    source: {
      color: '#747C8F',
      fontSize: 10,
      maxWidth: '45%',
    },

    statusApplied: {
      backgroundColor:
        '#1E3351',
    },

    statusInterview: {
      backgroundColor:
        '#49391D',
    },

    statusOffer: {
      backgroundColor:
        '#153B31',
    },

    statusRejected: {
      backgroundColor:
        '#42232B',
    },
  });

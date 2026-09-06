import {
  useEffect,
  useState,
} from 'react';

import {
  JobProfile,
} from '../profile/jobProfile';

import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ApplicationStatus,
  Job,
} from '../types/Job';

import ApplicationCopilotCard
from '../components/ApplicationCopilotCard';

import {
  ResumeProfile,
  defaultResumeProfile,
} from '../profile/resumeProfile';

import {
  loadResumeProfile,
} from '../storage/resumeProfileStorage';

import ResumeMatchCard
  from '../components/ResumeMatchCard';

import ApplicationReadinessCard
  from '../components/ApplicationReadinessCard';

import ResumeTailoringCard
  from '../components/ResumeTailoringCard';

import TailoredResumeDraftCard
  from '../components/TailoredResumeDraftCard';

type TrackingUpdates =
  Partial<
    Pick<
      Job,
      | 'appliedDate'
      | 'interviewDate'
      | 'followUpDate'
    >
  >;

type JobDetailsScreenProps = {
  job: Job;

  preferences: JobProfile;

  onBack: () => void;

  onNotesChange?: (
    jobId: string,
    notes: string
  ) => void;

  onTrackingChange?: (
    jobId: string,
    updates: TrackingUpdates
  ) => void;

  onStatusChange?: (
    jobId: string,
    status: ApplicationStatus
  ) => void;

  onRemoveSavedJob?: (
    jobId: string
  ) => void;
};

const applicationStatuses: {
  value: ApplicationStatus;
  label: string;
}[] = [
  {
    value: 'interested',
    label: 'Interested',
  },
  {
    value: 'applied',
    label: 'Applied',
  },
  {
    value: 'interview',
    label: 'Interview',
  },
  {
    value: 'offer',
    label: 'Offer',
  },
  {
    value: 'rejected',
    label: 'Rejected',
  },
];

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

export default function JobDetailsScreen({
  job,
  preferences,
  onBack,
  onNotesChange,
  onTrackingChange,
  onStatusChange,
  onRemoveSavedJob,
}: JobDetailsScreenProps) {
  const [
    resumeProfile,
    setResumeProfile,
  ] = useState<ResumeProfile>(
    defaultResumeProfile
  );

  const [
    hasLoadedResume,
    setHasLoadedResume,
  ] = useState(false);
  const [
    notes,
    setNotes,
  ] = useState(
    job.notes ?? ''
  );

  const [
    savedNotes,
    setSavedNotes,
  ] = useState(
    job.notes ?? ''
  );

  const [
    appliedDate,
    setAppliedDate,
  ] = useState(
    job.appliedDate ?? ''
  );

  const [
    savedAppliedDate,
    setSavedAppliedDate,
  ] = useState(
    job.appliedDate ?? ''
  );

  const [
    interviewDate,
    setInterviewDate,
  ] = useState(
    job.interviewDate ?? ''
  );

  const [
    savedInterviewDate,
    setSavedInterviewDate,
  ] = useState(
    job.interviewDate ?? ''
  );

  const [
    followUpDate,
    setFollowUpDate,
  ] = useState(
    job.followUpDate ?? ''
  );

  const [
    savedFollowUpDate,
    setSavedFollowUpDate,
  ] = useState(
    job.followUpDate ?? ''
  );

  /*
   * KEEP LOCAL FORM STATE
   * SYNCED WITH SELECTED JOB
   */

  useEffect(() => {
    const nextNotes =
      job.notes ?? '';

    const nextAppliedDate =
      job.appliedDate ?? '';

    const nextInterviewDate =
      job.interviewDate ?? '';

    const nextFollowUpDate =
      job.followUpDate ?? '';

    setNotes(
      nextNotes
    );

    setSavedNotes(
      nextNotes
    );

    setAppliedDate(
      nextAppliedDate
    );

    setSavedAppliedDate(
      nextAppliedDate
    );

    setInterviewDate(
      nextInterviewDate
    );

    setSavedInterviewDate(
      nextInterviewDate
    );

    setFollowUpDate(
      nextFollowUpDate
    );

    setSavedFollowUpDate(
      nextFollowUpDate
    );
  }, [
    job.id,
    job.notes,
    job.appliedDate,
    job.interviewDate,
    job.followUpDate,
  ]);

  /*
   * LOAD RESUME PROFILE
   * FOR APPLICATION COPILOT
   */

  useEffect(() => {
    let isMounted = true;

    async function loadResume() {
      try {
        const savedResume =
          await loadResumeProfile();

        if (isMounted) {
          setResumeProfile(
            savedResume
          );
        }
      } catch (error) {
        console.error(
          'Failed to load Resume Profile for Application Copilot:',
          error
        );
      } finally {
        if (isMounted) {
          setHasLoadedResume(
            true
          );
        }
      }
    }

    setHasLoadedResume(
      false
    );

    loadResume();

    return () => {
      isMounted = false;
    };
  }, [job.id]);

  const currentStatus =
    job.applicationStatus ??
    'interested';

  const notesChanged =
    notes !== savedNotes;

  const trackingChanged =
    appliedDate !==
      savedAppliedDate ||
    interviewDate !==
      savedInterviewDate ||
    followUpDate !==
      savedFollowUpDate;

  /*
   * NOTES
   */

  function saveNotes() {
    if (!onNotesChange) {
      return;
    }

    const trimmedNotes =
      notes.trim();

    onNotesChange(
      job.id,
      trimmedNotes
    );

    setNotes(
      trimmedNotes
    );

    setSavedNotes(
      trimmedNotes
    );
  }

  function clearNotes() {
    if (!onNotesChange) {
      return;
    }

    setNotes('');
    setSavedNotes('');

    onNotesChange(
      job.id,
      ''
    );
  }

  /*
   * TIMELINE
   */

  function saveTracking() {
    if (!onTrackingChange) {
      return;
    }

    const nextAppliedDate =
      appliedDate.trim();

    const nextInterviewDate =
      interviewDate.trim();

    const nextFollowUpDate =
      followUpDate.trim();

    onTrackingChange(
      job.id,
      {
        appliedDate:
          nextAppliedDate,

        interviewDate:
          nextInterviewDate,

        followUpDate:
          nextFollowUpDate,
      }
    );

    setAppliedDate(
      nextAppliedDate
    );

    setSavedAppliedDate(
      nextAppliedDate
    );

    setInterviewDate(
      nextInterviewDate
    );

    setSavedInterviewDate(
      nextInterviewDate
    );

    setFollowUpDate(
      nextFollowUpDate
    );

    setSavedFollowUpDate(
      nextFollowUpDate
    );
  }

  function clearTracking() {
    if (!onTrackingChange) {
      return;
    }

    setAppliedDate('');
    setSavedAppliedDate('');

    setInterviewDate('');
    setSavedInterviewDate('');

    setFollowUpDate('');
    setSavedFollowUpDate('');

    onTrackingChange(
      job.id,
      {
        appliedDate: '',
        interviewDate: '',
        followUpDate: '',
      }
    );
  }

  /*
   * STATUS
   */

  function updateStatus(
    status: ApplicationStatus
  ) {
    if (!onStatusChange) {
      return;
    }

    onStatusChange(
      job.id,
      status
    );
  }

  /*
   * REMOVE SAVED JOB
   */

  function confirmRemoveSavedJob() {
    if (!onRemoveSavedJob) {
      return;
    }

    Alert.alert(
      'Remove saved job?',
      `Remove ${job.title} at ${job.company} from Matches and Applications?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            onRemoveSavedJob(
              job.id
            );
          },
        },
      ]
    );
  }

  /*
   * ORIGINAL LISTING
   */

  function openOriginalListing() {
    if (!job.sourceUrl) {
      return;
    }

    Linking.openURL(
      job.sourceUrl
    ).catch((error) => {
      console.error(
        'Failed to open job listing:',
        error
      );
    });
  }

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
        <Pressable
          style={({ pressed }) => [
            styles.backButton,

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={onBack}
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            ‹
          </Text>
        </Pressable>

        <Text
          style={
            styles.headerTitle
          }
        >
          Job details
        </Text>

        <View
          style={
            styles.headerSpacer
          }
        />
      </View>

      {/* HERO */}

      <View
        style={styles.heroCard}
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

        <Text
          style={styles.jobTitle}
        >
          {job.title}
        </Text>

        <Text
          style={styles.company}
        >
          {job.company}
        </Text>

        <View
          style={styles.heroMeta}
        >
          <View
            style={styles.metaPill}
          >
            <Text
              style={
                styles.metaPillText
              }
            >
              {job.location}
            </Text>
          </View>

          <View
            style={styles.metaPill}
          >
            <Text
              style={
                styles.metaPillText
              }
            >
              {job.type}
            </Text>
          </View>
        </View>

        {job.salary && (
          <Text
            style={styles.salary}
          >
            {job.salary}
          </Text>
        )}

        {job.matchScore !==
          undefined && (
          <View
            style={
              styles.matchContainer
            }
          >
            <Text
              style={
                styles.matchScore
              }
            >
              {job.matchScore}% match
            </Text>
          </View>
        )}
      </View>

      {/* APPLICATION STATUS */}

      {onStatusChange && (
        <View
          style={
            styles.sectionCard
          }
        >
          <View
            style={
              styles.sectionHeaderRow
            }
          >
            <View
              style={{ flex: 1 }}
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Application status
              </Text>

              <Text
                style={
                  styles.sectionDescription
                }
              >
                Update where this
                application is in your
                pipeline.
              </Text>
            </View>

            <View
              style={
                styles.currentStatusBadge
              }
            >
              <Text
                style={
                  styles.currentStatusText
                }
              >
                {formatStatus(
                  currentStatus
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.statusOptions
            }
          >
            {applicationStatuses.map(
              ({
                value,
                label,
              }) => {
                const selected =
                  currentStatus ===
                  value;

                return (
                  <Pressable
                    key={value}
                    style={({
                      pressed,
                    }) => [
                      styles.statusOption,

                      selected &&
                        styles.statusOptionSelected,

                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={() =>
                      updateStatus(
                        value
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.statusOptionText,

                        selected &&
                          styles.statusOptionTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          <Text
            style={
              styles.statusHint
            }
          >
            Status changes are saved
            automatically.
          </Text>
        </View>
      )}

      {/* ABOUT */}

      <View
        style={
          styles.sectionCard
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          About the role
        </Text>

        <Text
          style={
            styles.description
          }
        >
          {job.description}
        </Text>
      </View>

      {/* SKILLS */}

      {job.skills.length >
        0 && (
        <View
          style={
            styles.sectionCard
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Skills
          </Text>

          <View
            style={
              styles.skillsContainer
            }
          >
            {job.skills.map(
              (skill) => (
                <View
                  key={skill}
                  style={
                    styles.skillChip
                  }
                >
                  <Text
                    style={
                      styles.skillText
                    }
                  >
                    {skill}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      )}

      {/* MATCH REASONS */}

      {job.matchReasons &&
        job.matchReasons.length >
          0 && (
          <View
            style={
              styles.sectionCard
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Why it matches
            </Text>

            {job.matchReasons.map(
              (
                reason,
                index
              ) => (
                <View
                  key={`${reason}-${index}`}
                  style={
                    styles.reasonRow
                  }
                >
                  <Text
                    style={
                      styles.reasonBullet
                    }
                  >
                    ✓
                  </Text>

                  <Text
                    style={
                      styles.reasonText
                    }
                  >
                    {reason}
                  </Text>
                </View>
              )
            )}
          </View>
        )}

      {/* APPLICATION COPILOT */}

      {/* RESUME MATCH + APPLICATION COPILOT */}

      {hasLoadedResume ? (
        <>
        <ApplicationReadinessCard
            job={job}
            resume={
              resumeProfile
            }
          />

        <ResumeMatchCard
            job={job}
            resume={
              resumeProfile
            }
          />

        <ResumeTailoringCard
            job={job}
            resume={resumeProfile}
          />

        <TailoredResumeDraftCard
            job={job}
            resume={resumeProfile}
          />

        <ApplicationCopilotCard
            job={job}
            preferences={
              preferences
            }
            resume={
              resumeProfile
            }
          />
        </>
      ) : (
        <View
          style={
            styles.copilotLoadingCard
          }
        >
          <Text
            style={
              styles.copilotLoadingText
            }
          >
            Loading Resume Profile...
          </Text>
        </View>
      )}

      {/* APPLICATION TIMELINE */}

      {onTrackingChange && (
        <View
          style={
            styles.sectionCard
          }
        >
          <View
            style={
              styles.sectionHeaderRow
            }
          >
            <View
              style={{ flex: 1 }}
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Application timeline
              </Text>

              <Text
                style={
                  styles.sectionDescription
                }
              >
                Track application,
                interview and follow-up
                dates.
              </Text>
            </View>

            {!trackingChanged &&
              (savedAppliedDate ||
                savedInterviewDate ||
                savedFollowUpDate) && (
                <View
                  style={
                    styles.savedBadge
                  }
                >
                  <Text
                    style={
                      styles.savedBadgeText
                    }
                  >
                    Saved
                  </Text>
                </View>
              )}
          </View>

          <Text
            style={
              styles.inputLabel
            }
          >
            Applied
          </Text>

          <TextInput
            style={styles.input}
            value={appliedDate}
            onChangeText={
              setAppliedDate
            }
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#596176"
            autoCapitalize="none"
          />

          <Text
            style={
              styles.inputLabel
            }
          >
            Interview
          </Text>

          <TextInput
            style={styles.input}
            value={interviewDate}
            onChangeText={
              setInterviewDate
            }
            placeholder="YYYY-MM-DD HH:MM"
            placeholderTextColor="#596176"
            autoCapitalize="none"
          />

          <Text
            style={
              styles.inputLabel
            }
          >
            Follow up
          </Text>

          <TextInput
            style={styles.input}
            value={followUpDate}
            onChangeText={
              setFollowUpDate
            }
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#596176"
            autoCapitalize="none"
          />

          <View
            style={
              styles.actionRow
            }
          >
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,

                !trackingChanged &&
                  styles.disabledButton,

                pressed &&
                  trackingChanged &&
                  styles.buttonPressed,
              ]}
              disabled={
                !trackingChanged
              }
              onPress={
                saveTracking
              }
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Save timeline
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,

                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={
                clearTracking
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Clear
              </Text>
            </Pressable>
          </View>

          {trackingChanged && (
            <Text
              style={
                styles.unsavedText
              }
            >
              Unsaved timeline changes
            </Text>
          )}
        </View>
      )}

      {/* NOTES */}

      {onNotesChange && (
        <View
          style={
            styles.sectionCard
          }
        >
          <View
            style={
              styles.sectionHeaderRow
            }
          >
            <View
              style={{ flex: 1 }}
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Application notes
              </Text>

              <Text
                style={
                  styles.sectionDescription
                }
              >
                Save useful details for
                this opportunity.
              </Text>
            </View>

            {!notesChanged &&
              savedNotes.length >
                0 && (
                <View
                  style={
                    styles.savedBadge
                  }
                >
                  <Text
                    style={
                      styles.savedBadgeText
                    }
                  >
                    Saved
                  </Text>
                </View>
              )}
          </View>

          <TextInput
            style={
              styles.notesInput
            }
            value={notes}
            onChangeText={
              setNotes
            }
            placeholder="Recruiter name, interview notes, things to prepare..."
            placeholderTextColor="#596176"
            multiline
            textAlignVertical="top"
          />

          <View
            style={
              styles.actionRow
            }
          >
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,

                !notesChanged &&
                  styles.disabledButton,

                pressed &&
                  notesChanged &&
                  styles.buttonPressed,
              ]}
              disabled={
                !notesChanged
              }
              onPress={saveNotes}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Save notes
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,

                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={clearNotes}
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Clear
              </Text>
            </Pressable>
          </View>

          {notesChanged && (
            <Text
              style={
                styles.unsavedText
              }
            >
              Unsaved note changes
            </Text>
          )}
        </View>
      )}

      {/* ORIGINAL LISTING */}

      <View
        style={
          styles.sectionCard
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Original listing
        </Text>

        <Text
          style={
            styles.sectionDescription
          }
        >
          Source:{' '}
          {job.sourceLabel ??
            job.source}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.listingButton,

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={
            openOriginalListing
          }
        >
          <Text
            style={
              styles.listingButtonText
            }
          >
            Open job listing
          </Text>

          <Text
            style={
              styles.listingArrow
            }
          >
            ↗
          </Text>
        </Pressable>
      </View>

      {/* REMOVE SAVED JOB */}

      {onRemoveSavedJob && (
        <View
          style={
            styles.dangerCard
          }
        >
          <Text
            style={
              styles.dangerTitle
            }
          >
            Remove saved job
          </Text>

          <Text
            style={
              styles.dangerDescription
            }
          >
            This removes the job from
            Matches and Applications,
            including its saved notes
            and timeline.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.removeButton,

              pressed &&
                styles.buttonPressed,
            ]}
            onPress={
              confirmRemoveSavedJob
            }
          >
            <Text
              style={
                styles.removeButtonText
              }
            >
              Remove saved job
            </Text>
          </Pressable>
        </View>
      )}
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
      paddingTop: 18,
      paddingBottom: 42,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 18,
    },

    headerTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
    },

    headerSpacer: {
      width: 42,
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    backButtonText: {
      color: '#A78BFA',
      fontSize: 30,
      lineHeight: 31,
      marginTop: -2,
    },

    heroCard: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#292F43',
      borderRadius: 22,
      padding: 20,
      marginBottom: 15,
    },

    companyIcon: {
      width: 54,
      height: 54,
      borderRadius: 17,
      backgroundColor:
        '#29204C',
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 16,
    },

    companyInitial: {
      color: '#B7A1FF',
      fontSize: 21,
      fontWeight: '900',
    },

    jobTitle: {
      color: '#FFFFFF',
      fontSize: 25,
      lineHeight: 31,
      fontWeight: '900',
    },

    company: {
      color: '#9CA4B7',
      fontSize: 15,
      fontWeight: '600',
      marginTop: 7,
    },

    heroMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 17,
    },

    metaPill: {
      backgroundColor:
        '#171E2F',
      borderRadius: 9,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },

    metaPillText: {
      color: '#A8B0C1',
      fontSize: 10,
      fontWeight: '700',
    },

    salary: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
      marginTop: 15,
    },

    matchContainer: {
      alignSelf:
        'flex-start',
      backgroundColor:
        '#19372F',
      borderRadius: 9,
      paddingHorizontal: 10,
      paddingVertical: 7,
      marginTop: 13,
    },

    matchScore: {
      color: '#86E1B9',
      fontSize: 11,
      fontWeight: '800',
    },

    sectionCard: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 18,
      padding: 17,
      marginBottom: 15,
    },

    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap: 10,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '800',
    },

    sectionDescription: {
      color: '#7F879B',
      fontSize: 11,
      lineHeight: 17,
      marginTop: 5,
    },

    description: {
      color: '#A5ADBE',
      fontSize: 13,
      lineHeight: 21,
      marginTop: 12,
    },

    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 13,
    },

    skillChip: {
      backgroundColor:
        '#201A38',
      borderWidth: 1,
      borderColor:
        '#382C62',
      borderRadius: 9,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },

    skillText: {
      color: '#C4B5FD',
      fontSize: 10,
      fontWeight: '700',
    },

    reasonRow: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
      marginTop: 11,
    },

    reasonBullet: {
      color: '#72D6A7',
      width: 22,
      fontSize: 12,
      fontWeight: '900',
    },

    reasonText: {
      flex: 1,
      color: '#A5ADBE',
      fontSize: 12,
      lineHeight: 18,
    },

    /*
     * APPLICATION COPILOT
     */

    copilotLoadingCard: {
      backgroundColor:
        '#111727',

      borderWidth: 1,

      borderColor:
        '#47377A',

      borderRadius: 18,

      padding: 17,

      marginBottom: 15,
    },

    copilotLoadingText: {
      color: '#7F879B',

      fontSize: 11,
    },

    /*
     * STATUS
     */

    currentStatusBadge: {
      backgroundColor:
        '#29204C',
      borderRadius: 9,
      paddingHorizontal: 9,
      paddingVertical: 6,
    },

    currentStatusText: {
      color: '#C4B5FD',
      fontSize: 9,
      fontWeight: '900',
    },

    statusOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 15,
    },

    statusOption: {
      borderWidth: 1,
      borderColor:
        '#30384D',
      backgroundColor:
        '#0D1321',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    statusOptionSelected: {
      borderColor:
        '#8B5CF6',
      backgroundColor:
        '#2A2146',
    },

    statusOptionText: {
      color: '#858CA0',
      fontSize: 11,
      fontWeight: '700',
    },

    statusOptionTextSelected: {
      color: '#C4B5FD',
      fontWeight: '900',
    },

    statusHint: {
      color: '#626B80',
      fontSize: 9,
      marginTop: 11,
    },

    /*
     * TIMELINE / NOTES
     */

    inputLabel: {
      color: '#A8B0C1',
      fontSize: 10,
      fontWeight: '800',
      marginTop: 15,
      marginBottom: 6,
    },

    input: {
      height: 45,
      backgroundColor:
        '#0C1220',
      borderWidth: 1,
      borderColor:
        '#293146',
      borderRadius: 11,
      color: '#FFFFFF',
      fontSize: 12,
      paddingHorizontal: 12,
    },

    notesInput: {
      minHeight: 130,
      backgroundColor:
        '#0C1220',
      borderWidth: 1,
      borderColor:
        '#293146',
      borderRadius: 12,
      color: '#FFFFFF',
      fontSize: 12,
      lineHeight: 19,
      padding: 12,
      marginTop: 14,
    },

    actionRow: {
      flexDirection: 'row',
      gap: 9,
      marginTop: 13,
    },

    primaryButton: {
      flex: 1,
      backgroundColor:
        '#7C4DFF',
      borderRadius: 11,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingVertical: 12,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '900',
    },

    secondaryButton: {
      backgroundColor:
        '#171E2F',
      borderWidth: 1,
      borderColor:
        '#30384D',
      borderRadius: 11,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    secondaryButtonText: {
      color: '#9CA4B7',
      fontSize: 11,
      fontWeight: '800',
    },

    disabledButton: {
      opacity: 0.4,
    },

    buttonPressed: {
      opacity: 0.72,
    },

    savedBadge: {
      backgroundColor:
        '#17372F',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },

    savedBadgeText: {
      color: '#7AD9AA',
      fontSize: 9,
      fontWeight: '900',
    },

    unsavedText: {
      color: '#D6B75B',
      fontSize: 9,
      fontWeight: '700',
      marginTop: 9,
    },

    /*
     * ORIGINAL LISTING
     */

    listingButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      backgroundColor:
        '#171E2F',
      borderRadius: 11,
      paddingHorizontal: 13,
      paddingVertical: 13,
      marginTop: 14,
    },

    listingButtonText: {
      color: '#C4B5FD',
      fontSize: 12,
      fontWeight: '800',
    },

    listingArrow: {
      color: '#A78BFA',
      fontSize: 18,
    },

    /*
     * REMOVE SAVED JOB
     */

    dangerCard: {
      backgroundColor:
        '#171116',
      borderWidth: 1,
      borderColor:
        '#4A252D',
      borderRadius: 18,
      padding: 17,
      marginBottom: 15,
    },

    dangerTitle: {
      color: '#F3A6B3',
      fontSize: 16,
      fontWeight: '800',
    },

    dangerDescription: {
      color: '#917982',
      fontSize: 11,
      lineHeight: 17,
      marginTop: 6,
    },

    removeButton: {
      borderWidth: 1,
      borderColor:
        '#69303D',
      backgroundColor:
        '#351A22',
      borderRadius: 11,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingVertical: 12,
      marginTop: 14,
    },

    removeButtonText: {
      color: '#F2A0AF',
      fontSize: 11,
      fontWeight: '900',
    },
  });
import {
  useEffect,
  useState,
} from 'react';

import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Job } from '../types/Job';

type JobDetailsScreenProps = {
  job: Job;
  onBack: () => void;

  onNotesChange?: (
    jobId: string,
    notes: string
  ) => void;
};

export default function JobDetailsScreen({
  job,
  onBack,
  onNotesChange,
}: JobDetailsScreenProps) {
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

  useEffect(() => {
    const currentNotes =
      job.notes ?? '';

    setNotes(currentNotes);
    setSavedNotes(currentNotes);
  }, [
    job.id,
    job.notes,
  ]);

  const canEditNotes =
    Boolean(onNotesChange);

  const hasUnsavedChanges =
    notes !== savedNotes;

  async function openSource() {
    try {
      const supported =
        await Linking.canOpenURL(
          job.sourceUrl
        );

      if (supported) {
        await Linking.openURL(
          job.sourceUrl
        );
      }
    } catch (error) {
      console.error(
        'Failed to open job source:',
        error
      );
    }
  }

  function saveNotes() {
    if (!onNotesChange) {
      return;
    }

    onNotesChange(
      job.id,
      notes
    );

    setSavedNotes(notes);
  }

  function clearNotes() {
    if (!onNotesChange) {
      return;
    }

    setNotes('');

    onNotesChange(
      job.id,
      ''
    );

    setSavedNotes('');
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
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        style={styles.backButton}
        onPress={onBack}
      >
        <Text
          style={styles.backIcon}
        >
          ‹
        </Text>

        <Text
          style={styles.backText}
        >
          Back
        </Text>
      </Pressable>

      {/* HERO */}

      <View
        style={styles.heroCard}
      >
        <View
          style={styles.topRow}
        >
          <View
            style={styles.badge}
          >
            <Text
              style={
                styles.badgeText
              }
            >
              Recommended
            </Text>
          </View>

          <Text
            style={styles.source}
          >
            {job.sourceLabel ??
              job.source}
          </Text>
        </View>

        <Text
          style={styles.title}
        >
          {job.title}
        </Text>

        <View
          style={
            styles.companyRow
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
              styles.companyInfo
            }
          >
            <Text
              style={styles.company}
              numberOfLines={1}
            >
              {job.company}
            </Text>

            <Text
              style={styles.location}
            >
              {job.location}
            </Text>
          </View>
        </View>

        <View
          style={styles.infoGrid}
        >
          <View
            style={styles.infoItem}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              TYPE
            </Text>

            <Text
              style={
                styles.infoValue
              }
            >
              {job.type}
            </Text>
          </View>

          {job.salary && (
            <View
              style={
                styles.infoItem
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                SALARY
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {job.salary}
              </Text>
            </View>
          )}

          {job.postedDate && (
            <View
              style={
                styles.infoItem
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                POSTED
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {job.postedDate}
              </Text>
            </View>
          )}

          {job.closingDate && (
            <View
              style={
                styles.infoItem
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                CLOSING
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {job.closingDate}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ABOUT */}

      <View
        style={styles.section}
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
          {job.description ||
            'No description available for this job.'}
        </Text>
      </View>

      {/* SKILLS */}

      {job.skills &&
        job.skills.length > 0 && (
          <View
            style={styles.section}
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Skills
            </Text>

            <View
              style={styles.skills}
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

      {/* APPLICATION NOTES */}

      {canEditNotes && (
        <View
          style={
            styles.notesSection
          }
        >
          <View
            style={
              styles.notesHeader
            }
          >
            <View
              style={
                styles.notesHeaderText
              }
            >
              <Text
                style={
                  styles.notesTitle
                }
              >
                Application notes
              </Text>

              <Text
                style={
                  styles.notesSubtitle
                }
              >
                Keep recruiter details,
                interview information and
                follow-up reminders here.
              </Text>
            </View>

            {savedNotes.trim()
              .length > 0 && (
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
            value={notes}
            onChangeText={
              setNotes
            }
            placeholder={
              'Example:\nApplied through company website.\nRecruiter: Sarah\nInterview: Sep 12, 2 PM'
            }
            placeholderTextColor="#5F677A"
            style={
              styles.notesInput
            }
            multiline
            textAlignVertical="top"
            autoCorrect
          />

          <View
            style={
              styles.notesMeta
            }
          >
            <Text
              style={
                styles.notesCharacterCount
              }
            >
              {notes.length}{' '}
              characters
            </Text>

            {hasUnsavedChanges && (
              <Text
                style={
                  styles.unsavedText
                }
              >
                Unsaved changes
              </Text>
            )}
          </View>

          <View
            style={
              styles.notesActions
            }
          >
            {notes.length > 0 && (
              <Pressable
                style={
                  styles.clearNotesButton
                }
                onPress={
                  clearNotes
                }
              >
                <Text
                  style={
                    styles.clearNotesText
                  }
                >
                  Clear
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.saveNotesButton,
                !hasUnsavedChanges &&
                  styles.saveNotesButtonDisabled,
              ]}
              disabled={
                !hasUnsavedChanges
              }
              onPress={
                saveNotes
              }
            >
              <Text
                style={[
                  styles.saveNotesText,
                  !hasUnsavedChanges &&
                    styles.saveNotesTextDisabled,
                ]}
              >
                {hasUnsavedChanges
                  ? 'Save notes'
                  : 'Notes saved'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ORIGINAL LISTING */}

      <View
        style={styles.sourceCard}
      >
        <View
          style={styles.sourceInfo}
        >
          <Text
            style={
              styles.sourceCardLabel
            }
          >
            Original listing
          </Text>

          <Text
            style={
              styles.sourceCardText
            }
          >
            Open the original job post
            to review the full listing
            and apply.
          </Text>
        </View>

        <Text
          style={
            styles.sourceArrow
          }
        >
          ↗
        </Text>
      </View>

      <Pressable
        style={
          styles.primaryButton
        }
        onPress={openSource}
      >
        <Text
          style={
            styles.primaryButtonText
          }
        >
          Open original job
        </Text>

        <Text
          style={
            styles.primaryButtonIcon
          }
        >
          ↗
        </Text>
      </Pressable>
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
      paddingTop: 20,
      paddingBottom: 40,
    },

    backButton: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
      paddingVertical: 6,
    },

    backIcon: {
      color: '#A78BFA',
      fontSize: 29,
      lineHeight: 28,
      marginRight: 3,
    },

    backText: {
      color: '#A78BFA',
      fontSize: 14,
      fontWeight: '700',
    },

    heroCard: {
      backgroundColor:
        '#F8FAFC',
      borderRadius: 24,
      padding: 22,
      marginBottom: 26,
    },

    topRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },

    badge: {
      backgroundColor:
        '#EDE9FE',
      borderRadius: 20,
      paddingHorizontal: 11,
      paddingVertical: 6,
    },

    badgeText: {
      color: '#7C3AED',
      fontSize: 11,
      fontWeight: '800',
    },

    source: {
      maxWidth: '45%',
      color: '#9298A7',
      fontSize: 10,
      fontWeight: '600',
    },

    title: {
      color: '#111827',
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '800',
      marginBottom: 20,
    },

    companyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 22,
    },

    companyIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor:
        '#EEE9FF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 12,
    },

    companyInitial: {
      color: '#7C3AED',
      fontSize: 18,
      fontWeight: '900',
    },

    companyInfo: {
      flex: 1,
    },

    company: {
      color: '#262C38',
      fontSize: 16,
      fontWeight: '800',
    },

    location: {
      color: '#777E8E',
      fontSize: 12,
      marginTop: 4,
    },

    infoGrid: {
      gap: 12,
    },

    infoItem: {
      backgroundColor:
        '#F1F3F7',
      borderRadius: 12,
      paddingHorizontal: 13,
      paddingVertical: 11,
    },

    infoLabel: {
      color: '#969CAA',
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.8,
      marginBottom: 4,
    },

    infoValue: {
      color: '#222936',
      fontSize: 13,
      fontWeight: '700',
    },

    section: {
      marginBottom: 26,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 11,
    },

    description: {
      color: '#A1A8B9',
      fontSize: 13,
      lineHeight: 21,
    },

    skills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    skillChip: {
      backgroundColor:
        '#191F30',
      borderWidth: 1,
      borderColor:
        '#30374C',
      borderRadius: 10,
      paddingHorizontal: 11,
      paddingVertical: 7,
    },

    skillText: {
      color: '#C4B5FD',
      fontSize: 11,
      fontWeight: '700',
    },

    /*
     * APPLICATION NOTES
     */

    notesSection: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 18,
      padding: 16,
      marginBottom: 26,
    },

    notesHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
      marginBottom: 14,
    },

    notesHeaderText: {
      flex: 1,
      paddingRight: 12,
    },

    notesTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
    },

    notesSubtitle: {
      color: '#7F879A',
      fontSize: 11,
      lineHeight: 17,
      marginTop: 5,
    },

    savedBadge: {
      backgroundColor:
        '#153B31',
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 9,
    },

    savedBadgeText: {
      color: '#8DE2C1',
      fontSize: 9,
      fontWeight: '800',
      textTransform:
        'uppercase',
    },

    notesInput: {
      minHeight: 140,
      backgroundColor:
        '#080D1A',
      borderWidth: 1,
      borderColor:
        '#2A3247',
      borderRadius: 13,
      paddingHorizontal: 13,
      paddingVertical: 12,
      color: '#FFFFFF',
      fontSize: 13,
      lineHeight: 20,
    },

    notesMeta: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginTop: 8,
    },

    notesCharacterCount: {
      color: '#61697D',
      fontSize: 10,
    },

    unsavedText: {
      color: '#C4B5FD',
      fontSize: 10,
      fontWeight: '700',
    },

    notesActions: {
      flexDirection: 'row',
      justifyContent:
        'flex-end',
      alignItems: 'center',
      gap: 9,
      marginTop: 14,
    },

    clearNotesButton: {
      paddingHorizontal: 15,
      paddingVertical: 11,
      borderRadius: 11,
      backgroundColor:
        '#181F31',
      borderWidth: 1,
      borderColor:
        '#30374C',
    },

    clearNotesText: {
      color: '#A1A8B9',
      fontSize: 12,
      fontWeight: '700',
    },

    saveNotesButton: {
      paddingHorizontal: 18,
      paddingVertical: 11,
      borderRadius: 11,
      backgroundColor:
        '#7C3AED',
    },

    saveNotesButtonDisabled: {
      backgroundColor:
        '#242A3A',
    },

    saveNotesText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
    },

    saveNotesTextDisabled: {
      color: '#747C8F',
    },

    /*
     * SOURCE
     */

    sourceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252C40',
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
    },

    sourceInfo: {
      flex: 1,
    },

    sourceCardLabel: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      marginBottom: 4,
    },

    sourceCardText: {
      color: '#7F879A',
      fontSize: 11,
      lineHeight: 17,
    },

    sourceArrow: {
      color: '#A78BFA',
      fontSize: 22,
      marginLeft: 12,
    },

    primaryButton: {
      minHeight: 54,
      borderRadius: 15,
      backgroundColor:
        '#7C3AED',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 8,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
    },

    primaryButtonIcon: {
      color: '#FFFFFF',
      fontSize: 16,
    },
  });
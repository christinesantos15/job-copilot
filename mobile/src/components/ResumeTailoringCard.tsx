import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Job,
} from '../types/Job';

import {
  ResumeProfile,
} from '../profile/resumeProfile';

import {
  analyzeResumeTailoring,
  ResumeTailoringItem,
} from '../matching/resumeTailoring';

type ResumeTailoringCardProps = {
  job: Job;

  resume: ResumeProfile;
};

export default function ResumeTailoringCard({
  job,
  resume,
}: ResumeTailoringCardProps) {
  const tailoring =
    analyzeResumeTailoring(
      job,
      resume
    );

  function renderEvidence(
    items: ResumeTailoringItem[]
  ) {
    return items.map(
      (item) => (
        <View
          key={item.id}
          style={
            styles.evidenceItem
          }
        >
          <View
            style={
              styles.evidenceHeader
            }
          >
            <Text
              style={
                styles.evidenceTitle
              }
            >
              {item.title}
            </Text>

            <Text
              style={
                styles.priority
              }
            >
              {item.priority}
            </Text>
          </View>

          <Text
            style={
              styles.evidenceReason
            }
          >
            {item.reason}
          </Text>
        </View>
      )
    );
  }

  return (
    <View style={styles.card}>
      <Text
        style={
          styles.eyebrow
        }
      >
        RESUME TAILORING
      </Text>

      <Text
        style={
          styles.title
        }
      >
        Tailor for this job
      </Text>

      <Text
        style={
          styles.description
        }
      >
        Uses only evidence saved in
        your Resume Profile.
      </Text>

      <View
        style={
          styles.headlineBox
        }
      >
        <Text
          style={
            styles.smallLabel
          }
        >
          HEADLINE DIRECTION
        </Text>

        <Text
          style={
            styles.headline
          }
        >
          {
            tailoring
              .headlineSuggestion
          }
        </Text>
      </View>

      {tailoring
        .skillsToEmphasize
        .length > 0 && (
        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Emphasize these skills
          </Text>

          <View
            style={
              styles.chips
            }
          >
            {tailoring
              .skillsToEmphasize
              .map(
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

      {tailoring
        .projectsToEmphasize
        .length > 0 && (
        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Projects to emphasize
          </Text>

          {renderEvidence(
            tailoring
              .projectsToEmphasize
          )}
        </View>
      )}

      {tailoring
        .experienceToEmphasize
        .length > 0 && (
        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Experience to emphasize
          </Text>

          {renderEvidence(
            tailoring
              .experienceToEmphasize
          )}
        </View>
      )}

      {tailoring
        .educationToKeep
        .length > 0 && (
        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Education to keep
          </Text>

          {renderEvidence(
            tailoring
              .educationToKeep
          )}
        </View>
      )}

      <View
        style={
          styles.section
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Rewording guidance
        </Text>

        {tailoring
          .rewordSuggestions
          .map(
            (
              suggestion,
              index
            ) => (
              <View
                key={
                  `reword-${index}`
                }
                style={
                  styles.row
                }
              >
                <Text
                  style={
                    styles.arrow
                  }
                >
                  →
                </Text>

                <Text
                  style={
                    styles.rowText
                  }
                >
                  {suggestion}
                </Text>
              </View>
            )
          )}
      </View>

      {tailoring.gaps.length >
        0 && (
        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Do not claim
          </Text>

          {tailoring.gaps.map(
            (gap) => (
              <View
                key={gap.skill}
                style={
                  styles.gap
                }
              >
                <Text
                  style={
                    styles.gapSkill
                  }
                >
                  {gap.skill}
                </Text>

                <Text
                  style={
                    styles.gapText
                  }
                >
                  {gap.guidance}
                </Text>
              </View>
            )
          )}
        </View>
      )}

      {tailoring
        .warnings.length >
        0 && (
        <View
          style={
            styles.warningBox
          }
        >
          <Text
            style={
              styles.warningTitle
            }
          >
            Accuracy check
          </Text>

          {tailoring
            .warnings
            .map(
              (
                warning,
                index
              ) => (
                <Text
                  key={
                    `warning-${index}`
                  }
                  style={
                    styles.warningText
                  }
                >
                  • {warning}
                </Text>
              )
            )}
        </View>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        '#111727',

      borderWidth: 1,

      borderColor:
        '#315B62',

      borderRadius: 18,

      padding: 17,

      marginBottom: 15,
    },

    eyebrow: {
      color: '#72D6A7',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.1,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: '900',

      marginTop: 5,
    },

    description: {
      color: '#7F879B',

      fontSize: 11,

      lineHeight: 17,

      marginTop: 6,
    },

    headlineBox: {
      backgroundColor:
        '#0C1220',

      borderRadius: 11,

      padding: 12,

      marginTop: 15,
    },

    smallLabel: {
      color: '#72D6A7',

      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 0.8,
    },

    headline: {
      color: '#D8DCE7',

      fontSize: 12,

      fontWeight: '800',

      marginTop: 5,
    },

    section: {
      marginTop: 18,
    },

    sectionTitle: {
      color: '#D8DCE7',

      fontSize: 12,

      fontWeight: '900',

      marginBottom: 8,
    },

    chips: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 7,
    },

    skillChip: {
      backgroundColor:
        '#17372F',

      borderWidth: 1,

      borderColor:
        '#28594A',

      borderRadius: 8,

      paddingHorizontal: 9,

      paddingVertical: 6,
    },

    skillText: {
      color: '#86E1B9',

      fontSize: 9,

      fontWeight: '800',
    },

    evidenceItem: {
      backgroundColor:
        '#0C1220',

      borderRadius: 10,

      padding: 11,

      marginTop: 7,
    },

    evidenceHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      gap: 8,
    },

    evidenceTitle: {
      flex: 1,

      color: '#C8CDDA',

      fontSize: 11,

      fontWeight: '800',
    },

    priority: {
      color: '#A78BFA',

      fontSize: 8,

      fontWeight: '900',

      textTransform:
        'uppercase',
    },

    evidenceReason: {
      color: '#747E92',

      fontSize: 9,

      lineHeight: 14,

      marginTop: 5,
    },

    row: {
      flexDirection: 'row',

      alignItems:
        'flex-start',

      marginTop: 8,
    },

    arrow: {
      width: 22,

      color: '#A78BFA',

      fontSize: 12,

      fontWeight: '900',
    },

    rowText: {
      flex: 1,

      color: '#A5ADBE',

      fontSize: 10,

      lineHeight: 16,
    },

    gap: {
      backgroundColor:
        '#2B2518',

      borderRadius: 9,

      padding: 10,

      marginTop: 7,
    },

    gapSkill: {
      color: '#D6B75B',

      fontSize: 10,

      fontWeight: '900',
    },

    gapText: {
      color: '#958866',

      fontSize: 9,

      lineHeight: 14,

      marginTop: 4,
    },

    warningBox: {
      backgroundColor:
        '#251C22',

      borderWidth: 1,

      borderColor:
        '#49313B',

      borderRadius: 11,

      padding: 12,

      marginTop: 18,
    },

    warningTitle: {
      color: '#D6A6B3',

      fontSize: 10,

      fontWeight: '900',

      marginBottom: 5,
    },

    warningText: {
      color: '#9E8089',

      fontSize: 9,

      lineHeight: 15,

      marginTop: 3,
    },
  });
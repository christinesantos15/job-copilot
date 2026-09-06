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
  analyzeResumeMatch,
} from '../matching/resumeMatchAnalysis';

type ResumeMatchCardProps = {
  job: Job;

  resume: ResumeProfile;
};

export default function ResumeMatchCard({
  job,
  resume,
}: ResumeMatchCardProps) {
  const analysis =
    analyzeResumeMatch(
      job,
      resume
    );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            RESUME ANALYSIS
          </Text>

          <Text style={styles.title}>
            Resume Match
          </Text>
        </View>

        <View
          style={
            styles.scoreBadge
          }
        >
          <Text
            style={
              styles.score
            }
          >
            {analysis.score}%
          </Text>
        </View>
      </View>

      <Text
        style={
          styles.summary
        }
      >
        {analysis.summary}
      </Text>

      <View
        style={
          styles.scoreTrack
        }
      >
        <View
          style={[
            styles.scoreFill,
            {
              width:
                `${analysis.score}%`,
            },
          ]}
        />
      </View>

      <Text
        style={
          styles.level
        }
      >
        {analysis.level
          .charAt(0)
          .toUpperCase() +
          analysis.level.slice(1)}
        {' '}resume alignment
      </Text>

      {analysis
        .matchedSkills
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
            Supported skills
          </Text>

          <View
            style={
              styles.chips
            }
          >
            {analysis
              .matchedSkills
              .map(
                (skill) => (
                  <View
                    key={
                      `matched-${skill}`
                    }
                    style={
                      styles.matchChip
                    }
                  >
                    <Text
                      style={
                        styles.matchChipText
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

      {analysis
        .missingSkills
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
            Not shown on resume
          </Text>

          <View
            style={
              styles.chips
            }
          >
            {analysis
              .missingSkills
              .slice(0, 8)
              .map(
                (skill) => (
                  <View
                    key={
                      `missing-${skill}`
                    }
                    style={
                      styles.gapChip
                    }
                  >
                    <Text
                      style={
                        styles.gapChipText
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

      {analysis
        .relevantProjects
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
            Relevant projects
          </Text>

          {analysis
            .relevantProjects
            .map(
              (project) => (
                <Text
                  key={
                    project
                  }
                  style={
                    styles.evidence
                  }
                >
                  • {project}
                </Text>
              )
            )}
        </View>
      )}

      {analysis
        .relevantExperience
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
            Relevant experience
          </Text>

          {analysis
            .relevantExperience
            .map(
              (
                experience,
                index
              ) => (
                <Text
                  key={
                    `${experience}-${index}`
                  }
                  style={
                    styles.evidence
                  }
                >
                  • {experience}
                </Text>
              )
            )}
        </View>
      )}

      <View
        style={
          styles.explanation
        }
      >
        <Text
          style={
            styles.explanationText
          }
        >
          Job Match measures whether
          the job fits your preferences.
          Resume Match measures how
          much evidence your current
          resume provides for the role.
        </Text>
      </View>
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

    header: {
      flexDirection: 'row',

      alignItems:
        'flex-start',

      justifyContent:
        'space-between',

      gap: 12,
    },

    headerText: {
      flex: 1,
    },

    eyebrow: {
      color: '#72D6A7',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.1,

      marginBottom: 5,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: '900',
    },

    scoreBadge: {
      backgroundColor:
        '#17372F',

      borderRadius: 11,

      paddingHorizontal: 12,

      paddingVertical: 8,
    },

    score: {
      color: '#86E1B9',

      fontSize: 16,

      fontWeight: '900',
    },

    summary: {
      color: '#A5ADBE',

      fontSize: 11,

      lineHeight: 17,

      marginTop: 10,
    },

    scoreTrack: {
      height: 7,

      backgroundColor:
        '#242B3D',

      borderRadius: 99,

      overflow: 'hidden',

      marginTop: 15,
    },

    scoreFill: {
      height: '100%',

      backgroundColor:
        '#72D6A7',

      borderRadius: 99,
    },

    level: {
      color: '#748094',

      fontSize: 9,

      fontWeight: '700',

      marginTop: 7,
    },

    section: {
      marginTop: 17,
    },

    sectionTitle: {
      color: '#D8DCE7',

      fontSize: 11,

      fontWeight: '900',

      marginBottom: 8,
    },

    chips: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 7,
    },

    matchChip: {
      backgroundColor:
        '#17372F',

      borderWidth: 1,

      borderColor:
        '#28594A',

      borderRadius: 8,

      paddingHorizontal: 9,

      paddingVertical: 6,
    },

    matchChipText: {
      color: '#86E1B9',

      fontSize: 9,

      fontWeight: '800',
    },

    gapChip: {
      backgroundColor:
        '#332D1A',

      borderWidth: 1,

      borderColor:
        '#594D27',

      borderRadius: 8,

      paddingHorizontal: 9,

      paddingVertical: 6,
    },

    gapChipText: {
      color: '#D6B75B',

      fontSize: 9,

      fontWeight: '800',
    },

    evidence: {
      color: '#929CAF',

      fontSize: 10,

      lineHeight: 17,

      marginTop: 4,
    },

    explanation: {
      backgroundColor:
        '#0C1220',

      borderRadius: 10,

      padding: 11,

      marginTop: 18,
    },

    explanationText: {
      color: '#646D82',

      fontSize: 9,

      lineHeight: 14,
    },
  });
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Job,
} from '../types/Job';

import {
  JobProfile,
} from '../profile/jobProfile';

import {
  ResumeProfile,
} from '../profile/resumeProfile';

import {
  generateApplicationCopilot,
} from '../matching/applicationCopilot';

type ApplicationCopilotCardProps = {
  job: Job;

  preferences: JobProfile;

  resume: ResumeProfile;
};

export default function ApplicationCopilotCard({
  job,
  preferences,
  resume,
}: ApplicationCopilotCardProps) {
  const copilot =
    generateApplicationCopilot(
      job,
      preferences,
      resume
    );

  function renderRows(
    items: string[],
    symbol: string,
    symbolStyle:
      | 'positive'
      | 'warning'
      | 'evidence'
      | 'emphasis'
  ) {
    return items.map(
      (item, index) => (
        <View
          key={`${symbolStyle}-${index}`}
          style={styles.row}
        >
          <Text
            style={[
              styles.bullet,

              symbolStyle ===
                'positive' &&
                styles.positiveBullet,

              symbolStyle ===
                'warning' &&
                styles.warningBullet,

              symbolStyle ===
                'evidence' &&
                styles.evidenceBullet,

              symbolStyle ===
                'emphasis' &&
                styles.emphasisBullet,
            ]}
          >
            {symbol}
          </Text>

          <Text
            style={
              styles.rowText
            }
          >
            {item}
          </Text>
        </View>
      )
    );
  }

  return (
    <View style={styles.card}>
      {/* HEADER */}

      <View style={styles.header}>
        <View
          style={
            styles.headerText
          }
        >
          <Text
            style={
              styles.eyebrow
            }
          >
            JOB COPILOT
          </Text>

          <Text
            style={
              styles.title
            }
          >
            Application Copilot
          </Text>
        </View>

        {job.matchScore !==
          undefined && (
          <View
            style={
              styles.scoreBadge
            }
          >
            <Text
              style={
                styles.scoreText
              }
            >
              {job.matchScore}%
            </Text>
          </View>
        )}
      </View>

      <Text
        style={
          styles.description
        }
      >
        Compares this listing with
        your Job Preferences and
        Resume Profile.
      </Text>

      {/* STRENGTHS */}

      <View style={styles.section}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Your strengths
        </Text>

        {renderRows(
          copilot.strengths,
          '✓',
          'positive'
        )}
      </View>

      <View style={styles.divider} />

      {/* EVIDENCE */}

      <View style={styles.section}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Resume evidence
        </Text>

        <Text
          style={
            styles.sectionDescription
          }
        >
          Projects, experience and
          education you may be able to
          use as evidence.
        </Text>

        {renderRows(
          copilot.evidence,
          '◆',
          'evidence'
        )}
      </View>

      <View style={styles.divider} />

      {/* EMPHASIZE */}

      <View style={styles.section}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          What to emphasize
        </Text>

        {renderRows(
          copilot.emphasize,
          '→',
          'emphasis'
        )}
      </View>

      <View style={styles.divider} />

      {/* GAPS */}

      <View style={styles.section}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Gaps to prepare
        </Text>

        {renderRows(
          copilot.gaps,
          '•',
          'warning'
        )}
      </View>

      <View style={styles.divider} />

      {/* INTERVIEW */}

      <View style={styles.section}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Interview preparation
        </Text>

        {copilot
          .interviewQuestions
          .map(
            (
              question,
              index
            ) => (
              <View
                key={`question-${index}`}
                style={
                  styles.row
                }
              >
                <Text
                  style={
                    styles.numberBullet
                  }
                >
                  {index + 1}.
                </Text>

                <Text
                  style={
                    styles.rowText
                  }
                >
                  {question}
                </Text>
              </View>
            )
          )}
      </View>

      <View style={styles.divider} />

      {/* CHECKLIST */}

      <View style={styles.section}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Before applying
        </Text>

        {copilot.checklist.map(
          (item, index) => (
            <View
              key={`check-${index}`}
              style={
                styles.row
              }
            >
              <Text
                style={
                  styles.checkBullet
                }
              >
                □
              </Text>

              <Text
                style={
                  styles.rowText
                }
              >
                {item}
              </Text>
            </View>
          )
        )}
      </View>

      <Text style={styles.footer}>
        Generated locally from the
        job listing, Job Preferences
        and saved Resume Profile.
      </Text>
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
        '#47377A',

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
      color: '#8B5CF6',

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
        '#19372F',

      borderRadius: 9,

      paddingHorizontal: 10,

      paddingVertical: 7,
    },

    scoreText: {
      color: '#86E1B9',

      fontSize: 11,

      fontWeight: '900',
    },

    description: {
      color: '#7F879B',

      fontSize: 11,

      lineHeight: 17,

      marginTop: 7,
    },

    section: {
      marginTop: 16,
    },

    sectionTitle: {
      color: '#D8DCE7',

      fontSize: 12,

      fontWeight: '900',

      marginBottom: 3,
    },

    sectionDescription: {
      color: '#646D82',

      fontSize: 9,

      lineHeight: 14,

      marginTop: 4,

      marginBottom: 3,
    },

    row: {
      flexDirection: 'row',

      alignItems:
        'flex-start',

      marginTop: 9,
    },

    rowText: {
      flex: 1,

      color: '#A5ADBE',

      fontSize: 11,

      lineHeight: 17,
    },

    bullet: {
      width: 23,

      fontWeight: '900',
    },

    positiveBullet: {
      color: '#72D6A7',

      fontSize: 11,
    },

    warningBullet: {
      color: '#D6B75B',

      fontSize: 17,

      lineHeight: 17,
    },

    evidenceBullet: {
      color: '#72A9E8',

      fontSize: 10,

      lineHeight: 17,
    },

    emphasisBullet: {
      color: '#A78BFA',

      fontSize: 13,

      lineHeight: 17,
    },

    numberBullet: {
      color: '#A78BFA',

      width: 23,

      fontSize: 10,

      lineHeight: 17,

      fontWeight: '900',
    },

    checkBullet: {
      color: '#8B93A7',

      width: 23,

      fontSize: 14,

      lineHeight: 17,

      fontWeight: '900',
    },

    divider: {
      height: 1,

      backgroundColor:
        '#252C40',

      marginTop: 17,
    },

    footer: {
      color: '#596176',

      fontSize: 9,

      lineHeight: 14,

      marginTop: 18,
    },
  });
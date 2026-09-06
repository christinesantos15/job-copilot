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
  analyzeApplicationReadiness,
} from '../matching/applicationReadiness';

type ApplicationReadinessCardProps = {
  job: Job;

  resume: ResumeProfile;
};

export default function ApplicationReadinessCard({
  job,
  resume,
}: ApplicationReadinessCardProps) {
  const readiness =
    analyzeApplicationReadiness(
      job,
      resume
    );

  return (
    <View
      style={
        styles.card
      }
    >
      <View
        style={
          styles.header
        }
      >
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
            APPLICATION DECISION
          </Text>

          <Text
            style={
              styles.title
            }
          >
            {readiness.label}
          </Text>
        </View>

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
            {readiness.score}
          </Text>

          <Text
            style={
              styles.scoreSuffix
            }
          >
            /100
          </Text>
        </View>
      </View>

      <Text
        style={
          styles.summary
        }
      >
        {readiness.summary}
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
                `${readiness.score}%`,
            },
          ]}
        />
      </View>

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
          Why
        </Text>

        {readiness.reasons.map(
          (
            reason,
            index
          ) => (
            <View
              key={
                `reason-${index}`
              }
              style={
                styles.reasonRow
              }
            >
              <Text
                style={
                  styles.reasonBullet
                }
              >
                •
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

      <View
        style={
          styles.actionBox
        }
      >
        <Text
          style={
            styles.actionLabel
          }
        >
          NEXT ACTION
        </Text>

        <Text
          style={
            styles.actionText
          }
        >
          {readiness.nextAction}
        </Text>
      </View>

      <Text
        style={
          styles.disclaimer
        }
      >
        Readiness helps prioritize
        applications. It does not
        predict whether an employer
        will interview or hire you.
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
        '#4A3A72',

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
      color: '#A78BFA',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.1,

      marginBottom: 5,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 20,

      fontWeight: '900',
    },

    scoreBadge: {
      flexDirection: 'row',

      alignItems:
        'baseline',

      backgroundColor:
        '#29204C',

      borderRadius: 11,

      paddingHorizontal: 11,

      paddingVertical: 8,
    },

    scoreText: {
      color: '#C4B5FD',

      fontSize: 17,

      fontWeight: '900',
    },

    scoreSuffix: {
      color: '#786A99',

      fontSize: 8,

      fontWeight: '800',

      marginLeft: 2,
    },

    summary: {
      color: '#A5ADBE',

      fontSize: 11,

      lineHeight: 17,

      marginTop: 11,
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
        '#8B5CF6',

      borderRadius: 99,
    },

    section: {
      marginTop: 17,
    },

    sectionTitle: {
      color: '#D8DCE7',

      fontSize: 11,

      fontWeight: '900',

      marginBottom: 4,
    },

    reasonRow: {
      flexDirection: 'row',

      alignItems:
        'flex-start',

      marginTop: 8,
    },

    reasonBullet: {
      color: '#A78BFA',

      width: 18,

      fontSize: 14,

      lineHeight: 17,
    },

    reasonText: {
      flex: 1,

      color: '#929CAF',

      fontSize: 10,

      lineHeight: 17,
    },

    actionBox: {
      backgroundColor:
        '#0C1220',

      borderWidth: 1,

      borderColor:
        '#282F43',

      borderRadius: 11,

      padding: 12,

      marginTop: 17,
    },

    actionLabel: {
      color: '#72D6A7',

      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 0.8,
    },

    actionText: {
      color: '#B3BBCB',

      fontSize: 10,

      lineHeight: 16,

      marginTop: 5,
    },

    disclaimer: {
      color: '#596176',

      fontSize: 8,

      lineHeight: 13,

      marginTop: 13,
    },
  });
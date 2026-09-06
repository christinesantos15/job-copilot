import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Job } from '../types/Job';

import {
  generateApplicationCopilot,
} from '../matching/applicationCopilot';

type ApplicationCopilotCardProps = {
  job: Job;
};

export default function ApplicationCopilotCard({
  job,
}: ApplicationCopilotCardProps) {
  const copilot =
    generateApplicationCopilot(job);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            JOB COPILOT
          </Text>

          <Text style={styles.title}>
            Application Copilot
          </Text>
        </View>

        {job.matchScore !==
          undefined && (
          <View style={styles.scoreBadge}>
            <Text
              style={styles.scoreText}
            >
              {job.matchScore}%
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>
        Prepare for this opportunity
        using your match and the job
        requirements.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Your strengths
        </Text>

        {copilot.strengths.map(
          (item, index) => (
            <View
              key={`strength-${index}`}
              style={styles.row}
            >
              <Text
                style={
                  styles.positiveBullet
                }
              >
                ✓
              </Text>

              <Text style={styles.rowText}>
                {item}
              </Text>
            </View>
          )
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Gaps to prepare
        </Text>

        {copilot.gaps.map(
          (item, index) => (
            <View
              key={`gap-${index}`}
              style={styles.row}
            >
              <Text
                style={
                  styles.warningBullet
                }
              >
                •
              </Text>

              <Text style={styles.rowText}>
                {item}
              </Text>
            </View>
          )
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Interview preparation
        </Text>

        {copilot.interviewQuestions.map(
          (question, index) => (
            <View
              key={`question-${index}`}
              style={styles.row}
            >
              <Text
                style={
                  styles.numberBullet
                }
              >
                {index + 1}.
              </Text>

              <Text style={styles.rowText}>
                {question}
              </Text>
            </View>
          )
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Before applying
        </Text>

        {copilot.checklist.map(
          (item, index) => (
            <View
              key={`check-${index}`}
              style={styles.row}
            >
              <Text
                style={
                  styles.checkBullet
                }
              >
                □
              </Text>

              <Text style={styles.rowText}>
                {item}
              </Text>
            </View>
          )
        )}
      </View>

      <Text style={styles.footer}>
        Generated locally from the job
        listing and your current match
        data.
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor: '#111727',
      borderWidth: 1,
      borderColor: '#47377A',
      borderRadius: 18,
      padding: 17,
      marginBottom: 15,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent:
        'space-between',
      gap: 12,
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
      backgroundColor: '#19372F',
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

    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 9,
    },

    rowText: {
      flex: 1,
      color: '#A5ADBE',
      fontSize: 11,
      lineHeight: 17,
    },

    positiveBullet: {
      color: '#72D6A7',
      width: 23,
      fontSize: 11,
      fontWeight: '900',
    },

    warningBullet: {
      color: '#D6B75B',
      width: 23,
      fontSize: 17,
      lineHeight: 17,
      fontWeight: '900',
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
      backgroundColor: '#252C40',
      marginTop: 17,
    },

    footer: {
      color: '#596176',
      fontSize: 9,
      lineHeight: 14,
      marginTop: 18,
    },
  });
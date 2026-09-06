import {
  Pressable,
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
  generateCoverLetter,
} from '../matching/coverLetterGenerator';

type CoverLetterCardProps = {
  job: Job;

  preferences: JobProfile;

  resume: ResumeProfile;
};

export default function CoverLetterCard({
  job,
  preferences,
  resume,
}: CoverLetterCardProps) {
  const draft =
    generateCoverLetter(
      job,
      resume,
      preferences
    );

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>
        APPLICATION DRAFT
      </Text>

      <Text style={styles.title}>
        Cover Letter
      </Text>

      <Text
        style={
          styles.description
        }
      >
        A job-specific draft built
        only from your saved Resume
        Profile and this job listing.
      </Text>

      <View
        style={
          styles.letterCard
        }
      >
        <Text
          style={
            styles.letterText
          }
        >
          {draft.fullText}
        </Text>
      </View>

      {draft.warnings.length >
        0 && (
        <View
          style={
            styles.warningCard
          }
        >
          <Text
            style={
              styles.warningTitle
            }
          >
            Review before using
          </Text>

          {draft.warnings.map(
            (
              warning,
              index
            ) => (
              <View
                key={`${warning}-${index}`}
                style={
                  styles.warningRow
                }
              >
                <Text
                  style={
                    styles.warningBullet
                  }
                >
                  •
                </Text>

                <Text
                  style={
                    styles.warningText
                  }
                >
                  {warning}
                </Text>
              </View>
            )
          )}
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.copyPreviewButton,

          pressed &&
            styles.pressed,
        ]}
        disabled
      >
        <Text
          style={
            styles.copyPreviewText
          }
        >
          Copy coming next
        </Text>
      </Pressable>
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

    eyebrow: {
      color: '#A78BFA',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1,
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

    letterCard: {
      backgroundColor:
        '#F3F4F6',

      borderRadius: 14,

      padding: 16,

      marginTop: 15,
    },

    letterText: {
      color: '#1C2230',

      fontSize: 12,

      lineHeight: 20,
    },

    warningCard: {
      backgroundColor:
        '#211B13',

      borderWidth: 1,

      borderColor:
        '#594B25',

      borderRadius: 12,

      padding: 13,

      marginTop: 14,
    },

    warningTitle: {
      color: '#E9CC70',

      fontSize: 11,

      fontWeight: '900',
    },

    warningRow: {
      flexDirection: 'row',

      alignItems:
        'flex-start',

      marginTop: 8,
    },

    warningBullet: {
      color: '#D6B75B',

      width: 17,

      fontSize: 12,

      fontWeight: '900',
    },

    warningText: {
      flex: 1,

      color: '#BDAF80',

      fontSize: 10,

      lineHeight: 16,
    },

    copyPreviewButton: {
      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        '#171E2F',

      borderRadius: 11,

      paddingVertical: 12,

      marginTop: 14,

      opacity: 0.55,
    },

    copyPreviewText: {
      color: '#8B93A8',

      fontSize: 10,

      fontWeight: '800',
    },

    pressed: {
      opacity: 0.7,
    },
  });
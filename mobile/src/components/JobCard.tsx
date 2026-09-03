import { useRef } from 'react';

import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Job } from '../types/Job';

import { evaluateJob } from '../matching/jobMatcher';

type JobCardProps = {
  job: Job;
  onInterested: (job: Job) => void;
  onSkipped: (job: Job) => void;
};

export default function JobCard({
  job,
  onInterested,
  onSkipped,
}: JobCardProps) {
  const match = evaluateJob(job);

  const position =
    useRef(
      new Animated.ValueXY()
    ).current;

  const rotate =
    position.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: [
        '-8deg',
        '0deg',
        '8deg',
      ],
      extrapolate: 'clamp',
    });

  const interestedOpacity =
    position.x.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const skippedOpacity =
    position.x.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

  function swipeOffScreen(
    direction: 'left' | 'right'
  ) {
    const destinationX =
      direction === 'right'
        ? 500
        : -500;

    Animated.timing(
      position,
      {
        toValue: {
          x: destinationX,
          y: 0,
        },
        duration: 250,
        useNativeDriver:
          false,
      }
    ).start(() => {
      position.setValue({
        x: 0,
        y: 0,
      });

      if (
        direction ===
        'right'
      ) {
        onInterested(job);
      } else {
        onSkipped(job);
      }
    });
  }

  const panResponder =
    useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder:
          (
            _,
            gestureState
          ) =>
            Math.abs(
              gestureState.dx
            ) > 10,

        onPanResponderMove:
          (
            _,
            gestureState
          ) => {
            position.setValue({
              x: gestureState.dx,
              y:
                gestureState.dy *
                0.2,
            });
          },

        onPanResponderRelease:
          (
            _,
            gestureState
          ) => {
            if (
              gestureState.dx >
              100
            ) {
              swipeOffScreen(
                'right'
              );
            } else if (
              gestureState.dx <
              -100
            ) {
              swipeOffScreen(
                'left'
              );
            } else {
              Animated.spring(
                position,
                {
                  toValue: {
                    x: 0,
                    y: 0,
                  },
                  useNativeDriver:
                    false,
                }
              ).start();
            }
          },
      })
    ).current;

  const displayedSkills =
    job.skills?.slice(
      0,
      4
    ) ?? [];

  return (
    <View style={styles.cardArea}>
      <View style={styles.backCard} />

      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              ...position.getTranslateTransform(),
              { rotate },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.interestedOverlay,
            {
              opacity:
                interestedOpacity,
            },
          ]}
        >
          <Text
            style={
              styles.interestedOverlayText
            }
          >
            INTERESTED
          </Text>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.passOverlay,
            {
              opacity:
                skippedOpacity,
            },
          ]}
        >
          <Text
            style={
              styles.passOverlayText
            }
          >
            PASS
          </Text>
        </Animated.View>

        <View style={styles.topRow}>
          <View style={styles.newBadge}>
            <Text
              style={
                styles.newBadgeText
              }
            >
              New
            </Text>
          </View>

          <Text
            style={
              styles.postedText
            }
          >
            Recommended
          </Text>
        </View>

        <Text
          style={styles.title}
          numberOfLines={2}
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

          <Text
            style={styles.company}
            numberOfLines={1}
          >
            {job.company}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text
            style={styles.infoIcon}
          >
            ◉
          </Text>

          <Text
            style={styles.infoText}
          >
            {job.location}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text
            style={styles.infoIcon}
          >
            ◷
          </Text>

          <Text
            style={styles.infoText}
          >
            {job.type}
          </Text>
        </View>

        {job.salary && (
          <View
            style={
              styles.salaryContainer
            }
          >
            <Text
              style={
                styles.salaryLabel
              }
            >
              Salary
            </Text>

            <Text
              style={styles.salary}
            >
              {job.salary}
            </Text>
          </View>
        )}

        {displayedSkills.length >
          0 && (
          <View style={styles.skills}>
            {displayedSkills.map(
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
        )}

        {job.description && (
          <Text
            style={
              styles.description
            }
            numberOfLines={3}
          >
            {job.description}
          </Text>
        )}

        <View style={styles.divider} />

        <View style={styles.matchRow}>
          <View
            style={
              styles.matchBadge
            }
          >
            <View
              style={
                styles.matchDot
              }
            />

            <Text
              style={
                styles.matchScore
              }
            >
              {match.score}% match
            </Text>
          </View>

          <Text
            style={styles.source}
            numberOfLines={1}
          >
            {job.sourceLabel ??
              job.source}
          </Text>
        </View>

        {match.reasons.length >
          0 && (
          <Text
            style={
              styles.matchReason
            }
            numberOfLines={2}
          >
            ✓ {match.reasons[0]}
          </Text>
        )}

        {match.warnings.length >
          0 && (
          <Text
            style={styles.warning}
            numberOfLines={2}
          >
            ⚠ {match.warnings[0]}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    cardArea: {
      width: '100%',
      minHeight: 440,
      position: 'relative',
      marginBottom: 20,
    },

    backCard: {
      position: 'absolute',
      top: 12,
      left: 10,
      right: 10,
      bottom: -2,
      borderRadius: 24,
      backgroundColor:
        '#1B2132',
      transform: [
        {
          scale: 0.97,
        },
      ],
    },

    card: {
      width: '100%',
      minHeight: 430,
      backgroundColor:
        '#F8FAFC',
      borderRadius: 24,
      padding: 22,
      shadowColor:
        '#000000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.28,
      shadowRadius: 20,
      elevation: 10,
    },

    topRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },

    newBadge: {
      backgroundColor:
        '#EDE9FE',
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 20,
    },

    newBadgeText: {
      color: '#7C3AED',
      fontSize: 11,
      fontWeight: '800',
    },

    postedText: {
      color: '#9298A7',
      fontSize: 11,
      fontWeight: '600',
    },

    title: {
      color: '#111827',
      fontSize: 25,
      lineHeight: 31,
      fontWeight: '800',
      marginBottom: 16,
    },

    companyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },

    companyIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor:
        '#EEE9FF',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 10,
    },

    companyInitial: {
      color: '#7C3AED',
      fontWeight: '800',
      fontSize: 15,
    },

    company: {
      flex: 1,
      color: '#343A49',
      fontSize: 15,
      fontWeight: '700',
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 9,
    },

    infoIcon: {
      width: 25,
      color: '#7C3AED',
      fontSize: 14,
    },

    infoText: {
      flex: 1,
      color: '#606778',
      fontSize: 14,
      fontWeight: '500',
    },

    salaryContainer: {
      marginTop: 10,
      marginBottom: 16,
    },

    salaryLabel: {
      color: '#969CAA',
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 3,
      textTransform:
        'uppercase',
      letterSpacing: 0.5,
    },

    salary: {
      color: '#1D2433',
      fontSize: 17,
      fontWeight: '800',
    },

    skills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginBottom: 16,
    },

    skillChip: {
      backgroundColor:
        '#F0EDFF',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 9,
    },

    skillText: {
      color: '#6850C7',
      fontSize: 11,
      fontWeight: '700',
    },

    description: {
      color: '#666D7D',
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 17,
    },

    divider: {
      height: 1,
      backgroundColor:
        '#E6E8ED',
      marginBottom: 15,
    },

    matchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    matchBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#E9F9F2',
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
    },

    matchDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        '#22B981',
      marginRight: 6,
    },

    matchScore: {
      color: '#159669',
      fontSize: 12,
      fontWeight: '800',
    },

    source: {
      maxWidth: '45%',
      color: '#969CAA',
      fontSize: 10,
      fontWeight: '600',
    },

    matchReason: {
      color: '#159669',
      fontSize: 11,
      lineHeight: 16,
      marginTop: 12,
    },

    warning: {
      color: '#B7791F',
      fontSize: 11,
      lineHeight: 16,
      marginTop: 7,
    },

    interestedOverlay: {
      position: 'absolute',
      zIndex: 20,
      top: 35,
      left: 22,
      paddingHorizontal: 13,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 3,
      borderColor:
        '#22B981',
      transform: [
        {
          rotate:
            '-10deg',
        },
      ],
    },

    interestedOverlayText: {
      color: '#22B981',
      fontSize: 18,
      fontWeight: '900',
    },

    passOverlay: {
      position: 'absolute',
      zIndex: 20,
      top: 35,
      right: 22,
      paddingHorizontal: 13,
      paddingVertical: 7,
      borderRadius: 8,
      borderWidth: 3,
      borderColor:
        '#EF4444',
      transform: [
        {
          rotate:
            '10deg',
        },
      ],
    },

    passOverlayText: {
      color: '#EF4444',
      fontSize: 18,
      fontWeight: '900',
    },
  });
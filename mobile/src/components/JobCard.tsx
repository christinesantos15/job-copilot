import { useRef } from 'react';

import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
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
    useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [
      '-10deg',
      '0deg',
      '10deg',
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

    Animated.timing(position, {
      toValue: {
        x: destinationX,
        y: 0,
      },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({
        x: 0,
        y: 0,
      });

      if (direction === 'right') {
        onInterested(job);
      } else {
        onSkipped(job);
      }
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (
        _,
        gestureState
      ) => {
        return (
          Math.abs(
            gestureState.dx
          ) > 10
        );
      },

      onPanResponderMove: (
        _,
        gestureState
      ) => {
        position.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },

      onPanResponderRelease: (
        _,
        gestureState
      ) => {
        if (gestureState.dx > 100) {
          swipeOffScreen('right');
        } else if (
          gestureState.dx < -100
        ) {
          swipeOffScreen('left');
        } else {
          Animated.spring(position, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
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
      <Animated.Text
        style={[
          styles.interestedLabel,
          {
            opacity:
              interestedOpacity,
          },
        ]}
      >
        INTERESTED
      </Animated.Text>

      <Animated.Text
        style={[
          styles.skippedLabel,
          {
            opacity:
              skippedOpacity,
          },
        ]}
      >
        SKIP
      </Animated.Text>

      <Text style={styles.title}>
        {job.title}
      </Text>

      <Text style={styles.matchScore}>
        Match score: {match.score}%
      </Text>

      {match.reasons.length > 0 && (
        <>
          <Text
            style={styles.matchHeading}
          >
            Why it matches
          </Text>

          {match.reasons
            .slice(0, 3)
            .map((reason) => (
              <Text
                key={reason}
                style={styles.matchReason}
              >
                ✓ {reason}
              </Text>
            ))}
        </>
      )}

      <Text>
        Company: {job.company}
      </Text>

      <Text>
        Location: {job.location}
      </Text>

      {job.salary && (
        <Text>
          Salary: {job.salary}
        </Text>
      )}

      <Text>
        Type: {job.type}
      </Text>

      <Text>
        Source:{' '}
        {job.sourceLabel ?? job.source}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 240,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  matchScore: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  matchHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 6,
  },

  matchReason: {
    marginBottom: 3,
  },

  interestedLabel: {
    position: 'absolute',
    top: 15,
    left: 15,
    fontSize: 22,
    fontWeight: 'bold',
    borderWidth: 2,
    padding: 6,
    borderRadius: 6,
    zIndex: 1,
  },

  skippedLabel: {
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 22,
    fontWeight: 'bold',
    borderWidth: 2,
    padding: 6,
    borderRadius: 6,
    zIndex: 1,
  },
});
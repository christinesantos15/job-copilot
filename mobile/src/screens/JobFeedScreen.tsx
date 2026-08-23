import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Job } from '../types/Job';
import JobCard from '../components/JobCard';

type JobFeedScreenProps = {
  job: Job;
  interestedCount: number;
  onInterested: (job: Job) => void;
  onSkipped: (job: Job) => void;
  onViewInterested: () => void;
};

export default function JobFeedScreen({
  job,
  interestedCount,
  onInterested,
  onSkipped,
  onViewInterested,
}: JobFeedScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Job Copilot
      </Text>

      <JobCard
        job={job}
        onInterested={onInterested}
        onSkipped={onSkipped}
      />

      <Text style={styles.counter}>
        Interested jobs: {interestedCount}
      </Text>

      <Button
        title="View Interested Jobs"
        onPress={onViewInterested}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  counter: {
    marginBottom: 12,
  },
});
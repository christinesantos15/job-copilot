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
  onViewDetails: (job: Job) => void;
  onViewApplications: () => void;
};

export default function JobFeedScreen({
  job,
  interestedCount,
  onInterested,
  onSkipped,
  onViewInterested,
  onViewDetails,
  onViewApplications,
}: JobFeedScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Job Copilot
      </Text>

      <JobCard
        key={job.id}
        job={job}
        onInterested={onInterested}
        onSkipped={onSkipped}
      />

      <View style={styles.actions}>
        <Button
          title="View Job Details"
          onPress={() => onViewDetails(job)}
        />

        <Text style={styles.counter}>
          Interested jobs: {interestedCount}
        </Text>

        <Button
          title="View Interested Jobs"
          onPress={onViewInterested}
        />

        <Button
          title="Applications"
          onPress={onViewApplications}
        />
      </View>
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

  actions: {
    width: '100%',
    gap: 10,
  },

  counter: {
    textAlign: 'center',
    marginVertical: 4,
  },
});

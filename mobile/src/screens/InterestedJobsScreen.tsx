import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Job } from '../types/Job';

type InterestedJobsScreenProps = {
  interestedJobs: Job[];
  onBack: () => void;
  onViewDetails: (job: Job) => void;
};

export default function InterestedJobsScreen({
  interestedJobs,
  onBack,
  onViewDetails,
}: InterestedJobsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Interested Jobs
      </Text>

      {interestedJobs.length === 0 ? (
        <Text>No interested jobs yet.</Text>
      ) : (
        interestedJobs.map((job) => (
          <Pressable
            key={job.id}
            style={styles.jobCard}
            onPress={() => onViewDetails(job)}
          >
            <Text style={styles.jobTitle}>
              {job.title}
            </Text>

            <Text>{job.company}</Text>
            <Text>{job.location}</Text>
            <Text>{job.salary}</Text>
            <Text>{job.type}</Text>
            <Text>Source: {job.source}</Text>

            <Text style={styles.tapHint}>
              Tap to view details
            </Text>
          </Pressable>
        ))
      )}

      <Button
        title="Back"
        onPress={onBack}
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

  jobCard: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
  },

  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  tapHint: {
    marginTop: 10,
    fontWeight: '600',
  },
});
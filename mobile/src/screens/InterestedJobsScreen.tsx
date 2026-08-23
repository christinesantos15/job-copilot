import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Job } from '../types/Job';

type InterestedJobsScreenProps = {
  interestedJobs: Job[];
  onBack: () => void;
};

export default function InterestedJobsScreen({
  interestedJobs,
  onBack,
}: InterestedJobsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Interested Jobs
      </Text>

      {interestedJobs.length === 0 ? (
        <Text>No interested jobs yet.</Text>
      ) : (
        interestedJobs.map((job, index) => (
          <View
            key={index}
            style={styles.jobCard}
          >
            <Text style={styles.jobTitle}>
              {job.title}
            </Text>

            <Text>{job.company}</Text>
            <Text>{job.location}</Text>
            <Text>{job.salary}</Text>
            <Text>{job.type}</Text>
            <Text>Source: {job.source}</Text>
          </View>
        ))
      )}

      <Button
        title="Back to Jobs"
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
});
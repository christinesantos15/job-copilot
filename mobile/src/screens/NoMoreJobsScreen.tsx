import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type NoMoreJobsScreenProps = {
  interestedCount: number;
  onViewInterested: () => void;
};

export default function NoMoreJobsScreen({
  interestedCount,
  onViewInterested,
}: NoMoreJobsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        No more jobs available
      </Text>

      <Text style={styles.message}>
        You reached the end of the job list.
      </Text>

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

  message: {
    marginBottom: 16,
  },

  counter: {
    marginBottom: 12,
  },
});
import {
  Button,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ApplicationStatus,
  Job,
} from '../types/Job';

type InterestedJobsScreenProps = {
  interestedJobs: Job[];
  onBack: () => void;
  onViewDetails: (job: Job) => void;
  onStatusChange: (
    jobId: string,
    status: ApplicationStatus
  ) => void;
};

function formatStatus(
  status?: ApplicationStatus
) {
  if (!status) {
    return 'Interested';
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

export default function InterestedJobsScreen({
  interestedJobs,
  onBack,
  onViewDetails,
  onStatusChange,
}: InterestedJobsScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Interested Jobs
      </Text>

      {interestedJobs.length === 0 ? (
        <Text>No interested jobs yet.</Text>
      ) : (
        interestedJobs.map((job) => (
          <View
            key={job.id}
            style={styles.jobCard}
          >
            <Pressable
              onPress={() =>
                onViewDetails(job)
              }
            >
              <Text style={styles.jobTitle}>
                {job.title}
              </Text>

              <Text>{job.company}</Text>
              <Text>{job.location}</Text>

              {job.salary && (
                <Text>{job.salary}</Text>
              )}

              <Text>{job.type}</Text>

              <Text>
                Source: {job.source}
              </Text>

              <Text style={styles.status}>
                Status:{' '}
                {formatStatus(
                  job.applicationStatus
                )}
              </Text>

              <Text style={styles.tapHint}>
                Tap to view details
              </Text>
            </Pressable>

            <View style={styles.statusActions}>
              <Button
                title="Interested"
                onPress={() =>
                  onStatusChange(
                    job.id,
                    'interested'
                  )
                }
              />

              <Button
                title="Applied"
                onPress={() =>
                  onStatusChange(
                    job.id,
                    'applied'
                  )
                }
              />

              <Button
                title="Interview"
                onPress={() =>
                  onStatusChange(
                    job.id,
                    'interview'
                  )
                }
              />

              <Button
                title="Rejected"
                onPress={() =>
                  onStatusChange(
                    job.id,
                    'rejected'
                  )
                }
              />

              <Button
                title="Offer"
                onPress={() =>
                  onStatusChange(
                    job.id,
                    'offer'
                  )
                }
              />
            </View>
          </View>
        ))
      )}

      <Button
        title="Back"
        onPress={onBack}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
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

  status: {
    marginTop: 10,
    fontWeight: '600',
  },

  tapHint: {
    marginTop: 10,
    fontWeight: '600',
  },

  statusActions: {
    marginTop: 12,
    gap: 8,
  },
});
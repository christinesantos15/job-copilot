import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ApplicationStatus,
  Job,
} from '../types/Job';

type ApplicationsScreenProps = {
  jobs: Job[];
  onBack: () => void;
};

type ApplicationSectionProps = {
  title: string;
  jobs: Job[];
};

function ApplicationSection({
  title,
  jobs,
}: ApplicationSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title} — {jobs.length}
      </Text>

      {jobs.length === 0 ? (
        <Text style={styles.emptyText}>
          No jobs
        </Text>
      ) : (
        jobs.map((job) => (
          <View
            key={job.id}
            style={styles.jobCard}
          >
            <Text style={styles.jobTitle}>
              {job.title}
            </Text>

            <Text>{job.company}</Text>
            <Text>{job.location}</Text>

            {job.salary && (
              <Text>{job.salary}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
}

export default function ApplicationsScreen({
  jobs,
  onBack,
}: ApplicationsScreenProps) {
  function getJobsByStatus(
    status: ApplicationStatus
  ) {
    return jobs.filter(
      (job) =>
        job.applicationStatus === status
    );
  }

  const appliedJobs =
    getJobsByStatus('applied');

  const interviewJobs =
    getJobsByStatus('interview');

  const offerJobs =
    getJobsByStatus('offer');

  const rejectedJobs =
    getJobsByStatus('rejected');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Applications
      </Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <ApplicationSection
          title="Applied"
          jobs={appliedJobs}
        />

        <ApplicationSection
          title="Interview"
          jobs={interviewJobs}
        />

        <ApplicationSection
          title="Offers"
          jobs={offerJobs}
        />

        <ApplicationSection
          title="Rejected"
          jobs={rejectedJobs}
        />
      </ScrollView>

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
    padding: 20,
    paddingTop: 60,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  scrollView: {
    flex: 1,
    width: '100%',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  emptyText: {
    opacity: 0.6,
  },

  jobCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },

  jobTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
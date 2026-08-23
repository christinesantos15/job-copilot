import {
  Button,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Job } from '../types/Job';

type JobDetailsScreenProps = {
  job: Job;
  onBack: () => void;
};

export default function JobDetailsScreen({
  job,
  onBack,
}: JobDetailsScreenProps) {
  function openSource() {
    Linking.openURL(job.sourceUrl);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>

      <Text style={styles.company}>{job.company}</Text>
      <Text>{job.location}</Text>

      {job.salary && (
        <Text style={styles.salary}>{job.salary}</Text>
      )}

      <Text>{job.type}</Text>
      <Text>Source: {job.sourceLabel}</Text>

      {job.postedDate && (
        <Text>Posted: {job.postedDate}</Text>
      )}

      {job.closingDate && (
        <Text>Closing: {job.closingDate}</Text>
      )}

      <Text style={styles.sectionTitle}>
        Description
      </Text>

      <Text style={styles.description}>
        {job.description}
      </Text>

      <Text style={styles.sectionTitle}>
        Skills
      </Text>

      <View style={styles.skills}>
        {job.skills.map((skill) => (
          <View
            key={skill}
            style={styles.skill}
          >
            <Text>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title="Open Original Job"
          onPress={openSource}
        />

        <Button
          title="Back"
          onPress={onBack}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  company: {
    fontSize: 20,
    marginBottom: 8,
  },

  salary: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
  },

  description: {
    lineHeight: 22,
  },

  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  skill: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  actions: {
    gap: 12,
    marginTop: 30,
    marginBottom: 30,
  },
});
import {
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
  subtitle: string;
  jobs: Job[];
  status: ApplicationStatus;
};

function ApplicationSection({
  title,
  subtitle,
  jobs,
  status,
}: ApplicationSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {title}
          </Text>

          <Text style={styles.sectionSubtitle}>
            {subtitle}
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            getStatusBadgeStyle(status),
          ]}
        >
          <Text style={styles.countText}>
            {jobs.length}
          </Text>
        </View>
      </View>

      {jobs.length === 0 ? (
        <View style={styles.emptySection}>
          <Text style={styles.emptySectionText}>
            No jobs here yet
          </Text>
        </View>
      ) : (
        jobs.map((job) => (
          <View
            key={job.id}
            style={styles.jobCard}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.companyIcon}>
                <Text style={styles.companyInitial}>
                  {job.company
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              <View style={styles.cardHeading}>
                <Text
                  style={styles.jobTitle}
                  numberOfLines={2}
                >
                  {job.title}
                </Text>

                <Text
                  style={styles.company}
                  numberOfLines={1}
                >
                  {job.company}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>
                ◉
              </Text>

              <Text
                style={styles.metaText}
                numberOfLines={1}
              >
                {job.location}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>
                ◷
              </Text>

              <Text style={styles.metaText}>
                {job.type}
              </Text>
            </View>

            {job.salary && (
              <Text style={styles.salary}>
                {job.salary}
              </Text>
            )}

            <View style={styles.divider} />

            <View style={styles.footerRow}>
              <View
                style={[
                  styles.statusPill,
                  getStatusBadgeStyle(status),
                ]}
              >
                <Text style={styles.statusPillText}>
                  {formatStatus(status)}
                </Text>
              </View>

              <Text style={styles.source}>
                {job.sourceLabel ?? job.source}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

function formatStatus(
  status: ApplicationStatus
) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function getStatusBadgeStyle(
  status: ApplicationStatus
) {
  switch (status) {
    case 'applied':
      return styles.statusApplied;

    case 'interview':
      return styles.statusInterview;

    case 'offer':
      return styles.statusOffer;

    case 'rejected':
      return styles.statusRejected;

    default:
      return styles.statusApplied;
  }
}

export default function ApplicationsScreen({
  jobs,
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

  const totalApplications =
    appliedJobs.length +
    interviewJobs.length +
    offerJobs.length +
    rejectedJobs.length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          JOB COPILOT
        </Text>

        <Text style={styles.heading}>
          Applications
        </Text>

        <Text style={styles.subtitle}>
          Track your job search progress
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>
            Active pipeline
          </Text>

          <Text style={styles.summaryNumber}>
            {totalApplications}
          </Text>

          <Text style={styles.summaryText}>
            applications being tracked
          </Text>
        </View>

        <View style={styles.summaryIcon}>
          <Text style={styles.summaryIconText}>
            ▣
          </Text>
        </View>
      </View>

      <ApplicationSection
        title="Applied"
        subtitle="Applications sent"
        jobs={appliedJobs}
        status="applied"
      />

      <ApplicationSection
        title="Interview"
        subtitle="Interview stage"
        jobs={interviewJobs}
        status="interview"
      />

      <ApplicationSection
        title="Offers"
        subtitle="Offers received"
        jobs={offerJobs}
        status="offer"
      />

      <ApplicationSection
        title="Rejected"
        subtitle="Closed applications"
        jobs={rejectedJobs}
        status="rejected"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#080D1A',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },

  header: {
    marginBottom: 24,
  },

  eyebrow: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    color: '#858CA0',
    fontSize: 13,
    marginTop: 4,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 20,
    padding: 18,
    marginBottom: 26,
  },

  summaryLabel: {
    color: '#9A82F4',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  summaryNumber: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 3,
  },

  summaryText: {
    color: '#858CA0',
    fontSize: 12,
    marginTop: 2,
  },

  summaryIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#251D43',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIconText: {
    color: '#A78BFA',
    fontSize: 25,
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#747C8F',
    fontSize: 11,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 34,
    height: 28,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  emptySection: {
    backgroundColor: '#0F1523',
    borderWidth: 1,
    borderColor: '#20273A',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },

  emptySectionText: {
    color: '#687084',
    fontSize: 12,
    textAlign: 'center',
  },

  jobCard: {
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 18,
    padding: 16,
    marginBottom: 11,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#252041',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  companyInitial: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '800',
  },

  cardHeading: {
    flex: 1,
  },

  jobTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },

  company: {
    color: '#9299AC',
    fontSize: 12,
    marginTop: 3,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  metaIcon: {
    width: 22,
    color: '#8B5CF6',
    fontSize: 11,
  },

  metaText: {
    flex: 1,
    color: '#9CA4B7',
    fontSize: 11,
  },

  salary: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: '#252C40',
    marginVertical: 13,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusPill: {
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  statusPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  source: {
    color: '#747C8F',
    fontSize: 10,
    maxWidth: '45%',
  },

  statusApplied: {
    backgroundColor: '#1E3351',
  },

  statusInterview: {
    backgroundColor: '#49391D',
  },

  statusOffer: {
    backgroundColor: '#153B31',
  },

  statusRejected: {
    backgroundColor: '#42232B',
  },
});
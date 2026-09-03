import {
  Pressable,
  ScrollView,
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              Job Copilot
            </Text>

            <Text style={styles.subtitle}>
              Find your next opportunity
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.headerButton}>
              <Text style={styles.headerIcon}>
                🔍
              </Text>
            </Pressable>

            <Pressable style={styles.headerButton}>
              <Text style={styles.headerIcon}>
                ⚙
              </Text>
            </Pressable>
          </View>
        </View>

        {/* TOP TABS */}

        <View style={styles.topTabs}>
          <View style={styles.activeTab}>
            <Text style={styles.activeTabText}>
              Discover
            </Text>
          </View>

          <Pressable
            style={styles.inactiveTab}
            onPress={onViewApplications}
          >
            <Text style={styles.inactiveTabText}>
              Applications
            </Text>
          </Pressable>
        </View>

        {/* SECTION TITLE */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Recommended for you
            </Text>

            <Text style={styles.sectionSubtitle}>
              Based on your skills and preferences
            </Text>
          </View>

          <View style={styles.matchCounter}>
            <Text style={styles.matchCounterText}>
              {interestedCount} saved
            </Text>
          </View>
        </View>

        {/* JOB CARD */}

        <JobCard
          key={job.id}
          job={job}
          onInterested={onInterested}
          onSkipped={onSkipped}
        />

        {/* DETAILS */}

        <Pressable
          style={styles.detailsButton}
          onPress={() =>
            onViewDetails(job)
          }
        >
          <Text style={styles.detailsText}>
            See details
          </Text>

          <Text style={styles.detailsArrow}>
            ›
          </Text>
        </Pressable>

        {/* ACTION BUTTONS */}

        <View style={styles.swipeActions}>
          <Pressable
            style={[
              styles.actionButton,
              styles.passButton,
            ]}
            onPress={() =>
              onSkipped(job)
            }
          >
            <Text style={styles.passIcon}>
              ×
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.actionButton,
              styles.interestedButton,
            ]}
            onPress={() =>
              onInterested(job)
            }
          >
            <Text style={styles.interestedIcon}>
              ♥
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionLabels}>
          <Text style={styles.actionLabel}>
            Pass
          </Text>

          <Text style={styles.actionLabel}>
            Interested
          </Text>
        </View>

        {/* SAVED JOBS SHORTCUT */}

        <Pressable
          style={styles.savedButton}
          onPress={onViewInterested}
        >
          <Text style={styles.savedButtonText}>
            View {interestedCount}{' '}
            {interestedCount === 1
              ? 'match'
              : 'matches'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080D1A',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },

  /*
   * HEADER
   */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },

  subtitle: {
    color: '#8B91A5',
    fontSize: 13,
    marginTop: 3,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },

  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#151B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIcon: {
    fontSize: 17,
  },

  /*
   * TOP TABS
   */

  topTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#20263A',
    marginBottom: 24,
  },

  activeTab: {
    paddingHorizontal: 6,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
    marginRight: 26,
  },

  inactiveTab: {
    paddingHorizontal: 6,
    paddingBottom: 12,
  },

  activeTabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  inactiveTabText: {
    color: '#7F879B',
    fontSize: 15,
    fontWeight: '600',
  },

  /*
   * RECOMMENDED SECTION
   */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  sectionSubtitle: {
    color: '#858CA0',
    fontSize: 12,
    marginTop: 4,
  },

  matchCounter: {
    backgroundColor: '#171D2D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  matchCounterText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '700',
  },

  /*
   * DETAILS
   */

  detailsButton: {
    marginTop: -10,
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  detailsArrow: {
    color: '#8B5CF6',
    fontSize: 24,
  },

  /*
   * SWIPE ACTIONS
   */

  swipeActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 70,
    marginTop: 24,
  },

  actionButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  passButton: {
    backgroundColor: '#151B2B',
    borderColor: '#343B50',
  },

  interestedButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#A78BFA',
  },

  passIcon: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '300',
    lineHeight: 38,
  },

  interestedIcon: {
    color: '#FFFFFF',
    fontSize: 26,
  },

  actionLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 78,
    marginTop: 7,
  },

  actionLabel: {
    width: 60,
    textAlign: 'center',
    color: '#858CA0',
    fontSize: 12,
    fontWeight: '600',
  },

  /*
   * SAVED
   */

  savedButton: {
    alignSelf: 'center',
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  savedButtonText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '700',
  },
});
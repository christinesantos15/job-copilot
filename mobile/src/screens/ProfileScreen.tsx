import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const skills = [
  'React',
  'TypeScript',
  'Next.js',
  'JavaScript',
  'Python',
  'FastAPI',
];

const preferences = [
  {
    label: 'Target role',
    value: 'Junior Software Engineer',
  },
  {
    label: 'Location',
    value: 'Singapore',
  },
  {
    label: 'Work style',
    value: 'Hybrid / On-site',
  },
  {
    label: 'Experience level',
    value: 'Junior / Entry-level',
  },
];

export default function ProfileScreen() {
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
          Profile
        </Text>

        <Text style={styles.subtitle}>
          Your job search preferences
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            C
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            Job Seeker
          </Text>

          <Text style={styles.role}>
            Junior Software Engineer
          </Text>

          <Text style={styles.location}>
            Singapore
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Job preferences
      </Text>

      <View style={styles.preferenceCard}>
        {preferences.map(
          (preference, index) => (
            <View
              key={preference.label}
              style={[
                styles.preferenceRow,
                index !==
                  preferences.length - 1 &&
                  styles.preferenceDivider,
              ]}
            >
              <Text style={styles.preferenceLabel}>
                {preference.label}
              </Text>

              <Text style={styles.preferenceValue}>
                {preference.value}
              </Text>
            </View>
          )
        )}
      </View>

      <Text style={styles.sectionTitle}>
        Skills
      </Text>

      <View style={styles.skillsCard}>
        <View style={styles.skills}>
          {skills.map((skill) => (
            <View
              key={skill}
              style={styles.skillChip}
            >
              <Text style={styles.skillText}>
                {skill}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Match profile
      </Text>

      <View style={styles.matchCard}>
        <View style={styles.matchTop}>
          <View>
            <Text style={styles.matchLabel}>
              Profile strength
            </Text>

            <Text style={styles.matchValue}>
              78%
            </Text>
          </View>

          <View style={styles.matchIcon}>
            <Text style={styles.matchIconText}>
              ✦
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.matchHint}>
          Job Copilot uses your skills and
          preferences to calculate match scores.
        </Text>
      </View>

      <View style={styles.versionCard}>
        <Text style={styles.versionTitle}>
          Job Copilot
        </Text>

        <Text style={styles.versionText}>
          V1.0
        </Text>
      </View>
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

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  role: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },

  location: {
    color: '#858CA0',
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 11,
  },

  preferenceCard: {
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 27,
  },

  preferenceRow: {
    paddingVertical: 15,
  },

  preferenceDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#252C40',
  },

  preferenceLabel: {
    color: '#767E92',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 5,
  },

  preferenceValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  skillsCard: {
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 18,
    padding: 16,
    marginBottom: 27,
  },

  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  skillChip: {
    backgroundColor: '#242040',
    borderWidth: 1,
    borderColor: '#3A3061',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  skillText: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '700',
  },

  matchCard: {
    backgroundColor: '#111727',
    borderWidth: 1,
    borderColor: '#252C40',
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
  },

  matchTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  matchLabel: {
    color: '#858CA0',
    fontSize: 11,
    fontWeight: '700',
  },

  matchValue: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  matchIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#251D43',
    alignItems: 'center',
    justifyContent: 'center',
  },

  matchIconText: {
    color: '#A78BFA',
    fontSize: 21,
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#22293A',
    marginTop: 15,
    overflow: 'hidden',
  },

  progressFill: {
    width: '78%',
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },

  matchHint: {
    color: '#777F92',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
  },

  versionCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  versionTitle: {
    color: '#777F92',
    fontSize: 11,
    fontWeight: '700',
  },

  versionText: {
    color: '#555D70',
    fontSize: 10,
    marginTop: 3,
  },
});
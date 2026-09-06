import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Job,
} from '../types/Job';

import {
  JobProfile,
} from '../profile/jobProfile';

import {
  ResumeProfile,
  defaultResumeProfile,
} from '../profile/resumeProfile';

import {
  loadResumeProfile,
} from '../storage/resumeProfileStorage';

import ApplicationReadinessCard
  from '../components/ApplicationReadinessCard';

import ResumeMatchCard
  from '../components/ResumeMatchCard';

import ResumeTailoringCard
  from '../components/ResumeTailoringCard';

import TailoredResumeDraftCard
  from '../components/TailoredResumeDraftCard';

import ApplicationCopilotCard
  from '../components/ApplicationCopilotCard';

type PrepareApplicationScreenProps = {
  job: Job;

  preferences: JobProfile;

  onBack: () => void;
};

export default function PrepareApplicationScreen({
  job,
  preferences,
  onBack,
}: PrepareApplicationScreenProps) {
  const [
    resumeProfile,
    setResumeProfile,
  ] = useState<ResumeProfile>(
    defaultResumeProfile
  );

  const [
    hasLoadedResume,
    setHasLoadedResume,
  ] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadResume() {
      try {
        const savedResume =
          await loadResumeProfile();

        if (isMounted) {
          setResumeProfile(
            savedResume
          );
        }
      } catch (error) {
        console.error(
          'Failed to load Resume Profile:',
          error
        );
      } finally {
        if (isMounted) {
          setHasLoadedResume(
            true
          );
        }
      }
    }

    loadResume();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Prepare Application
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            {job.title}
          </Text>

          <Text
            style={
              styles.company
            }
          >
            {job.company}
          </Text>
        </View>

        <View
          style={
            styles.headerSpacer
          }
        />
      </View>

      {hasLoadedResume ? (
        <>
          <ApplicationReadinessCard
            job={job}
            resume={
              resumeProfile
            }
          />

          <ResumeMatchCard
            job={job}
            resume={
              resumeProfile
            }
          />

          <ResumeTailoringCard
            job={job}
            resume={
              resumeProfile
            }
          />

          <TailoredResumeDraftCard
            job={job}
            resume={
              resumeProfile
            }
          />

          <ApplicationCopilotCard
            job={job}
            preferences={
              preferences
            }
            resume={
              resumeProfile
            }
          />
        </>
      ) : (
        <View
          style={
            styles.loadingCard
          }
        >
          <Text
            style={
              styles.loadingText
            }
          >
            Loading Resume Profile...
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        '#080D1A',
    },

    container: {
      paddingHorizontal: 20,

      paddingTop: 18,

      paddingBottom: 50,
    },

    header: {
      flexDirection: 'row',

      alignItems:
        'center',

      marginBottom: 20,
    },

    backButton: {
      width: 42,

      height: 42,

      borderRadius: 14,

      backgroundColor:
        '#111727',

      borderWidth: 1,

      borderColor:
        '#252C40',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    backButtonText: {
      color: '#A78BFA',

      fontSize: 30,

      lineHeight: 31,

      marginTop: -2,
    },

    headerText: {
      flex: 1,

      marginHorizontal: 12,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 20,

      fontWeight: '900',
    },

    subtitle: {
      color: '#C8CDDA',

      fontSize: 12,

      fontWeight: '800',

      marginTop: 4,
    },

    company: {
      color: '#7F879B',

      fontSize: 10,

      marginTop: 2,
    },

    headerSpacer: {
      width: 42,
    },

    loadingCard: {
      backgroundColor:
        '#111727',

      borderWidth: 1,

      borderColor:
        '#47377A',

      borderRadius: 18,

      padding: 17,
    },

    loadingText: {
      color: '#7F879B',

      fontSize: 11,
    },
  });
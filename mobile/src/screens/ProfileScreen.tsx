import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  JobProfile,
  jobProfile,
} from '../profile/jobProfile';

import {
  loadJobPreferences,
  resetJobPreferences,
  saveJobPreferences,
} from '../storage/jobPreferencesStorage';

type ProfileScreenProps = {
  onPreferencesChange?: (
    preferences: JobProfile
  ) => void;
};

function arrayToText(
  values: string[]
) {
  return values.join(', ');
}

function textToArray(
  value: string
) {
  return value
    .split(',')
    .map((item) =>
      item.trim().toLowerCase()
    )
    .filter(Boolean);
}

export default function ProfileScreen({
  onPreferencesChange,
}: ProfileScreenProps) {
  const [
    targetRoles,
    setTargetRoles,
  ] = useState('');

  const [
    preferredLocations,
    setPreferredLocations,
  ] = useState('');

  const [
    preferredLevels,
    setPreferredLevels,
  ] = useState('');

  const [
    preferredSkills,
    setPreferredSkills,
  ] = useState('');

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    hasLoaded,
    setHasLoaded,
  ] = useState(false);

  /*
   * LOAD SAVED PREFERENCES
   */

  useEffect(() => {
    async function loadPreferences() {
      try {
        const preferences =
          await loadJobPreferences();

        populateForm(
          preferences
        );
      } catch (error) {
        console.error(
          'Failed to load job preferences:',
          error
        );

        populateForm(
          jobProfile
        );
      } finally {
        setHasLoaded(true);
      }
    }

    loadPreferences();
  }, []);

  /*
   * POPULATE FORM
   */

  function populateForm(
    preferences: JobProfile
  ) {
    setTargetRoles(
      arrayToText(
        preferences.targetRoles
      )
    );

    setPreferredLocations(
      arrayToText(
        preferences.preferredLocations
      )
    );

    setPreferredLevels(
      arrayToText(
        preferences.preferredLevels
      )
    );

    setPreferredSkills(
      arrayToText(
        preferences.preferredSkills
      )
    );
  }

  /*
   * BUILD PROFILE
   */

  function buildPreferences(): JobProfile {
    return {
      targetRoles:
        textToArray(
          targetRoles
        ),

      preferredLocations:
        textToArray(
          preferredLocations
        ),

      preferredLevels:
        textToArray(
          preferredLevels
        ),

      preferredSkills:
        textToArray(
          preferredSkills
        ),

      seniorLevels:
        jobProfile.seniorLevels,

      unrelatedSpecializations:
        jobProfile.unrelatedSpecializations,
    };
  }

  /*
   * SAVE
   */

  async function handleSave() {
    const preferences =
      buildPreferences();

    if (
      preferences.targetRoles.length ===
      0
    ) {
      Alert.alert(
        'Target role required',
        'Add at least one target role.'
      );

      return;
    }

    if (
      preferences
        .preferredLocations
        .length === 0
    ) {
      Alert.alert(
        'Location required',
        'Add at least one preferred location.'
      );

      return;
    }

    try {
      setIsSaving(true);

      await saveJobPreferences(
        preferences
      );

      onPreferencesChange?.(
        preferences
      );

      Alert.alert(
        'Preferences saved',
        'Your job matches have been updated.'
      );
    } catch (error) {
      console.error(
        'Failed to save job preferences:',
        error
      );

      Alert.alert(
        'Could not save',
        'Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  /*
   * RESET
   */

  function handleReset() {
    Alert.alert(
      'Reset preferences?',
      'This will restore the default Job Copilot preferences.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetJobPreferences();

              populateForm(
                jobProfile
              );

              onPreferencesChange?.(
                jobProfile
              );

              Alert.alert(
                'Preferences reset',
                'Default preferences restored.'
              );
            } catch (error) {
              console.error(
                'Failed to reset preferences:',
                error
              );

              Alert.alert(
                'Could not reset',
                'Please try again.'
              );
            }
          },
        },
      ]
    );
  }

  /*
   * DISPLAY VALUES
   */

  const currentRoles =
    textToArray(
      targetRoles
    );

  const currentLocations =
    textToArray(
      preferredLocations
    );

  const currentSkills =
    textToArray(
      preferredSkills
    );

  let profileStrength = 0;

  if (
    currentRoles.length > 0
  ) {
    profileStrength += 25;
  }

  if (
    currentLocations.length > 0
  ) {
    profileStrength += 25;
  }

  if (
    textToArray(
      preferredLevels
    ).length > 0
  ) {
    profileStrength += 25;
  }

  if (
    currentSkills.length > 0
  ) {
    profileStrength += 25;
  }

  if (!hasLoaded) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text
          style={
            styles.loadingText
          }
        >
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Profile
        </Text>

        <Text
          style={styles.subtitle}
        >
          Personalize your job matches
        </Text>
      </View>

      <View
        style={
          styles.profileCard
        }
      >
        <View
          style={
            styles.avatar
          }
        >
          <Text
            style={
              styles.avatarText
            }
          >
            C
          </Text>
        </View>

        <View
          style={
            styles.profileInfo
          }
        >
          <Text
            style={
              styles.profileLabel
            }
          >
            Job Seeker
          </Text>

          <Text
            style={
              styles.profileRole
            }
          >
            {currentRoles[0] ??
              'Add a target role'}
          </Text>

          <Text
            style={
              styles.profileLocation
            }
          >
            {currentLocations[0] ??
              'Add a location'}
          </Text>
        </View>
      </View>

      <View
        style={
          styles.strengthCard
        }
      >
        <View
          style={
            styles.strengthHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Profile strength
          </Text>

          <Text
            style={
              styles.strengthValue
            }
          >
            {profileStrength}%
          </Text>
        </View>

        <View
          style={
            styles.progressTrack
          }
        >
          <View
            style={[
              styles.progressBar,
              {
                width:
                  `${profileStrength}%` as `${number}%`,
              },
            ]}
          />
        </View>

        <Text
          style={
            styles.helperText
          }
        >
          Complete your preferences to
          improve job matching.
        </Text>
      </View>

      <View
        style={
          styles.section
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          Job preferences
        </Text>

        <Text
          style={
            styles.fieldLabel
          }
        >
          Target roles
        </Text>

        <TextInput
          style={styles.input}
          value={targetRoles}
          onChangeText={
            setTargetRoles
          }
          placeholder="software engineer, frontend developer"
          placeholderTextColor="#6E768D"
          multiline
        />

        <Text
          style={
            styles.inputHint
          }
        >
          Separate roles with commas.
        </Text>

        <Text
          style={
            styles.fieldLabel
          }
        >
          Preferred locations
        </Text>

        <TextInput
          style={styles.input}
          value={
            preferredLocations
          }
          onChangeText={
            setPreferredLocations
          }
          placeholder="singapore"
          placeholderTextColor="#6E768D"
          multiline
        />

        <Text
          style={
            styles.inputHint
          }
        >
          Separate locations with commas.
        </Text>

        <Text
          style={
            styles.fieldLabel
          }
        >
          Experience levels
        </Text>

        <TextInput
          style={styles.input}
          value={
            preferredLevels
          }
          onChangeText={
            setPreferredLevels
          }
          placeholder="junior, graduate, entry level"
          placeholderTextColor="#6E768D"
          multiline
        />

        <Text
          style={
            styles.inputHint
          }
        >
          Examples: junior, graduate,
          entry-level, intern.
        </Text>

        <Text
          style={
            styles.fieldLabel
          }
        >
          Skills
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.skillsInput,
          ]}
          value={
            preferredSkills
          }
          onChangeText={
            setPreferredSkills
          }
          placeholder="react, typescript, python"
          placeholderTextColor="#6E768D"
          multiline
        />

        <Text
          style={
            styles.inputHint
          }
        >
          Add skills you want Job Copilot
          to prioritize.
        </Text>
      </View>

      {currentSkills.length >
        0 && (
        <View
          style={
            styles.section
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Current skills
          </Text>

          <View
            style={
              styles.skillContainer
            }
          >
            {currentSkills.map(
              (skill) => (
                <View
                  key={skill}
                  style={
                    styles.skillChip
                  }
                >
                  <Text
                    style={
                      styles.skillText
                    }
                  >
                    {skill}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed &&
            styles.buttonPressed,
          isSaving &&
            styles.disabledButton,
        ]}
        disabled={isSaving}
        onPress={handleSave}
      >
        <Text
          style={
            styles.saveButtonText
          }
        >
          {isSaving
            ? 'Saving...'
            : 'Save preferences'}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.resetButton,
          pressed &&
            styles.buttonPressed,
        ]}
        onPress={handleReset}
      >
        <Text
          style={
            styles.resetButtonText
          }
        >
          Reset to defaults
        </Text>
      </Pressable>

      <Text
        style={
          styles.versionText
        }
      >
        Job Copilot V1.1
      </Text>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#080D1A',
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 48,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#080D1A',
    },

    loadingText: {
      color: '#FFFFFF',
      fontSize: 16,
    },

    header: {
      marginBottom: 22,
    },

    title: {
      color: '#FFFFFF',
      fontSize: 30,
      fontWeight: '800',
    },

    subtitle: {
      color: '#9298AA',
      fontSize: 14,
      marginTop: 4,
    },

    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      borderRadius: 22,
      backgroundColor:
        '#12182A',
      borderWidth: 1,
      borderColor:
        '#202840',
      marginBottom: 16,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#7C5CFC',
      marginRight: 16,
    },

    avatarText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '800',
    },

    profileInfo: {
      flex: 1,
    },

    profileLabel: {
      color: '#969DB1',
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 3,
    },

    profileRole: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
      textTransform:
        'capitalize',
    },

    profileLocation: {
      color: '#A9AFC0',
      fontSize: 13,
      marginTop: 4,
      textTransform:
        'capitalize',
    },

    strengthCard: {
      padding: 18,
      borderRadius: 20,
      backgroundColor:
        '#12182A',
      borderWidth: 1,
      borderColor:
        '#202840',
      marginBottom: 16,
    },

    strengthHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    strengthValue: {
      color: '#9A7DFF',
      fontSize: 17,
      fontWeight: '800',
    },

    progressTrack: {
      height: 8,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor:
        '#242B3D',
      marginTop: 14,
    },

    progressBar: {
      height: '100%',
      borderRadius: 8,
      backgroundColor:
        '#7C5CFC',
    },

    helperText: {
      color: '#82899C',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
    },

    section: {
      padding: 18,
      borderRadius: 20,
      backgroundColor:
        '#12182A',
      borderWidth: 1,
      borderColor:
        '#202840',
      marginBottom: 16,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
    },

    fieldLabel: {
      color: '#D7DAE4',
      fontSize: 13,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 8,
    },

    input: {
      minHeight: 50,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        '#303850',
      backgroundColor:
        '#0B1120',
      color: '#FFFFFF',
      fontSize: 14,
      textAlignVertical:
        'top',
    },

    skillsInput: {
      minHeight: 90,
    },

    inputHint: {
      color: '#777F95',
      fontSize: 11,
      lineHeight: 16,
      marginTop: 6,
    },

    skillContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 14,
    },

    skillChip: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      backgroundColor:
        '#272047',
    },

    skillText: {
      color: '#C7B8FF',
      fontSize: 12,
      fontWeight: '600',
      textTransform:
        'capitalize',
    },

    saveButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 54,
      borderRadius: 16,
      backgroundColor:
        '#7C5CFC',
      marginTop: 4,
    },

    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    resetButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#343C55',
      marginTop: 12,
    },

    resetButtonText: {
      color: '#A8AEC0',
      fontSize: 14,
      fontWeight: '600',
    },

    buttonPressed: {
      opacity: 0.75,
    },

    disabledButton: {
      opacity: 0.6,
    },

    versionText: {
      color: '#555D73',
      textAlign: 'center',
      fontSize: 11,
      marginTop: 24,
    },
  });
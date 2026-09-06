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
  ResumeEducation,
  ResumeExperience,
  ResumeProfile,
  ResumeProject,
  defaultResumeProfile,
} from '../profile/resumeProfile';

import {
  loadResumeProfile,
  resetResumeProfile,
  saveResumeProfile,
} from '../storage/resumeProfileStorage';

type ResumeProfileScreenProps = {
  onBack: () => void;

  onResumeChange?: (
    profile: ResumeProfile
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
      item.trim()
    )
    .filter(Boolean);
}

function createId(
  prefix: string
) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export default function ResumeProfileScreen({
  onBack,
  onResumeChange,
}: ResumeProfileScreenProps) {
  const [
    profile,
    setProfile,
  ] = useState<ResumeProfile>(
    defaultResumeProfile
  );

  const [
    skillsText,
    setSkillsText,
  ] = useState('');

  const [
    hasLoaded,
    setHasLoaded,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  /*
   * LOAD
   */

  useEffect(() => {
    async function load() {
      try {
        const saved =
          await loadResumeProfile();

        setProfile(saved);

        setSkillsText(
          arrayToText(
            saved.skills
          )
        );
      } catch (error) {
        console.error(
          'Failed to load resume profile:',
          error
        );
      } finally {
        setHasLoaded(true);
      }
    }

    load();
  }, []);

  /*
   * GENERAL FIELDS
   */

  function updateField<
    K extends keyof ResumeProfile
  >(
    key: K,
    value: ResumeProfile[K]
  ) {
    setProfile(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  /*
   * EXPERIENCE
   */

  function addExperience() {
    const experience: ResumeExperience = {
    id: createId('experience'),

    company: '',

    role: '',

    location: '',

    startDate: '',

    endDate: '',

    description: '',
    };

    setProfile(
      (current) => ({
        ...current,

        experience: [
          ...current.experience,
          experience,
        ],
      })
    );
  }

  function updateExperience(
    id: string,
    updates: Partial<ResumeExperience>
  ) {
    setProfile(
      (current) => ({
        ...current,

        experience:
          current.experience.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    ...updates,
                  }
                : item
          ),
      })
    );
  }

  function removeExperience(
    id: string
  ) {
    setProfile(
      (current) => ({
        ...current,

        experience:
          current.experience.filter(
            (item) =>
              item.id !== id
          ),
      })
    );
  }

  /*
   * PROJECTS
   */

  function addProject() {
    const project: ResumeProject = {
    id: createId('project'),

    name: '',

    description: '',

    technologies: [],

    link: '',
    };

    setProfile(
      (current) => ({
        ...current,

        projects: [
          ...current.projects,
          project,
        ],
      })
    );
  }

  function updateProject(
    id: string,
    updates: Partial<ResumeProject>
  ) {
    setProfile(
      (current) => ({
        ...current,

        projects:
          current.projects.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    ...updates,
                  }
                : item
          ),
      })
    );
  }

  function removeProject(
    id: string
  ) {
    setProfile(
      (current) => ({
        ...current,

        projects:
          current.projects.filter(
            (item) =>
              item.id !== id
          ),
      })
    );
  }

  /*
   * EDUCATION
   */

  function addEducation() {
    const education: ResumeEducation = {
    id: createId('education'),

    school: '',

    qualification: '',

    location: '',

    startDate: '',

    endDate: '',
    };

    setProfile(
      (current) => ({
        ...current,

        education: [
          ...current.education,
          education,
        ],
      })
    );
  }

  function updateEducation(
    id: string,
    updates: Partial<ResumeEducation>
  ) {
    setProfile(
      (current) => ({
        ...current,

        education:
          current.education.map(
            (item) =>
              item.id === id
                ? {
                    ...item,
                    ...updates,
                  }
                : item
          ),
      })
    );
  }

  function removeEducation(
    id: string
  ) {
    setProfile(
      (current) => ({
        ...current,

        education:
          current.education.filter(
            (item) =>
              item.id !== id
          ),
      })
    );
  }

  /*
   * SAVE
   */

  async function handleSave() {
    const updatedProfile: ResumeProfile = {
      ...profile,

      skills:
        textToArray(
          skillsText
        ),
    };

    try {
      setIsSaving(true);

      await saveResumeProfile(
        updatedProfile
      );

      setProfile(
        updatedProfile
      );

      onResumeChange?.(
        updatedProfile
      );

      Alert.alert(
        'Resume saved',
        'Your resume profile has been saved.'
      );
    } catch (error) {
      console.error(
        'Failed to save resume profile:',
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
      'Reset resume profile?',
      'This will remove the resume information saved in Job Copilot.',
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
              await resetResumeProfile();

              setProfile(
                defaultResumeProfile
              );

              setSkillsText('');

              onResumeChange?.(
                defaultResumeProfile
              );
            } catch (error) {
              console.error(
                'Failed to reset resume profile:',
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

  if (!hasLoaded) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text
          style={
            styles.secondaryText
          }
        >
          Loading resume...
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
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={
            styles.backButton
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Resume Profile
          </Text>

          <Text
            style={
              styles.secondaryText
            }
          >
            Tell Job Copilot what
            you've actually done.
          </Text>
        </View>
      </View>

      {/* BASIC INFORMATION */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Basic information
        </Text>

        <Text style={styles.label}>
          Name
        </Text>

        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(
            value
          ) =>
            updateField(
              'name',
              value
            )
          }
          placeholder="Your name"
          placeholderTextColor="#6E768D"
        />

        <Text style={styles.label}>
          Professional headline
        </Text>

        <TextInput
          style={styles.input}
          value={
            profile.headline
          }
          onChangeText={(
            value
          ) =>
            updateField(
              'headline',
              value
            )
          }
          placeholder="Junior Software Engineer"
          placeholderTextColor="#6E768D"
        />

        <Text style={styles.label}>
          Summary
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.largeInput,
          ]}
          value={profile.summary}
          onChangeText={(
            value
          ) =>
            updateField(
              'summary',
              value
            )
          }
          placeholder="Short professional summary"
          placeholderTextColor="#6E768D"
          multiline
        />

        <Text style={styles.label}>
          Skills
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.largeInput,
          ]}
          value={skillsText}
          onChangeText={
            setSkillsText
          }
          placeholder="React, TypeScript, Python, PostgreSQL"
          placeholderTextColor="#6E768D"
          multiline
        />

        <Text
          style={
            styles.helperText
          }
        >
          Separate skills with commas.
        </Text>
      </View>

      {/* EXPERIENCE */}

      <View style={styles.card}>
        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Experience
          </Text>

          <Pressable
            onPress={
              addExperience
            }
          >
            <Text
              style={
                styles.addText
              }
            >
              + Add
            </Text>
          </Pressable>
        </View>

        {profile.experience.length ===
          0 && (
          <Text
            style={
              styles.emptyText
            }
          >
            No experience added yet.
          </Text>
        )}

        {profile.experience.map(
          (experience) => (
            <View
              key={
                experience.id
              }
              style={
                styles.entry
              }
            >
              <TextInput
                style={
                  styles.input
                }
                value={
                  experience.role
                }
                onChangeText={(
                  value
                ) =>
                  updateExperience(
                    experience.id,
                    {
                      role:
                        value,
                    }
                  )
                }
                placeholder="Role"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={
                  styles.input
                }
                value={
                  experience.company
                }
                onChangeText={(
                  value
                ) =>
                  updateExperience(
                    experience.id,
                    {
                      company:
                        value,
                    }
                  )
                }
                placeholder="Company"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.largeInput,
                ]}
                value={
                  experience.description
                }
                onChangeText={(
                  value
                ) =>
                  updateExperience(
                    experience.id,
                    {
                      description:
                        value,
                    }
                  )
                }
                placeholder="What did you do?"
                placeholderTextColor="#6E768D"
                multiline
              />

              <Pressable
                onPress={() =>
                  removeExperience(
                    experience.id
                  )
                }
              >
                <Text
                  style={
                    styles.removeText
                  }
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          )
        )}
      </View>

      {/* PROJECTS */}

      <View style={styles.card}>
        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Projects
          </Text>

          <Pressable
            onPress={
              addProject
            }
          >
            <Text
              style={
                styles.addText
              }
            >
              + Add
            </Text>
          </Pressable>
        </View>

        {profile.projects.length ===
          0 && (
          <Text
            style={
              styles.emptyText
            }
          >
            No projects added yet.
          </Text>
        )}

        {profile.projects.map(
          (project) => (
            <View
              key={project.id}
              style={
                styles.entry
              }
            >
              <TextInput
                style={
                  styles.input
                }
                value={
                  project.name
                }
                onChangeText={(
                  value
                ) =>
                  updateProject(
                    project.id,
                    {
                      name:
                        value,
                    }
                  )
                }
                placeholder="Project name"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.largeInput,
                ]}
                value={
                  project.description
                }
                onChangeText={(
                  value
                ) =>
                  updateProject(
                    project.id,
                    {
                      description:
                        value,
                    }
                  )
                }
                placeholder="What did you build?"
                placeholderTextColor="#6E768D"
                multiline
              />

              <TextInput
                style={
                  styles.input
                }
                value={arrayToText(
                  project.technologies
                )}
                onChangeText={(
                  value
                ) =>
                  updateProject(
                    project.id,
                    {
                      technologies:
                        textToArray(
                          value
                        ),
                    }
                  )
                }
                placeholder="React, FastAPI, PostgreSQL"
                placeholderTextColor="#6E768D"
              />

              <Pressable
                onPress={() =>
                  removeProject(
                    project.id
                  )
                }
              >
                <Text
                  style={
                    styles.removeText
                  }
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          )
        )}
      </View>

      {/* EDUCATION */}

      <View style={styles.card}>
        <View
          style={
            styles.sectionHeader
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Education
          </Text>

          <Pressable
            onPress={
              addEducation
            }
          >
            <Text
              style={
                styles.addText
              }
            >
              + Add
            </Text>
          </Pressable>
        </View>

        {profile.education.length ===
          0 && (
          <Text
            style={
              styles.emptyText
            }
          >
            No education added yet.
          </Text>
        )}

        {profile.education.map(
          (education) => (
            <View
              key={
                education.id
              }
              style={
                styles.entry
              }
            >
              <TextInput
                style={
                  styles.input
                }
                value={
                  education.school
                }
                onChangeText={(
                  value
                ) =>
                  updateEducation(
                    education.id,
                    {
                      school:
                        value,
                    }
                  )
                }
                placeholder="School"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={
                  styles.input
                }
                value={
                  education.qualification
                }
                onChangeText={(
                  value
                ) =>
                  updateEducation(
                    education.id,
                    {
                      qualification:
                        value,
                    }
                  )
                }
                placeholder="Degree or qualification"
                placeholderTextColor="#6E768D"
              />

              <Pressable
                onPress={() =>
                  removeEducation(
                    education.id
                  )
                }
              >
                <Text
                  style={
                    styles.removeText
                  }
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          )
        )}
      </View>

      {/* ACTIONS */}

      <Pressable
        style={
          styles.saveButton
        }
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text
          style={
            styles.saveButtonText
          }
        >
          {isSaving
            ? 'Saving...'
            : 'Save Resume Profile'}
        </Text>
      </Pressable>

      <Pressable
        style={
          styles.resetButton
        }
        onPress={handleReset}
      >
        <Text
          style={
            styles.resetText
          }
        >
          Reset Resume Profile
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#080D18',
    },

    content: {
      padding: 18,
      paddingBottom: 60,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent:
        'center',
      backgroundColor:
        '#080D18',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 22,
    },

    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent:
        'center',
      borderRadius: 12,
      backgroundColor:
        '#151B2B',
      marginRight: 12,
    },

    backText: {
      color: '#FFFFFF',
      fontSize: 30,
      lineHeight: 32,
    },

    headerText: {
      flex: 1,
    },

    title: {
      color: '#FFFFFF',
      fontSize: 25,
      fontWeight: '900',
    },

    secondaryText: {
      color: '#858DA1',
      fontSize: 12,
      lineHeight: 18,
      marginTop: 3,
    },

    card: {
      backgroundColor:
        '#111727',
      borderWidth: 1,
      borderColor:
        '#252D42',
      borderRadius: 18,
      padding: 17,
      marginBottom: 15,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },

    sectionTitle: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
      marginBottom: 8,
    },

    label: {
      color: '#BCC3D1',
      fontSize: 11,
      fontWeight: '800',
      marginTop: 12,
      marginBottom: 7,
    },

    input: {
      color: '#FFFFFF',
      backgroundColor:
        '#0B101D',
      borderWidth: 1,
      borderColor:
        '#293149',
      borderRadius: 11,
      paddingHorizontal: 12,
      paddingVertical: 11,
      fontSize: 12,
      marginTop: 8,
    },

    largeInput: {
      minHeight: 85,
      textAlignVertical:
        'top',
    },

    helperText: {
      color: '#646D82',
      fontSize: 10,
      lineHeight: 15,
      marginTop: 7,
    },

    addText: {
      color: '#9B7CFF',
      fontSize: 12,
      fontWeight: '900',
    },

    emptyText: {
      color: '#646D82',
      fontSize: 11,
      marginTop: 8,
    },

    entry: {
      marginTop: 13,
      paddingTop: 13,
      borderTopWidth: 1,
      borderTopColor:
        '#252D42',
    },

    removeText: {
      color: '#E47A88',
      fontSize: 10,
      fontWeight: '800',
      marginTop: 10,
      alignSelf:
        'flex-end',
    },

    saveButton: {
      backgroundColor:
        '#7657E8',
      borderRadius: 13,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 5,
    },

    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '900',
    },

    resetButton: {
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 4,
    },

    resetText: {
      color: '#E47A88',
      fontSize: 11,
      fontWeight: '800',
    },
  });
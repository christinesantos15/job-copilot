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
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeProfile,
  ResumeProject,
  ResumeSkillGroup,
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

function bulletsToText(
  values: string[]
) {
  return values.join('\n');
}

function textToBullets(
  value: string
) {
  return value
    .split('\n')
    .map((item) =>
      item
        .replace(
          /^[•\-*]\s*/,
          ''
        )
        .trim()
    )
    .filter(Boolean);
}

function createId(
  prefix: string
) {
  return (
    `${prefix}-` +
    `${Date.now()}-` +
    `${Math.random()
      .toString(36)
      .slice(2, 8)}`
  );
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
   * SKILL GROUPS
   */

  function addSkillGroup() {
    const skillGroup: ResumeSkillGroup = {
      id:
        createId(
          'skill-group'
        ),

      label: '',

      skills: [],
    };

    setProfile(
      (current) => ({
        ...current,

        skillGroups: [
          ...current.skillGroups,
          skillGroup,
        ],
      })
    );
  }

  function updateSkillGroup(
    id: string,
    updates:
      Partial<ResumeSkillGroup>
  ) {
    setProfile(
      (current) => ({
        ...current,

        skillGroups:
          current.skillGroups.map(
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

  function removeSkillGroup(
    id: string
  ) {
    setProfile(
      (current) => ({
        ...current,

        skillGroups:
          current.skillGroups.filter(
            (item) =>
              item.id !== id
          ),
      })
    );
  }

  /*
   * EXPERIENCE
   */

  function addExperience() {
    const experience: ResumeExperience = {
      id:
        createId(
          'experience'
        ),

      company: '',

      role: '',

      location: '',

      startDate: '',

      endDate: '',

      description: '',

      bullets: [],
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
    updates:
      Partial<ResumeExperience>
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
      id:
        createId(
          'project'
        ),

      name: '',

      description: '',

      technologies: [],

      bullets: [],

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
    updates:
      Partial<ResumeProject>
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
      id:
        createId(
          'education'
        ),

      school: '',

      qualification: '',

      location: '',

      startDate: '',

      endDate: '',

      details: [],
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
    updates:
      Partial<ResumeEducation>
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
   * CERTIFICATIONS
   */

  function addCertification() {
    const certification:
      ResumeCertification = {
        id:
          createId(
            'certification'
          ),

        name: '',

        issuer: '',

        date: '',
      };

    setProfile(
      (current) => ({
        ...current,

        certifications: [
          ...current.certifications,
          certification,
        ],
      })
    );
  }

  function updateCertification(
    id: string,
    updates:
      Partial<ResumeCertification>
  ) {
    setProfile(
      (current) => ({
        ...current,

        certifications:
          current.certifications.map(
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

  function removeCertification(
    id: string
  ) {
    setProfile(
      (current) => ({
        ...current,

        certifications:
          current.certifications.filter(
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
    const updatedProfile:
      ResumeProfile = {
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
      style={
        styles.container
      }
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

        <View
          style={
            styles.headerText
          }
        >
          <Text
            style={
              styles.title
            }
          >
            Resume Profile
          </Text>

          <Text
            style={
              styles.secondaryText
            }
          >
            Your factual master resume.
            Job Copilot uses this to
            prepare applications without
            inventing experience.
          </Text>
        </View>
      </View>

      {/* CONTACT */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Contact information
        </Text>

        <FieldLabel text="Name" />

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
          placeholder="Your professional name"
          placeholderTextColor="#6E768D"
        />

        <FieldLabel text="Email" />

        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(
            value
          ) =>
            updateField(
              'email',
              value
            )
          }
          placeholder="Email"
          placeholderTextColor="#6E768D"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <FieldLabel text="Phone" />

        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(
            value
          ) =>
            updateField(
              'phone',
              value
            )
          }
          placeholder="Phone"
          placeholderTextColor="#6E768D"
          keyboardType="phone-pad"
        />

        <FieldLabel text="Location" />

        <TextInput
          style={styles.input}
          value={profile.location}
          onChangeText={(
            value
          ) =>
            updateField(
              'location',
              value
            )
          }
          placeholder="Singapore"
          placeholderTextColor="#6E768D"
        />

        <FieldLabel text="LinkedIn" />

        <TextInput
          style={styles.input}
          value={
            profile.linkedinUrl
          }
          onChangeText={(
            value
          ) =>
            updateField(
              'linkedinUrl',
              value
            )
          }
          placeholder="LinkedIn URL"
          placeholderTextColor="#6E768D"
          autoCapitalize="none"
        />

        <FieldLabel text="GitHub" />

        <TextInput
          style={styles.input}
          value={
            profile.githubUrl
          }
          onChangeText={(
            value
          ) =>
            updateField(
              'githubUrl',
              value
            )
          }
          placeholder="GitHub URL"
          placeholderTextColor="#6E768D"
          autoCapitalize="none"
        />

        <FieldLabel
          text="Portfolio"
        />

        <TextInput
          style={styles.input}
          value={
            profile.portfolioUrl
          }
          onChangeText={(
            value
          ) =>
            updateField(
              'portfolioUrl',
              value
            )
          }
          placeholder="Portfolio URL (optional)"
          placeholderTextColor="#6E768D"
          autoCapitalize="none"
        />
      </View>

      {/* PROFILE */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Professional profile
        </Text>

        <FieldLabel
          text="Professional headline"
        />

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

        <FieldLabel text="Summary" />

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
          placeholder="Professional summary"
          placeholderTextColor="#6E768D"
          multiline
        />
      </View>

      {/* MASTER SKILLS */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }
        >
          Master skills
        </Text>

        <Text
          style={
            styles.helperText
          }
        >
          Keep all technologies you can
          genuinely explain or use. These
          remain available to matching
          and tailoring.
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

      {/* SKILL GROUPS */}

      <View style={styles.card}>
        <SectionHeader
          title="Technical skill groups"
          onAdd={addSkillGroup}
        />

        <Text
          style={
            styles.helperText
          }
        >
          These groups control how skills
          appear in the formatted resume.
        </Text>

        {profile.skillGroups.length ===
          0 && (
          <Text
            style={
              styles.emptyText
            }
          >
            No skill groups yet.
          </Text>
        )}

        {profile.skillGroups.map(
          (group) => (
            <View
              key={group.id}
              style={
                styles.entry
              }
            >
              <TextInput
                style={
                  styles.input
                }
                value={
                  group.label
                }
                onChangeText={(
                  value
                ) =>
                  updateSkillGroup(
                    group.id,
                    {
                      label:
                        value,
                    }
                  )
                }
                placeholder="Languages"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.mediumInput,
                ]}
                value={
                  arrayToText(
                    group.skills
                  )
                }
                onChangeText={(
                  value
                ) =>
                  updateSkillGroup(
                    group.id,
                    {
                      skills:
                        textToArray(
                          value
                        ),
                    }
                  )
                }
                placeholder="Python, Java, JavaScript, TypeScript"
                placeholderTextColor="#6E768D"
                multiline
              />

              <RemoveButton
                onPress={() =>
                  removeSkillGroup(
                    group.id
                  )
                }
              />
            </View>
          )
        )}
      </View>

      {/* EXPERIENCE */}

      <View style={styles.card}>
        <SectionHeader
          title="Experience"
          onAdd={addExperience}
        />

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
                style={
                  styles.input
                }
                value={
                  experience.location
                }
                onChangeText={(
                  value
                ) =>
                  updateExperience(
                    experience.id,
                    {
                      location:
                        value,
                    }
                  )
                }
                placeholder="Location"
                placeholderTextColor="#6E768D"
              />

              <View
                style={
                  styles.row
                }
              >
                <TextInput
                  style={[
                    styles.input,
                    styles.rowInput,
                  ]}
                  value={
                    experience.startDate
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateExperience(
                      experience.id,
                      {
                        startDate:
                          value,
                      }
                    )
                  }
                  placeholder="Start date"
                  placeholderTextColor="#6E768D"
                />

                <TextInput
                  style={[
                    styles.input,
                    styles.rowInput,
                  ]}
                  value={
                    experience.endDate
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateExperience(
                      experience.id,
                      {
                        endDate:
                          value,
                      }
                    )
                  }
                  placeholder="End date"
                  placeholderTextColor="#6E768D"
                />
              </View>

              <FieldLabel
                text="Achievement bullets"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.bulletInput,
                ]}
                value={
                  bulletsToText(
                    experience.bullets
                  )
                }
                onChangeText={(
                  value
                ) =>
                  updateExperience(
                    experience.id,
                    {
                      bullets:
                        textToBullets(
                          value
                        ),
                    }
                  )
                }
                placeholder={
                  'Built frontend features using Next.js and TypeScript.\nIntegrated authenticated REST API endpoints.\nRan QA testing across multiple release cycles.'
                }
                placeholderTextColor="#6E768D"
                multiline
              />

              <Text
                style={
                  styles.helperText
                }
              >
                One factual achievement
                per line. You do not need
                to type the bullet symbol.
              </Text>

              {!!experience
                .description && (
                <View
                  style={
                    styles.legacyBox
                  }
                >
                  <Text
                    style={
                      styles.legacyTitle
                    }
                  >
                    Previous description
                  </Text>

                  <Text
                    style={
                      styles.legacyText
                    }
                  >
                    {
                      experience
                        .description
                    }
                  </Text>

                  <Text
                    style={
                      styles.helperText
                    }
                  >
                    Kept for compatibility.
                    Move its factual points
                    into the bullet field
                    above when ready.
                  </Text>
                </View>
              )}

              <RemoveButton
                onPress={() =>
                  removeExperience(
                    experience.id
                  )
                }
              />
            </View>
          )
        )}
      </View>

      {/* PROJECTS */}

      <View style={styles.card}>
        <SectionHeader
          title="Projects"
          onAdd={addProject}
        />

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

              <FieldLabel
                text="Technologies"
              />

              <TextInput
                style={
                  styles.input
                }
                value={
                  arrayToText(
                    project.technologies
                  )
                }
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

              <FieldLabel
                text="Project bullets"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.bulletInput,
                ]}
                value={
                  bulletsToText(
                    project.bullets
                  )
                }
                onChangeText={(
                  value
                ) =>
                  updateProject(
                    project.id,
                    {
                      bullets:
                        textToBullets(
                          value
                        ),
                    }
                  )
                }
                placeholder={
                  'Built a mobile job-search application.\nAggregated live jobs from multiple sources.\nImplemented resume matching and application readiness.'
                }
                placeholderTextColor="#6E768D"
                multiline
              />

              <FieldLabel
                text="Repository / project link"
              />

              <TextInput
                style={
                  styles.input
                }
                value={
                  project.link
                }
                onChangeText={(
                  value
                ) =>
                  updateProject(
                    project.id,
                    {
                      link:
                        value,
                    }
                  )
                }
                placeholder="Project or repository URL"
                placeholderTextColor="#6E768D"
                autoCapitalize="none"
              />

              {!!project
                .description && (
                <View
                  style={
                    styles.legacyBox
                  }
                >
                  <Text
                    style={
                      styles.legacyTitle
                    }
                  >
                    Previous description
                  </Text>

                  <Text
                    style={
                      styles.legacyText
                    }
                  >
                    {
                      project
                        .description
                    }
                  </Text>

                  <Text
                    style={
                      styles.helperText
                    }
                  >
                    Kept for compatibility.
                    Move its factual points
                    into project bullets
                    when ready.
                  </Text>
                </View>
              )}

              <RemoveButton
                onPress={() =>
                  removeProject(
                    project.id
                  )
                }
              />
            </View>
          )
        )}
      </View>

      {/* EDUCATION */}

      <View style={styles.card}>
        <SectionHeader
          title="Education"
          onAdd={addEducation}
        />

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
                  education
                    .qualification
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

              <TextInput
                style={
                  styles.input
                }
                value={
                  education.location
                }
                onChangeText={(
                  value
                ) =>
                  updateEducation(
                    education.id,
                    {
                      location:
                        value,
                    }
                  )
                }
                placeholder="Location"
                placeholderTextColor="#6E768D"
              />

              <View
                style={
                  styles.row
                }
              >
                <TextInput
                  style={[
                    styles.input,
                    styles.rowInput,
                  ]}
                  value={
                    education.startDate
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateEducation(
                      education.id,
                      {
                        startDate:
                          value,
                      }
                    )
                  }
                  placeholder="Start date"
                  placeholderTextColor="#6E768D"
                />

                <TextInput
                  style={[
                    styles.input,
                    styles.rowInput,
                  ]}
                  value={
                    education.endDate
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateEducation(
                      education.id,
                      {
                        endDate:
                          value,
                      }
                    )
                  }
                  placeholder="End date"
                  placeholderTextColor="#6E768D"
                />
              </View>

              <FieldLabel
                text="Additional details"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.mediumInput,
                ]}
                value={
                  bulletsToText(
                    education.details
                  )
                }
                onChangeText={(
                  value
                ) =>
                  updateEducation(
                    education.id,
                    {
                      details:
                        textToBullets(
                          value
                        ),
                    }
                  )
                }
                placeholder={
                  'Thesis: Simulation-Based RNN Models for Traffic Congestion in Baguio City'
                }
                placeholderTextColor="#6E768D"
                multiline
              />

              <RemoveButton
                onPress={() =>
                  removeEducation(
                    education.id
                  )
                }
              />
            </View>
          )
        )}
      </View>

      {/* CERTIFICATIONS */}

      <View style={styles.card}>
        <SectionHeader
          title="Certifications"
          onAdd={
            addCertification
          }
        />

        {profile.certifications
          .length === 0 && (
          <Text
            style={
              styles.emptyText
            }
          >
            No certifications added yet.
          </Text>
        )}

        {profile.certifications.map(
          (certification) => (
            <View
              key={
                certification.id
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
                  certification.name
                }
                onChangeText={(
                  value
                ) =>
                  updateCertification(
                    certification.id,
                    {
                      name:
                        value,
                    }
                  )
                }
                placeholder="Certification"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={
                  styles.input
                }
                value={
                  certification.issuer
                }
                onChangeText={(
                  value
                ) =>
                  updateCertification(
                    certification.id,
                    {
                      issuer:
                        value,
                    }
                  )
                }
                placeholder="Issuer"
                placeholderTextColor="#6E768D"
              />

              <TextInput
                style={
                  styles.input
                }
                value={
                  certification.date
                }
                onChangeText={(
                  value
                ) =>
                  updateCertification(
                    certification.id,
                    {
                      date:
                        value,
                    }
                  )
                }
                placeholder="Date"
                placeholderTextColor="#6E768D"
              />

              <RemoveButton
                onPress={() =>
                  removeCertification(
                    certification.id
                  )
                }
              />
            </View>
          )
        )}
      </View>

      {/* ACTIONS */}

      <Pressable
        style={[
          styles.saveButton,

          isSaving &&
            styles.disabledButton,
        ]}
        onPress={
          handleSave
        }
        disabled={
          isSaving
        }
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
        onPress={
          handleReset
        }
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

function FieldLabel({
  text,
}: {
  text: string;
}) {
  return (
    <Text
      style={
        styles.label
      }
    >
      {text}
    </Text>
  );
}

function SectionHeader({
  title,
  onAdd,
}: {
  title: string;

  onAdd: () => void;
}) {
  return (
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
        {title}
      </Text>

      <Pressable
        onPress={
          onAdd
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
  );
}

function RemoveButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={
        onPress
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

      marginBottom: 1,
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

    row: {
      flexDirection: 'row',

      gap: 8,
    },

    rowInput: {
      flex: 1,
    },

    mediumInput: {
      minHeight: 68,

      textAlignVertical:
        'top',
    },

    largeInput: {
      minHeight: 85,

      textAlignVertical:
        'top',
    },

    bulletInput: {
      minHeight: 120,

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

    legacyBox: {
      backgroundColor:
        '#171D2C',

      borderWidth: 1,

      borderColor:
        '#30384D',

      borderRadius: 10,

      padding: 11,

      marginTop: 12,
    },

    legacyTitle: {
      color: '#AEB6C7',

      fontSize: 9,

      fontWeight: '900',

      marginBottom: 5,
    },

    legacyText: {
      color: '#7F879B',

      fontSize: 9,

      lineHeight: 15,
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

    disabledButton: {
      opacity: 0.55,
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
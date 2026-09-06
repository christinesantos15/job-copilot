import {
  useState,
} from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Clipboard
  from 'expo-clipboard';

import {
  Job,
} from '../types/Job';

import {
  ResumeProfile,
} from '../profile/resumeProfile';

import {
  generateTailoredResumeDraft,
} from '../matching/tailoredResumeDraft';

type TailoredResumeDraftCardProps = {
  job: Job;

  resume: ResumeProfile;
};

export default function TailoredResumeDraftCard({
  job,
  resume,
}: TailoredResumeDraftCardProps) {
  const [
    copied,
    setCopied,
  ] = useState(false);

  const draft =
    generateTailoredResumeDraft(
      job,
      resume
    );

  async function copyResumeDraft() {
    const sections: string[] =
      [];

    if (draft.name.trim()) {
      sections.push(
        draft.name.trim()
      );
    }

    if (draft.headline.trim()) {
      sections.push(
        draft.headline.trim()
      );
    }

    if (draft.summary.trim()) {
      sections.push(
        `SUMMARY\n${draft.summary.trim()}`
      );
    }

    if (
      draft.skills.length >
      0
    ) {
      sections.push(
        `SKILLS\n${draft.skills.join(
          ', '
        )}`
      );
    }

    if (
      draft.experience.length >
      0
    ) {
      const experienceText =
        draft.experience
          .map((item) => {
            const heading = [
              item.role,
              item.company,
            ]
              .filter(Boolean)
              .join(' — ');

            if (
              item.description.trim()
            ) {
              return (
                `${heading}\n` +
                `${item.description.trim()}`
              );
            }

            return heading;
          })
          .join('\n\n');

      sections.push(
        `EXPERIENCE\n${experienceText}`
      );
    }

    if (
      draft.projects.length >
      0
    ) {
      const projectText =
        draft.projects
          .map((project) => {
            const technologies =
              project.technologies
                .length > 0
                ? (
                    `\nTechnologies: ` +
                    project.technologies.join(
                      ', '
                    )
                  )
                : '';

            const description =
              project.description
                .trim();

            return [
              project.name,
              description,
            ]
              .filter(Boolean)
              .join('\n') +
              technologies;
          })
          .join('\n\n');

      sections.push(
        `PROJECTS\n${projectText}`
      );
    }

    if (
      draft.education.length >
      0
    ) {
      const educationText =
        draft.education
          .map((item) =>
            [
              item.qualification,
              item.school,
            ]
              .filter(Boolean)
              .join(' — ')
          )
          .join('\n');

      sections.push(
        `EDUCATION\n${educationText}`
      );
    }

    const resumeText =
      sections.join(
        '\n\n'
      );

    try {
      await Clipboard.setStringAsync(
        resumeText
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        'Failed to copy tailored resume:',
        error
      );
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>
        APPLICATION DRAFT
      </Text>

      <Text style={styles.title}>
        Tailored Resume Draft
      </Text>

      <Text
        style={
          styles.description
        }
      >
        A job-specific view of your
        saved Resume Profile. Original
        resume data is not changed.
      </Text>

      <View
        style={
          styles.resumePreview
        }
      >
        {!!draft.name && (
          <Text
            style={
              styles.name
            }
          >
            {draft.name}
          </Text>
        )}

        <Text
          style={
            styles.headline
          }
        >
          {draft.headline}
        </Text>

        {!!draft.summary && (
          <>
            <SectionTitle
              title="Summary"
            />

            <Text
              style={
                styles.bodyText
              }
            >
              {draft.summary}
            </Text>
          </>
        )}

        {draft.skills.length >
          0 && (
          <>
            <SectionTitle
              title="Skills"
            />

            <View
              style={
                styles.skills
              }
            >
              {draft.skills.map(
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
          </>
        )}

        {draft.projects.length >
          0 && (
          <>
            <SectionTitle
              title="Projects"
            />

            {draft.projects.map(
              (project) => (
                <View
                  key={project.id}
                  style={
                    styles.entry
                  }
                >
                  <View
                    style={
                      styles.entryHeader
                    }
                  >
                    <Text
                      style={
                        styles.entryTitle
                      }
                    >
                      {project.name}
                    </Text>

                    {project
                      .relevanceScore >
                      0 && (
                      <Text
                        style={
                          styles.relevant
                        }
                      >
                        RELEVANT
                      </Text>
                    )}
                  </View>

                  {!!project
                    .description && (
                    <Text
                      style={
                        styles.bodyText
                      }
                    >
                      {
                        project
                          .description
                      }
                    </Text>
                  )}

                  {project
                    .technologies
                    .length > 0 && (
                    <Text
                      style={
                        styles.technologyText
                      }
                    >
                      {project
                        .technologies
                        .join(' • ')}
                    </Text>
                  )}
                </View>
              )
            )}
          </>
        )}

        {draft.experience.length >
          0 && (
          <>
            <SectionTitle
              title="Experience"
            />

            {draft.experience.map(
              (experience) => (
                <View
                  key={
                    experience.id
                  }
                  style={
                    styles.entry
                  }
                >
                  <View
                    style={
                      styles.entryHeader
                    }
                  >
                    <Text
                      style={
                        styles.entryTitle
                      }
                    >
                      {
                        experience.role
                      }
                    </Text>

                    {experience
                      .relevanceScore >
                      0 && (
                      <Text
                        style={
                          styles.relevant
                        }
                      >
                        RELEVANT
                      </Text>
                    )}
                  </View>

                  <Text
                    style={
                      styles.company
                    }
                  >
                    {
                      experience
                        .company
                    }
                  </Text>

                  {!!experience
                    .description && (
                    <Text
                      style={
                        styles.bodyText
                      }
                    >
                      {
                        experience
                          .description
                      }
                    </Text>
                  )}
                </View>
              )
            )}
          </>
        )}

        {draft.education.length >
          0 && (
          <>
            <SectionTitle
              title="Education"
            />

            {draft.education.map(
              (education) => (
                <View
                  key={
                    education.id
                  }
                  style={
                    styles.entry
                  }
                >
                  <Text
                    style={
                      styles.entryTitle
                    }
                  >
                    {
                      education
                        .qualification
                    }
                  </Text>

                  <Text
                    style={
                      styles.company
                    }
                  >
                    {
                      education.school
                    }
                  </Text>
                </View>
              )
            )}
          </>
        )}
      </View>

      <View
        style={
          styles.warningBox
        }
      >
        <Text
          style={
            styles.warningTitle
          }
        >
          Review before using
        </Text>

        {draft.warnings.map(
          (
            warning,
            index
          ) => (
            <Text
              key={
                `warning-${index}`
              }
              style={
                styles.warningText
              }
            >
              • {warning}
            </Text>
          )
        )}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.copyButton,

          copied &&
            styles.copyButtonSuccess,

          pressed &&
            styles.buttonPressed,
        ]}
        onPress={
          copyResumeDraft
        }
      >
        <Text
          style={
            styles.copyButtonText
          }
        >
          {copied
            ? 'Copied ✓'
            : 'Copy Tailored Resume'}
        </Text>
      </Pressable>
    </View>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text
      style={
        styles.sectionTitle
      }
    >
      {title}
    </Text>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        '#111727',

      borderWidth: 1,

      borderColor:
        '#365172',

      borderRadius: 18,

      padding: 17,

      marginBottom: 15,
    },

    eyebrow: {
      color: '#72A9E8',

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.1,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: '900',

      marginTop: 5,
    },

    description: {
      color: '#7F879B',

      fontSize: 11,

      lineHeight: 17,

      marginTop: 6,
    },

    resumePreview: {
      backgroundColor:
        '#F5F5F2',

      borderRadius: 12,

      padding: 16,

      marginTop: 16,
    },

    name: {
      color: '#161A22',

      fontSize: 20,

      fontWeight: '900',
    },

    headline: {
      color: '#414856',

      fontSize: 10,

      lineHeight: 15,

      fontWeight: '700',

      marginTop: 4,
    },

    sectionTitle: {
      color: '#161A22',

      fontSize: 11,

      fontWeight: '900',

      textTransform:
        'uppercase',

      letterSpacing: 0.7,

      marginTop: 18,

      marginBottom: 7,

      borderBottomWidth: 1,

      borderBottomColor:
        '#D5D7DA',

      paddingBottom: 4,
    },

    bodyText: {
      color: '#414856',

      fontSize: 9,

      lineHeight: 15,
    },

    skills: {
      flexDirection: 'row',

      flexWrap: 'wrap',

      gap: 5,
    },

    skillChip: {
      backgroundColor:
        '#E2E5EA',

      borderRadius: 5,

      paddingHorizontal: 7,

      paddingVertical: 4,
    },

    skillText: {
      color: '#303744',

      fontSize: 8,

      fontWeight: '700',
    },

    entry: {
      marginTop: 9,
    },

    entryHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      gap: 8,
    },

    entryTitle: {
      flex: 1,

      color: '#222733',

      fontSize: 10,

      fontWeight: '900',
    },

    relevant: {
      color: '#34735D',

      fontSize: 7,

      fontWeight: '900',
    },

    company: {
      color: '#69717E',

      fontSize: 8,

      fontWeight: '700',

      marginTop: 2,

      marginBottom: 4,
    },

    technologyText: {
      color: '#566B87',

      fontSize: 8,

      fontWeight: '700',

      marginTop: 5,
    },

    warningBox: {
      backgroundColor:
        '#251F18',

      borderWidth: 1,

      borderColor:
        '#4B402C',

      borderRadius: 11,

      padding: 12,

      marginTop: 15,
    },

    warningTitle: {
      color: '#D6B75B',

      fontSize: 10,

      fontWeight: '900',

      marginBottom: 5,
    },

    warningText: {
      color: '#9D906D',

      fontSize: 9,

      lineHeight: 15,

      marginTop: 3,
    },

    copyButton: {
      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        '#7657E8',

      borderRadius: 11,

      paddingVertical: 13,

      marginTop: 14,
    },

    copyButtonSuccess: {
      backgroundColor:
        '#245A45',
    },

    copyButtonText: {
      color: '#FFFFFF',

      fontSize: 11,

      fontWeight: '900',
    },

    buttonPressed: {
      opacity: 0.72,
    },
  });
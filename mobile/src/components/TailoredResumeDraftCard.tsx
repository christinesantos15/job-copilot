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

import {
  exportResumePdf,
} from '../export/resumeExporter';

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

  const [
    exporting,
    setExporting,
  ] = useState(false);

  const draft =
    generateTailoredResumeDraft(
      job,
      resume
    );

  async function copyResumeDraft() {
    const sections: string[] = [];

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

    const contactLine = [
      resume.location,
      resume.phone,
      resume.email,
      resume.linkedinUrl,
      resume.githubUrl,
      resume.portfolioUrl,
    ]
      .map((value) =>
        value.trim()
      )
      .filter(Boolean)
      .join(' | ');

    if (contactLine) {
      sections.push(
        contactLine
      );
    }

    if (draft.summary.trim()) {
      sections.push(
        `PROFILE\n${draft.summary.trim()}`
      );
    }

    if (
      draft.skills.length > 0
    ) {
      sections.push(
        `TECHNICAL SKILLS\n${draft.skills.join(
          ', '
        )}`
      );
    }

    if (
      draft.experience.length > 0
    ) {
      const experienceText =
        draft.experience
          .map((item) => {
            const original =
              resume.experience.find(
                (experience) =>
                  experience.id ===
                  item.id
              );

            const heading = [
              item.role,
              item.company,
            ]
              .filter(Boolean)
              .join(' — ');

            const meta = [
              original?.startDate,
              original?.endDate,
            ]
              .filter(Boolean)
              .join(' – ');

            const metaLine = [
              meta,
              original?.location,
            ]
              .filter(Boolean)
              .join(' | ');

            return [
              heading,
              metaLine,
              item.description.trim(),
            ]
              .filter(Boolean)
              .join('\n');
          })
          .join('\n\n');

      sections.push(
        `PROFESSIONAL EXPERIENCE\n${experienceText}`
      );
    }

    if (
      draft.projects.length > 0
    ) {
      const projectText =
        draft.projects
          .map((project) => {
            const original =
              resume.projects.find(
                (item) =>
                  item.id ===
                  project.id
              );

            const technologies =
              project.technologies
                .length > 0
                ? (
                    `Technologies: ` +
                    project.technologies.join(
                      ', '
                    )
                  )
                : '';

            const link =
              original?.link.trim()
                ? `Repository: ${original.link.trim()}`
                : '';

            return [
              project.name,
              project.description.trim(),
              technologies,
              link,
            ]
              .filter(Boolean)
              .join('\n');
          })
          .join('\n\n');

      sections.push(
        `PROJECTS\n${projectText}`
      );
    }

    if (
      draft.education.length > 0
    ) {
      const educationText =
        draft.education
          .map((item) => {
            const dates = [
              item.startDate,
              item.endDate,
            ]
              .filter(Boolean)
              .join(' – ');

            const meta = [
              dates,
              item.location,
            ]
              .filter(Boolean)
              .join(' | ');

            return [
              [
                item.qualification,
                item.school,
              ]
                .filter(Boolean)
                .join(' — '),
              meta,
            ]
              .filter(Boolean)
              .join('\n');
          })
          .join('\n\n');

      sections.push(
        `EDUCATION\n${educationText}`
      );
    }

    const resumeText =
      sections.join('\n\n');

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

  async function handleExportResume() {
    if (exporting) {
      return;
    }

    try {
      setExporting(true);

      await exportResumePdf(
        job,
        resume
      );
    } catch (error) {
      console.error(
        'Failed to export resume:',
        error
      );
    } finally {
      setExporting(false);
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

        {[
          resume.location,
          resume.phone,
          resume.email,
        ]
          .map((value) =>
            value.trim()
          )
          .filter(Boolean)
          .length > 0 && (
          <Text
            style={
              styles.contactText
            }
          >
            {[
              resume.location,
              resume.phone,
              resume.email,
            ]
              .map((value) =>
                value.trim()
              )
              .filter(Boolean)
              .join(' • ')}
          </Text>
        )}

        {[
          resume.linkedinUrl,
          resume.githubUrl,
          resume.portfolioUrl,
        ]
          .map((value) =>
            value.trim()
          )
          .filter(Boolean)
          .length > 0 && (
          <Text
            style={
              styles.linkText
            }
          >
            {[
              resume.linkedinUrl,
              resume.githubUrl,
              resume.portfolioUrl,
            ]
              .map((value) =>
                value.trim()
              )
              .filter(Boolean)
              .join(' • ')}
          </Text>
        )}

        {!!draft.summary && (
          <>
            <SectionTitle
              title="Profile"
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
              title="Technical Skills"
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

        {draft.experience.length >
          0 && (
          <>
            <SectionTitle
              title="Professional Experience"
            />

            {draft.experience.map(
              (experience) => {
                const original =
                  resume.experience.find(
                    (item) =>
                      item.id ===
                      experience.id
                  );

                const dates = [
                  original?.startDate,
                  original?.endDate,
                ]
                  .filter(Boolean)
                  .join(' – ');

                const meta = [
                  dates,
                  original?.location,
                ]
                  .filter(Boolean)
                  .join(' | ');

                return (
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
                        experience.company
                      }
                    </Text>

                    {!!meta && (
                      <Text
                        style={
                          styles.metaText
                        }
                      >
                        {meta}
                      </Text>
                    )}

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
                );
              }
            )}
          </>
        )}

        {draft.projects.length >
          0 && (
          <>
            <SectionTitle
              title="Projects"
            />

            {draft.projects.map(
              (project) => {
                const original =
                  resume.projects.find(
                    (item) =>
                      item.id ===
                      project.id
                  );

                return (
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

                    {!!original?.link && (
                      <Text
                        style={
                          styles.projectLink
                        }
                      >
                        {original.link}
                      </Text>
                    )}
                  </View>
                );
              }
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
              (education) => {
                const dates = [
                  education.startDate,
                  education.endDate,
                ]
                  .filter(Boolean)
                  .join(' – ');

                const meta = [
                  dates,
                  education.location,
                ]
                  .filter(Boolean)
                  .join(' | ');

                return (
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

                    {!!meta && (
                      <Text
                        style={
                          styles.metaText
                        }
                      >
                        {meta}
                      </Text>
                    )}
                  </View>
                );
              }
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
            : 'Copy as Text'}
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.exportButton,

          exporting &&
            styles.exportButtonDisabled,

          pressed &&
            styles.buttonPressed,
        ]}
        onPress={
          handleExportResume
        }
        disabled={
          exporting
        }
      >
        <Text
          style={
            styles.exportButtonText
          }
        >
          {exporting
            ? 'Creating PDF...'
            : 'Export Resume PDF'}
        </Text>
      </Pressable>

      <Text
        style={
          styles.exportHint
        }
      >
        PDF keeps the resume formatting.
        Copy as Text is best for ATS
        application fields.
      </Text>
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

    contactText: {
      color: '#69717E',

      fontSize: 8,

      lineHeight: 13,

      marginTop: 5,
    },

    linkText: {
      color: '#566B87',

      fontSize: 7,

      lineHeight: 12,

      marginTop: 2,
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
    },

    metaText: {
      color: '#7A818C',

      fontSize: 7,

      lineHeight: 12,

      marginTop: 1,

      marginBottom: 4,
    },

    technologyText: {
      color: '#566B87',

      fontSize: 8,

      fontWeight: '700',

      marginTop: 5,
    },

    projectLink: {
      color: '#566B87',

      fontSize: 7,

      lineHeight: 12,

      marginTop: 4,
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

    exportButton: {
      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        '#1D2738',

      borderWidth: 1,

      borderColor:
        '#365172',

      borderRadius: 11,

      paddingVertical: 13,

      marginTop: 9,
    },

    exportButtonDisabled: {
      opacity: 0.55,
    },

    exportButtonText: {
      color: '#FFFFFF',

      fontSize: 11,

      fontWeight: '900',
    },

    exportHint: {
      color: '#697386',

      fontSize: 8,

      lineHeight: 13,

      textAlign: 'center',

      marginTop: 8,
    },

    buttonPressed: {
      opacity: 0.72,
    },
  });
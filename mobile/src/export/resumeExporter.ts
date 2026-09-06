import * as Print
  from 'expo-print';

import {
  ResumeProfile,
} from '../profile/resumeProfile';

import {
  Job,
} from '../types/Job';

import {
  generateTailoredResumeDraft,
  TailoredResumeDraft,
} from '../matching/tailoredResumeDraft';

function escapeHtml(
  value: string
) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateRange(
  startDate: string,
  endDate: string
) {
  const start =
    startDate.trim();

  const end =
    endDate.trim();

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start || end;
}

function contactItem(
  value: string
) {
  return value.trim()
    ? escapeHtml(
        value.trim()
      )
    : '';
}

function buildContactLine(
  resume: ResumeProfile
) {
  return [
    contactItem(
      resume.location
    ),

    contactItem(
      resume.phone
    ),

    contactItem(
      resume.email
    ),

    contactItem(
      resume.linkedinUrl
    ),

    contactItem(
      resume.githubUrl
    ),

    contactItem(
      resume.portfolioUrl
    ),
  ]
    .filter(Boolean)
    .join(
      ' &nbsp;|&nbsp; '
    );
}

function buildBulletList(
  bullets: string[]
) {
  const cleanBullets =
    bullets
      .map(
        (bullet) =>
          bullet.trim()
      )
      .filter(Boolean);

  if (
    cleanBullets.length === 0
  ) {
    return '';
  }

  return `
    <ul class="bullet-list">
      ${cleanBullets
        .map(
          (bullet) => `
            <li>
              ${escapeHtml(
                bullet
              )}
            </li>
          `
        )
        .join('')}
    </ul>
  `;
}

function buildSkillsHtml(
  draft: TailoredResumeDraft
) {
  /*
   * Prefer structured skill groups
   * when the user has created them.
   *
   * Fall back to the existing flat
   * skills array for older profiles.
   */

  const groups =
    draft.skillGroups.filter(
      (group) =>
        group.label.trim() ||
        group.skills.length > 0
    );

  if (
    groups.length > 0
  ) {
    return `
      <section>
        <h2>
          TECHNICAL SKILLS
        </h2>

        <div class="skill-groups">
          ${groups
            .map(
              (group) => {
                const skills =
                  group.skills
                    .map(
                      (skill) =>
                        escapeHtml(
                          skill
                        )
                    )
                    .join(', ');

                if (!skills) {
                  return '';
                }

                return `
                  <div class="skill-row">
                    ${
                      group.label.trim()
                        ? `
                            <strong>
                              ${escapeHtml(
                                group.label.trim()
                              )}:
                            </strong>
                          `
                        : ''
                    }

                    <span>
                      ${skills}
                    </span>
                  </div>
                `;
              }
            )
            .join('')}
        </div>
      </section>
    `;
  }

  if (
    draft.skills.length === 0
  ) {
    return '';
  }

  return `
    <section>
      <h2>
        TECHNICAL SKILLS
      </h2>

      <p class="skills">
        ${draft.skills
          .map(
            escapeHtml
          )
          .join(' • ')}
      </p>
    </section>
  `;
}

function buildExperienceHtml(
  draft: TailoredResumeDraft
) {
  if (
    draft.experience.length ===
    0
  ) {
    return '';
  }

  return `
    <section>
      <h2>
        PROFESSIONAL EXPERIENCE
      </h2>

      ${draft.experience
        .map((item) => {
          const dates =
            formatDateRange(
              item.startDate,
              item.endDate
            );

          const meta = [
            dates,
            item.location.trim(),
          ]
            .filter(Boolean)
            .map(
              (value) =>
                escapeHtml(value)
            )
            .join(' | ');

          /*
           * New structured bullets win.
           * Old descriptions remain a
           * fallback for migrated data.
           */

          const content =
            item.bullets.length >
            0
              ? buildBulletList(
                  item.bullets
                )
              : item.description.trim()
                ? `
                    <p class="entry-description">
                      ${escapeHtml(
                        item.description.trim()
                      )}
                    </p>
                  `
                : '';

          return `
            <div class="entry">
              <div class="entry-header">
                <div class="entry-heading">
                  <strong>
                    ${escapeHtml(
                      item.role
                    )}
                  </strong>

                  ${
                    item.company.trim()
                      ? ` — ${escapeHtml(
                          item.company
                        )}`
                      : ''
                  }
                </div>

                ${
                  meta
                    ? `
                        <div class="meta">
                          ${meta}
                        </div>
                      `
                    : ''
                }
              </div>

              ${content}
            </div>
          `;
        })
        .join('')}
    </section>
  `;
}

function buildProjectsHtml(
  draft: TailoredResumeDraft
) {
  if (
    draft.projects.length ===
    0
  ) {
    return '';
  }

  return `
    <section>
      <h2>
        PROJECTS
      </h2>

      ${draft.projects
        .map((project) => {
          const technologies =
            project.technologies
              .map(
                escapeHtml
              )
              .join(', ');

          const content =
            project.bullets.length >
            0
              ? buildBulletList(
                  project.bullets
                )
              : project.description.trim()
                ? `
                    <p class="entry-description">
                      ${escapeHtml(
                        project.description.trim()
                      )}
                    </p>
                  `
                : '';

          return `
            <div class="entry">
              <div class="project-title">
                <strong>
                  ${escapeHtml(
                    project.name
                  )}
                </strong>

                ${
                  technologies
                    ? `
                        <span class="technology">
                          | ${technologies}
                        </span>
                      `
                    : ''
                }
              </div>

              ${content}

              ${
                project.link.trim()
                  ? `
                      <div class="project-link">
                        ${escapeHtml(
                          project.link.trim()
                        )}
                      </div>
                    `
                  : ''
              }
            </div>
          `;
        })
        .join('')}
    </section>
  `;
}

function buildEducationHtml(
  draft: TailoredResumeDraft
) {
  if (
    draft.education.length ===
    0
  ) {
    return '';
  }

  return `
    <section>
      <h2>
        EDUCATION
      </h2>

      ${draft.education
        .map((item) => {
          const dates =
            formatDateRange(
              item.startDate,
              item.endDate
            );

          const meta = [
            dates,
            item.location.trim(),
          ]
            .filter(Boolean)
            .map(
              (value) =>
                escapeHtml(value)
            )
            .join(' | ');

          return `
            <div class="education-block">
              <div class="education-entry">
                <div class="education-heading">
                  <strong>
                    ${escapeHtml(
                      item.school
                    )}
                  </strong>

                  ${
                    item.qualification.trim()
                      ? ` — ${escapeHtml(
                          item.qualification
                        )}`
                      : ''
                  }
                </div>

                ${
                  meta
                    ? `
                        <div class="meta">
                          ${meta}
                        </div>
                      `
                    : ''
                }
              </div>

              ${buildBulletList(
                item.details
              )}
            </div>
          `;
        })
        .join('')}
    </section>
  `;
}

function buildCertificationsHtml(
  draft: TailoredResumeDraft
) {
  if (
    draft.certifications.length ===
    0
  ) {
    return '';
  }

  const certifications =
    draft.certifications.filter(
      (item) =>
        item.name.trim() ||
        item.issuer.trim() ||
        item.date.trim()
    );

  if (
    certifications.length === 0
  ) {
    return '';
  }

  return `
    <section>
      <h2>
        CERTIFICATIONS
      </h2>

      <div class="certifications">
        ${certifications
          .map(
            (item) => {
              const left = [
                item.issuer.trim(),
                item.name.trim(),
              ]
                .filter(Boolean)
                .map(
                  escapeHtml
                )
                .join(' — ');

              return `
                <div class="certification-entry">
                  <div>
                    ${left}
                  </div>

                  ${
                    item.date.trim()
                      ? `
                          <div class="meta">
                            ${escapeHtml(
                              item.date.trim()
                            )}
                          </div>
                        `
                      : ''
                  }
                </div>
              `;
            }
          )
          .join('')}
      </div>
    </section>
  `;
}

export function buildResumeHtml(
  job: Job,
  resume: ResumeProfile
) {
  const draft =
    generateTailoredResumeDraft(
      job,
      resume
    );

  const contactLine =
    buildContactLine(
      resume
    );

  return `
<!DOCTYPE html>

<html>
<head>
  <meta charset="utf-8" />

  <style>
    @page {
      size: A4;

      margin:
        10mm
        13mm;
    }

    * {
      box-sizing:
        border-box;
    }

    body {
      margin: 0;

      padding: 0;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      color:
        #111827;

      font-size:
        9pt;

      line-height:
        1.25;
    }

    header {
      text-align:
        center;

      margin-bottom:
        7px;
    }

    h1 {
      margin: 0;

      font-size:
        19pt;

      line-height:
        1.05;

      letter-spacing:
        0.5px;

      text-transform:
        uppercase;
    }

    .headline {
      margin-top:
        3px;

      font-size:
        10pt;

      font-weight:
        700;
    }

    .contact {
      margin-top:
        4px;

      font-size:
        7.6pt;

      line-height:
        1.3;

      color:
        #374151;

      overflow-wrap:
        anywhere;
    }

    section {
      margin-top:
        7px;
    }

    h2 {
      margin:
        0
        0
        4px
        0;

      padding-bottom:
        2px;

      border-bottom:
        1px solid
        #111827;

      font-size:
        9pt;

      line-height:
        1.1;

      letter-spacing:
        0.7px;
    }

    p {
      margin: 0;
    }

    .summary {
      line-height:
        1.32;
    }

    .skills {
      line-height:
        1.35;
    }

    .skill-groups {
      display:
        block;
    }

    .skill-row {
      margin-bottom:
        2px;

      line-height:
        1.3;
    }

    .skill-row strong {
      display:
        inline;

      margin-right:
        3px;
    }

    .entry {
      margin-bottom:
        5px;

      page-break-inside:
        avoid;
    }

    .entry-header {
      display:
        flex;

      justify-content:
        space-between;

      align-items:
        baseline;

      gap:
        10px;
    }

    .entry-heading {
      flex: 1;
    }

    .meta {
      font-size:
        7.5pt;

      color:
        #4B5563;

      white-space:
        nowrap;
    }

    .entry-description {
      margin-top:
        2px;

      line-height:
        1.3;
    }

    .bullet-list {
      margin:
        2px
        0
        0
        15px;

      padding: 0;

      line-height:
        1.28;
    }

    .bullet-list li {
      margin:
        0
        0
        1.5px
        0;

      padding-left:
        1px;
    }

    .project-title {
      display:
        flex;

      align-items:
        baseline;

      flex-wrap:
        wrap;

      gap:
        3px;
    }

    .technology {
      font-size:
        8pt;

      color:
        #4B5563;
    }

    .project-link {
      margin-top:
        2px;

      font-size:
        7.5pt;

      color:
        #374151;

      overflow-wrap:
        anywhere;
    }

    .education-block {
      margin-bottom:
        4px;

      page-break-inside:
        avoid;
    }

    .education-entry {
      display:
        flex;

      justify-content:
        space-between;

      align-items:
        baseline;

      gap:
        10px;
    }

    .education-heading {
      flex: 1;
    }

    .certification-entry {
      display:
        flex;

      justify-content:
        space-between;

      align-items:
        baseline;

      gap:
        10px;

      margin-bottom:
        2px;

      page-break-inside:
        avoid;
    }
  </style>
</head>

<body>
  <header>
    <h1>
      ${escapeHtml(
        draft.name ||
          resume.name
      )}
    </h1>

    ${
      draft.headline.trim()
        ? `
            <div class="headline">
              ${escapeHtml(
                draft.headline
              )}
            </div>
          `
        : ''
    }

    ${
      contactLine
        ? `
            <div class="contact">
              ${contactLine}
            </div>
          `
        : ''
    }
  </header>

  ${
    draft.summary.trim()
      ? `
          <section>
            <h2>
              PROFILE
            </h2>

            <p class="summary">
              ${escapeHtml(
                draft.summary
              )}
            </p>
          </section>
        `
      : ''
  }

  ${buildSkillsHtml(
    draft
  )}

  ${buildExperienceHtml(
    draft
  )}

  ${buildProjectsHtml(
    draft
  )}

  ${buildEducationHtml(
    draft
  )}

  ${buildCertificationsHtml(
    draft
  )}
</body>

</html>
  `;
}

export async function exportResumePdf(
  job: Job,
  resume: ResumeProfile
) {
  const html =
    buildResumeHtml(
      job,
      resume
    );

  await Print.printAsync({
    html,
  });
}
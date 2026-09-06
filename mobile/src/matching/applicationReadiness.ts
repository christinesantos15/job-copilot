import {
  ResumeProfile,
} from '../profile/resumeProfile';

import {
  Job,
} from '../types/Job';

import {
  analyzeResumeMatch,
} from './resumeMatchAnalysis';

export type ApplicationReadinessLevel =
  | 'ready'
  | 'worth-applying'
  | 'stretch'
  | 'lower-priority'
  | 'review';

export type ApplicationReadiness = {
  score: number;

  level:
    ApplicationReadinessLevel;

  label: string;

  summary: string;

  reasons: string[];

  nextAction: string;
};

function clampScore(
  value: number
) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

export function analyzeApplicationReadiness(
  job: Job,
  resume: ResumeProfile
): ApplicationReadiness {
  const resumeAnalysis =
    analyzeResumeMatch(
      job,
      resume
    );

  const resumeScore =
    resumeAnalysis.score;

  /*
   * job.matchScore is produced by
   * Job Copilot's preference matcher.
   *
   * If unavailable, use a neutral
   * value rather than pretending
   * the job is a good or bad match.
   */

  const jobScore =
    job.matchScore ?? 50;

  /*
   * READINESS SCORE V1
   *
   * 55% preference/job alignment
   * 45% resume evidence
   *
   * This is a prioritization score,
   * NOT a probability of being hired.
   */

  const score =
    clampScore(
      jobScore * 0.55 +
      resumeScore * 0.45
    );

  const reasons: string[] =
    [];

  /*
   * EXPLAIN PREFERENCE SIGNAL
   */

  if (jobScore >= 80) {
    reasons.push(
      'This job strongly matches your current Job Preferences.'
    );
  } else if (
    jobScore >= 60
  ) {
    reasons.push(
      'This job reasonably matches your current Job Preferences.'
    );
  } else {
    reasons.push(
      'This job has weaker alignment with your current Job Preferences.'
    );
  }

  /*
   * EXPLAIN RESUME SIGNAL
   */

  if (resumeScore >= 80) {
    reasons.push(
      'Your Resume Profile provides strong evidence for the detected requirements.'
    );
  } else if (
    resumeScore >= 60
  ) {
    reasons.push(
      'Your resume supports several important parts of the role.'
    );
  } else if (
    resumeScore >= 40
  ) {
    reasons.push(
      'Your resume has some relevant evidence but still has noticeable gaps.'
    );
  } else {
    reasons.push(
      'Your current Resume Profile provides limited direct evidence for this role.'
    );
  }

  /*
   * MISSING SKILLS
   */

  if (
    resumeAnalysis
      .missingSkills
      .length > 0
  ) {
    const topMissing =
      resumeAnalysis
        .missingSkills
        .slice(0, 3)
        .join(', ');

    reasons.push(
      `Detected resume gaps include: ${topMissing}.`
    );
  }

  /*
   * RELEVANT PROJECTS
   */

  if (
    resumeAnalysis
      .relevantProjects
      .length > 0
  ) {
    reasons.push(
      `${resumeAnalysis.relevantProjects.length} relevant project${
        resumeAnalysis.relevantProjects.length === 1
          ? ''
          : 's'
      } detected in your Resume Profile.`
    );
  }

  /*
   * DECISION MATRIX
   *
   * We deliberately use both
   * scores instead of relying only
   * on the combined score.
   */

  if (
    jobScore >= 75 &&
    resumeScore >= 70
  ) {
    return {
      score,

      level: 'ready',

      label:
        'Ready to apply',

      summary:
        'This role aligns well with what you want and your current resume provides solid evidence for the application.',

      reasons:
        reasons.slice(
          0,
          4
        ),

      nextAction:
        'Tailor your resume to the strongest matching requirements, review Application Copilot, then consider applying.',
    };
  }

  if (
    jobScore >= 70 &&
    resumeScore >= 50
  ) {
    return {
      score,

      level:
        'worth-applying',

      label:
        'Worth applying',

      summary:
        'The role fits your direction and your resume has enough relevant evidence to justify serious consideration.',

      reasons:
        reasons.slice(
          0,
          4
        ),

      nextAction:
        'Strengthen the weaker resume areas identified below before submitting the application.',
    };
  }

  if (
    jobScore >= 75 &&
    resumeScore < 50
  ) {
    return {
      score,

      level: 'stretch',

      label:
        'Stretch application',

      summary:
        'This is strongly aligned with what you want, but your current Resume Profile does not yet provide strong evidence for several requirements.',

      reasons:
        reasons.slice(
          0,
          4
        ),

      nextAction:
        'Decide whether your transferable experience can support the gaps. If so, apply honestly and prepare those areas carefully.',
    };
  }

  if (
    jobScore < 60 &&
    resumeScore >= 70
  ) {
    return {
      score,

      level:
        'lower-priority',

      label:
        'Lower priority',

      summary:
        'Your resume may support this role well, but the job itself is less aligned with your stated preferences.',

      reasons:
        reasons.slice(
          0,
          4
        ),

      nextAction:
        'Review the role carefully before spending time tailoring an application.',
    };
  }

  return {
    score,

    level: 'review',

    label:
      'Review first',

    summary:
      'This opportunity has mixed alignment. Review the job requirements and your resume evidence before deciding whether to apply.',

    reasons:
      reasons.slice(
        0,
        4
      ),

    nextAction:
      'Read the full listing and use Resume Match and Application Copilot to make the final decision.',
  };
}
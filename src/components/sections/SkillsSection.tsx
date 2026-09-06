import React from 'react';
import { Progress } from '@/components/ui/progress';
import Scene from '@/components/cinematic/Scene';
import CinematicText from '@/components/cinematic/CinematicText';
import SkillConstellation, {
  ConstellationCluster,
  ConstellationSkill,
} from '@/components/cinematic/SkillConstellation';

/* Single source of truth — the constellation and the progress bars are
   two views of the same data, so they can never drift apart. */
const technicalSkills = [
  { name: 'Java', level: 75 },
  { name: 'Excel', level: 70 },
  { name: 'MySQL', level: 65 },
  { name: 'UI/UX Design', level: 78 },
  { name: 'Data Analysis', level: 70 },
  { name: 'Power BI', level: 80 },
  { name: 'Git', level: 70 },
  { name: 'GitHub', level: 72 },
];

const creativeSkills = [
  { name: 'Figma', level: 80 },
  { name: 'Photoshop', level: 75 },
  { name: 'Graphic Design', level: 78 },
  { name: 'Poster Making', level: 80 },
];

const clusters: ConstellationCluster[] = [
  { id: 'technical', label: 'Technical', cx: 0.31, cy: 0.47 },
  { id: 'creative', label: 'Creative', cx: 0.76, cy: 0.52 },
];

const constellationSkills: ConstellationSkill[] = [
  ...technicalSkills.map((s) => ({ ...s, cluster: 'technical' })),
  ...creativeSkills.map((s) => ({ ...s, cluster: 'creative' })),
];

const SkillsSection = () => {
  const renderSkills = (skills: { name: string; level: number }[]) => (
    <div className="space-y-4 cine-focus-group">
      {skills.map((skill, index) => (
        <Scene key={skill.name} delay={index * 60} distance={20}>
          <div className="cine-focus-item cine-card rounded-md border border-tech-gray/60 bg-tech-black/40 px-4 py-3 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-gray-300">{skill.name}</span>
              <span className="text-[11px] font-orbitron tracking-wider text-tech-red/80">
                {skill.level}%
              </span>
            </div>
            <Progress
              value={skill.level}
              className="h-1.5 bg-tech-gray"
              aria-label={`${skill.name} proficiency`}
            />
          </div>
        </Scene>
      ))}
    </div>
  );

  return (
    <section id="skills" className="section relative overflow-hidden">
      <div className="section-inner relative">
        <Scene direction="none" className="text-center mb-4">
          <p className="cine-scene-label">Scene 03 — Skills</p>
        </Scene>

        <Scene className="text-center" keylight>
          <h2 className="text-3xl lg:text-4xl font-orbitron font-bold mb-4">
            <CinematicText className="heading-gradient">My Skills</CinematicText>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-4 text-sm">
            Two clusters, one toolkit. Hover a node to see how it connects — the closer a skill
            orbits its hub, the stronger it is.
          </p>
        </Scene>

        {/* The constellation is the centrepiece; the bars below carry the
            same numbers in a plainly readable form. */}
        <div className="mb-16 md:mb-20">
          <SkillConstellation clusters={clusters} skills={constellationSkills} />
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <Scene>
              <h3 className="text-lg font-orbitron mb-6 text-white inline-flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-tech-red flex items-center justify-center text-xs" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </span>
                Technical Skills
              </h3>
            </Scene>
            {renderSkills(technicalSkills)}
          </div>

          <div>
            <Scene>
              <h3 className="text-lg font-orbitron mb-6 text-white inline-flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-tech-red flex items-center justify-center text-xs" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" x2="12" y1="8" y2="8" />
                    <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                    <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
                  </svg>
                </span>
                Creative Tools
              </h3>
            </Scene>
            {renderSkills(creativeSkills)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

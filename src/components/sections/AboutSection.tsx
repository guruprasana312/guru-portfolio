
import React from 'react';
import Scene from '@/components/cinematic/Scene';
import CinematicText from '@/components/cinematic/CinematicText';
import ScrollLayer from '@/components/cinematic/ScrollLayer';
import Card3DTilt from '@/components/cinematic/Card3DTilt';
import FloatingGeometry3D from '@/components/cinematic/FloatingGeometry3D';

const AboutSection = () => {
  return (
    <section id="about" className="section relative overflow-hidden">
      <FloatingGeometry3D className="top-12 right-10" variant="ring" />
      <div className="absolute inset-0 bg-tech-dark/70 backdrop-blur-[2px]" aria-hidden="true"></div>
      <div className="section-inner relative">
        <Scene direction="none" className="mb-10 text-center lg:text-left">
          <p className="cine-scene-label">Scene 02 — About</p>
        </Scene>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <Scene direction="right" className="lg:w-1/2 relative">
            <ScrollLayer speed={-34} scale={0.02}>
              <Card3DTilt maxTilt={16} scale={1.04}>
                {/* About image or decorative element */}
                <div
                  className="aspect-square max-w-md mx-auto bg-tech-gray relative rounded-lg p-1 border border-tech-red/30 cine-card preserve-3d"
                  data-cursor-label="Explore"
                >
                  <div className="w-full h-full bg-tech-black flex items-center justify-center p-8 rounded-lg preserve-3d">
                    <div className="relative preserve-3d">
                      {/* Code bracket design element */}
                      <div className="text-7xl text-tech-red/20 font-mono absolute -top-10 -left-8 translate-z-10">{`{`}</div>
                      <p className="text-gray-300 text-lg relative z-10 leading-relaxed translate-z-30">
                        "I create digital experiences where <span className="text-tech-red font-semibold">technology meets design</span>,
                        with a focus on both functionality and aesthetics."
                      </p>
                      <div className="text-7xl text-tech-red/20 font-mono absolute -bottom-10 -right-8 translate-z-10">{`}`}</div>
                    </div>
                  </div>
                </div>
              </Card3DTilt>
            </ScrollLayer>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-tech-red/30 rounded-full hidden lg:block"></div>
            <div className="absolute -bottom-8 right-8 w-16 h-16 border border-tech-red/30 hidden lg:block"></div>
          </Scene>

          <div className="lg:w-1/2">
            <Scene delay={80} keylight>
              <h2 className="text-3xl lg:text-4xl font-orbitron font-bold mb-6 inline-block">
                <CinematicText className="heading-gradient">About Me</CinematicText>
              </h2>
            </Scene>

            <div className="space-y-4 text-gray-300">
              <Scene delay={160}>
                <p>
                  I'm a passionate B.Tech Computer Science and Business Systems student currently in my 3rd year,
                  with a unique blend of technical knowledge and creative design skills.
                </p>
              </Scene>

              <Scene delay={240}>
                <p>
                  My journey in tech began with coding, but I quickly discovered my passion for creating
                  beautiful, functional user interfaces. This led me to explore UI/UX design alongside my
                  technical studies, allowing me to bridge the gap between development and design.
                </p>
              </Scene>

              <Scene delay={320}>
                <p>
                  I believe in creating digital experiences that are not only visually appealing but also
                  intuitive and user-centered. My approach combines technical precision with creative
                  problem-solving to deliver solutions that make an impact.
                </p>
              </Scene>

              <Scene delay={400}>
                <Card3DTilt maxTilt={10} scale={1.02}>
                  <div className="mt-8 py-4 px-6 bg-tech-black/50 border border-tech-gray rounded-md cine-card preserve-3d">
                    <h3 className="text-tech-red font-orbitron text-lg mb-2 translate-z-20">My Design Philosophy</h3>
                    <p className="italic translate-z-10">
                      "Technology should enhance human experiences, not complicate them. Good design is as much about
                      what you leave out as what you put in."
                    </p>
                  </div>
                </Card3DTilt>
              </Scene>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

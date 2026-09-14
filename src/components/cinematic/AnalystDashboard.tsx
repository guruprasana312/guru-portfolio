import React, { useState } from 'react';
import Card3DTilt from '@/components/cinematic/Card3DTilt';
import { BarChart3, Database, FileSpreadsheet, Layers, PieChart, TrendingUp } from 'lucide-react';

interface MetricItem {
  id: string;
  title: string;
  category: string;
  value: number;
  icon: React.ReactNode;
  tags: string[];
  description: string;
}

const metrics: MetricItem[] = [
  {
    id: 'powerbi',
    title: 'Power BI & Dashboards',
    category: 'Data Analytics',
    value: 80,
    icon: <BarChart3 className="w-5 h-5 text-tech-red" />,
    tags: ['Data Modeling', 'DAX', 'Visual Reports', 'KPI Tracking'],
    description: 'Building interactive business intelligence dashboards and executive data visualizations.',
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis & Insights',
    category: 'Analytics',
    value: 70,
    icon: <TrendingUp className="w-5 h-5 text-tech-red" />,
    tags: ['Statistical Analysis', 'Pattern Recognition', 'Business Insights'],
    description: 'Transforming raw data into actionable business intelligence and strategic decision support.',
  },
  {
    id: 'sql',
    title: 'SQL & Database Systems',
    category: 'Data Engineering',
    value: 65,
    icon: <Database className="w-5 h-5 text-tech-red" />,
    tags: ['MySQL', 'Query Optimization', 'Schema Design', 'Data Relations'],
    description: 'Extracting, querying, and structuring database systems for business decision processes.',
  },
  {
    id: 'excel',
    title: 'Advanced Excel Analytics',
    category: 'Business Tools',
    value: 70,
    icon: <FileSpreadsheet className="w-5 h-5 text-tech-red" />,
    tags: ['Pivot Tables', 'VLOOKUP / XLOOKUP', 'Financial Modeling'],
    description: 'Structuring spreadsheets, data validation, and business performance tracking.',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX & Requirements Design',
    category: 'Business Systems',
    value: 78,
    icon: <Layers className="w-5 h-5 text-tech-red" />,
    tags: ['Wireframing', 'Figma Prototyping', 'User Journeys', 'System Flows'],
    description: 'Bridge technical development and business goals with intuitive user-centered interfaces.',
  },
];

/**
 * Interactive Business Analyst & Data Analyst Dashboard Widget.
 * Visually showcases analyst core competencies, interactive KPIs, and domain tools.
 */
export const AnalystDashboard: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<MetricItem>(metrics[0]);

  return (
    <Card3DTilt maxTilt={8} scale={1.01} className="w-full my-8">
      <div className="rounded-xl border border-tech-gray/70 bg-tech-black/60 p-6 md:p-8 backdrop-blur-md shadow-2xl preserve-3d">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-tech-gray/50 translate-z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-tech-red" />
              <span className="font-orbitron text-[11px] uppercase tracking-[0.35em] text-tech-red">
                Analyst Competency Matrix
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white">
              Business &amp; Data Analytics Expertise
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-tech-gray/40 border border-tech-gray/60 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-tech-red animate-pulse" />
            <span className="text-xs font-orbitron uppercase text-gray-300 tracking-wider">
              CSBS Systems Focus
            </span>
          </div>
        </div>

        {/* Matrix Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6 mt-6 preserve-3d">
          {/* Left Column: Interactive Metric Selector */}
          <div className="lg:col-span-5 space-y-2.5 translate-z-10">
            {metrics.map((item) => {
              const isSelected = activeMetric.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMetric(item)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'border-tech-red bg-tech-red/15 text-white shadow-lg shadow-tech-red/20'
                      : 'border-tech-gray/50 bg-tech-gray/20 text-gray-300 hover:border-tech-red/50 hover:bg-tech-gray/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md transition-colors ${isSelected ? 'bg-tech-red/20' : 'bg-tech-gray/50'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-orbitron font-medium tracking-wide">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">{item.category}</p>
                    </div>
                  </div>
                  <span className="font-orbitron text-xs font-bold text-tech-red">
                    {item.value}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Competency Breakdown Detail */}
          <div className="lg:col-span-7 bg-tech-gray/30 border border-tech-gray/60 rounded-xl p-6 flex flex-col justify-between translate-z-30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-orbitron uppercase tracking-widest text-tech-red font-semibold">
                  {activeMetric.category}
                </span>
                <span className="text-2xl font-orbitron font-extrabold text-white">
                  {activeMetric.value}% <span className="text-xs text-gray-400 font-normal">Proficiency</span>
                </span>
              </div>

              <h4 className="text-xl font-orbitron text-white mb-3">
                {activeMetric.title}
              </h4>

              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {activeMetric.description}
              </p>

              {/* Progress Visual Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                  <span>Skill Index</span>
                  <span>{activeMetric.value} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-tech-gray rounded-full overflow-hidden p-0.5 border border-tech-gray/80">
                  <div
                    className="h-full bg-gradient-to-r from-tech-red-dark via-tech-red to-white rounded-full transition-all duration-500 shadow-md shadow-tech-red/50"
                    style={{ width: `${activeMetric.value}%` }}
                  />
                </div>
              </div>

              {/* Key Core Methodologies & Tools */}
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-widest text-gray-400 mb-3">
                  Core Analytics Competencies
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeMetric.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-md text-xs font-mono bg-tech-black/60 text-tech-light border border-tech-red/40 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-tech-gray/40 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tech-red" />
                Business Systems &amp; Analytics Focus
              </span>
              <span className="text-tech-red font-orbitron text-[10px]">VERIFIED ROLE COMPETENCY</span>
            </div>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
};

export default AnalystDashboard;

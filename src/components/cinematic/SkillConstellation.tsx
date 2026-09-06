import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useMotionTier, usePointerParallax } from '@/hooks/use-cinematic';

export interface ConstellationSkill {
  name: string;
  level: number;
  cluster: string;
}

export interface ConstellationCluster {
  id: string;
  label: string;
  /** normalised centre of the cluster, 0..1 within the viewbox */
  cx: number;
  cy: number;
}

interface Props {
  clusters: ConstellationCluster[];
  skills: ConstellationSkill[];
}

/* Two layouts, not one layout squashed.
 * Wide: clusters sit side by side in a cinemascope frame.
 * Compact: clusters stack vertically in a tall frame, with everything
 * scaled up so the labels stay readable on a phone. */
const WIDE = { w: 1000, h: 490, ring: 78, spread: 100, xStretch: 1.25, fs: 1 };
const COMPACT = { w: 620, h: 1180, ring: 152, spread: 46, xStretch: 1, fs: 1.85 };

interface Node {
  id: string;
  name: string;
  level: number;
  cluster: string;
  x: number;
  y: number;
  r: number;
  /** phase offset so nodes breathe out of sync */
  phase: number;
}

/**
 * Skills as a constellation.
 *
 * Nodes are laid out deterministically: each cluster gets a hub, its
 * skills sit on a ring around it, radius driven by proficiency (stronger
 * skills sit closer to the hub and read larger). Edges connect each skill
 * to its hub, and hubs to each other.
 *
 * Hovering a node brightens it, lights its edges, nudges its neighbours
 * outward and surfaces the skill's detail. Everything else in the field
 * dims — the hovered node becomes the subject of the frame.
 *
 * Nodes are real focusable buttons in the DOM order of the underlying
 * data, so the whole thing is keyboard-navigable; the numeric proficiency
 * also stays available in the progress bars below this component.
 */
const SkillConstellation = ({ clusters, skills }: Props) => {
  const [containerRef, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const L = compact ? COMPACT : WIDE;
  const VW = L.w;
  const VH = L.h;
  const svgRef = useRef<SVGSVGElement>(null);
  const plateRef = useRef<SVGGElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tier = useMotionTier();

  // Gentle pointer drift on the whole plate — depth, not rotation.
  usePointerParallax((p) => {
    if (plateRef.current) {
      plateRef.current.style.transform = `translate(${p.x * 14}px, ${p.y * 10}px)`;
    }
  });

  const { hubs, nodes, edges } = useMemo(() => {
    // In the compact layout the authored cx/cy are ignored and the
    // clusters are stacked evenly down the frame.
    const hubList = clusters.map((c, i) => ({
      ...c,
      x: (compact ? 0.5 : c.cx) * VW,
      y: (compact ? (i + 0.5) / clusters.length : c.cy) * VH,
    }));

    const nodeList: Node[] = [];
    clusters.forEach((cluster, ci) => {
      const members = skills.filter((s) => s.cluster === cluster.id);
      const hub = hubList[ci];
      const count = members.length || 1;
      // Offset each cluster's ring so the two fields don't mirror each other.
      const startAngle = ci * 0.9 - Math.PI / 2;

      members.forEach((skill, i) => {
        const angle = startAngle + (i / count) * Math.PI * 2;
        // Higher proficiency orbits closer to the hub and renders larger.
        const proximity = (100 - skill.level) / 100; // 0 = expert
        const radius = L.ring + proximity * L.spread;
        nodeList.push({
          id: `${cluster.id}-${skill.name}`,
          name: skill.name,
          level: skill.level,
          cluster: cluster.id,
          x: hub.x + Math.cos(angle) * radius * L.xStretch,
          y: hub.y + Math.sin(angle) * radius,
          r: (4 + (skill.level / 100) * 6) * (compact ? 1.5 : 1),
          phase: (i * 1.7 + ci * 2.3) % (Math.PI * 2),
        });
      });
    });

    const edgeList: { id: string; x1: number; y1: number; x2: number; y2: number; a: string; b: string }[] = [];
    nodeList.forEach((n) => {
      const hub = hubList.find((h) => h.id === n.cluster)!;
      edgeList.push({
        id: `e-${n.id}`,
        x1: hub.x,
        y1: hub.y,
        x2: n.x,
        y2: n.y,
        a: `hub-${hub.id}`,
        b: n.id,
      });
    });
    // Spine between hubs
    for (let i = 0; i < hubList.length - 1; i += 1) {
      edgeList.push({
        id: `spine-${i}`,
        x1: hubList[i].x,
        y1: hubList[i].y,
        x2: hubList[i + 1].x,
        y2: hubList[i + 1].y,
        a: `hub-${hubList[i].id}`,
        b: `hub-${hubList[i + 1].id}`,
      });
    }

    return { hubs: hubList, nodes: nodeList, edges: edgeList };
  }, [clusters, skills, compact, VW, VH, L]);

  /* --- slow breathing drift, written straight to the DOM --- */
  useEffect(() => {
    if (tier === 'none' || !inView) return;
    const svg = svgRef.current;
    if (!svg) return;

    let frame = 0;
    let t = 0;
    const nodeEls = Array.from(svg.querySelectorAll<SVGGElement>('[data-drift]'));
    if (!nodeEls.length) return;

    const phases = nodeEls.map((el) => Number(el.dataset.phase || 0));

    const loop = () => {
      t += 0.008;
      for (let i = 0; i < nodeEls.length; i += 1) {
        const dx = Math.sin(t + phases[i]) * 3.5;
        const dy = Math.cos(t * 0.8 + phases[i]) * 3;
        nodeEls[i].style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [tier, inView, nodes.length]);

  const activeNode = nodes.find((n) => n.id === activeId) ?? null;
  const activeHub = activeId?.startsWith('hub-') ? activeId.slice(4) : null;

  const isEdgeLit = (e: { a: string; b: string }) => {
    if (!activeId) return false;
    return e.a === activeId || e.b === activeId;
  };

  const isNodeDim = (id: string, cluster: string) => {
    if (!activeId) return false;
    if (id === activeId) return false;
    if (activeHub) return cluster !== activeHub;
    return activeNode ? cluster !== activeNode.cluster : true;
  };

  return (
    <div
      ref={containerRef}
      className={`cine-constellation cine-reveal ${inView ? 'is-visible' : ''}`}
      onMouseLeave={() => setActiveId(null)}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto overflow-visible"
        role="group"
        aria-label="Skills constellation. Each node is a skill; select one to see its proficiency."
      >
        <defs>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g ref={plateRef} style={{ transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)' }}>
          {/* Edges first so nodes sit on top */}
          <g>
            {edges.map((e, i) => {
              const lit = isEdgeLit(e);
              return (
                <line
                  key={e.id}
                  className="cine-edge"
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke="hsl(var(--primary))"
                  strokeWidth={lit ? 1.4 : 0.6}
                  strokeOpacity={inView ? (lit ? 0.75 : activeId ? 0.08 : 0.16) : 0}
                  style={{ transitionDelay: `${Math.min(i * 18, 500)}ms` }}
                />
              );
            })}
          </g>

          {/* Cluster hubs */}
          {hubs.map((hub) => {
            const id = `hub-${hub.id}`;
            const dim = activeId ? activeId !== id && !activeId.startsWith(hub.id) : false;
            return (
              <g
                key={id}
                className="cine-node"
                style={{ opacity: dim ? 0.28 : 1 }}
                onMouseEnter={() => setActiveId(id)}
              >
                <circle cx={hub.x} cy={hub.y} r={38 * L.fs} fill="url(#nodeGlow)" opacity={activeId === id ? 1 : 0.6} />
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={9 * (compact ? 1.3 : 1)}
                  fill="hsl(var(--primary))"
                  filter="url(#softGlow)"
                />
                <text
                  x={hub.x}
                  y={hub.y - 30 * L.fs}
                  textAnchor="middle"
                  className="font-orbitron"
                  fontSize={13 * L.fs}
                  letterSpacing={4 * L.fs}
                  fill="#ffffff"
                  opacity="0.92"
                  stroke="#070707"
                  strokeWidth={6 * L.fs}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {hub.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Skill nodes */}
          {nodes.map((n, i) => {
            const active = activeId === n.id;
            const dim = isNodeDim(n.id, n.cluster);
            return (
              <g
                key={n.id}
                data-drift
                data-phase={n.phase}
                className="cine-node"
                style={{
                  opacity: inView ? (dim ? 0.22 : 1) : 0,
                  transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${Math.min(i * 45, 700)}ms, transform 200ms linear`,
                }}
              >
                <circle
                  className="cine-node-halo"
                  cx={n.x}
                  cy={n.y}
                  r={(active ? 30 : 16) * L.fs}
                  fill="url(#nodeGlow)"
                  opacity={active ? 0.95 : 0.4}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={active ? '#ffffff' : 'hsl(var(--primary))'}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                />
                <text
                  x={n.x}
                  y={n.y + n.r + 15 * L.fs}
                  textAnchor="middle"
                  className="font-montserrat"
                  fontSize={12 * L.fs}
                  fill={active ? '#ffffff' : '#c8c8c8'}
                  opacity={active ? 1 : 0.78}
                  stroke="#070707"
                  strokeWidth={5 * L.fs}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {n.name}
                </text>
                {active && (
                  <text
                    x={n.x}
                    y={n.y + n.r + 31 * L.fs}
                    textAnchor="middle"
                    className="font-orbitron"
                    fontSize={10 * L.fs}
                    letterSpacing={2 * L.fs}
                    fill="hsl(var(--primary))"
                  >
                    {n.level}%
                  </text>
                )}
                {/* Generous, invisible hit area */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={26 * L.fs}
                  fill="transparent"
                  onMouseEnter={() => setActiveId(n.id)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Keyboard-reachable equivalents. Visually compact, fully operable. */}
      <ul className="mt-6 flex flex-wrap gap-2 justify-center">
        {nodes.map((n) => (
          <li key={`k-${n.id}`}>
            <button
              type="button"
              onFocus={() => setActiveId(n.id)}
              onBlur={() => setActiveId(null)}
              onMouseEnter={() => setActiveId(n.id)}
              aria-label={`${n.name}, proficiency ${n.level} percent`}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-orbitron tracking-wider uppercase transition-colors duration-300 ${
                activeId === n.id
                  ? 'border-tech-red bg-tech-red/15 text-white'
                  : 'border-tech-gray/70 text-gray-400 hover:text-white hover:border-tech-red/60'
              }`}
            >
              {n.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillConstellation;

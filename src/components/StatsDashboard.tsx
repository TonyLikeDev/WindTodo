'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts';
import {
  TrendingUp, Users, CheckCircle, Clock, AlertCircle,
  BarChart2, PieChart as PieChartIcon, Trophy, Target, Layers,
} from 'lucide-react';
import { getOverallStats, getProjectStats } from '@/app/actions/statsActions';
import { getProjects } from '@/app/actions/projectActions';
import GlassCard from './GlassCard';

// ─── Colour palette ────────────────────────────────────────────────────────────
const STATUS_COLORS = { done: '#22c55e', inProgress: '#3b82f6', todo: '#52525b' };
const AVATAR_PALETTE = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface OverallStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}

interface ProjectData {
  id: string;
  name: string;
  color: string;
}

interface ProjectBreakdown {
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  unassignedCount: number;
  userStats: MemberStats[];
}

// ─── Custom tooltip ─────────────────────────────────────────────────────────────
interface TooltipPayload {
  name: string;
  value: number;
  fill: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
      <p className="text-white font-bold mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="font-medium">
          {p.name}: <span className="text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Circular progress ring ─────────────────────────────────────────────────────
function RingProgress({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={6} stroke="rgba(255,255,255,0.06)" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r} strokeWidth={6}
        stroke={color} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

// ─── Member card ────────────────────────────────────────────────────────────────
interface MemberStats {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionPct: number;
  contributionPct: number;
}

function MemberCard({ u, rank, totalProjectTasks }: { u: MemberStats; rank: number; totalProjectTasks: number }) {
  const avatarBg = AVATAR_PALETTE[(rank - 1) % AVATAR_PALETTE.length];
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col gap-4 hover:border-white/15 transition-all duration-300 hover:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {u.avatarUrl ? (
            <img src={u.avatarUrl} alt={u.name} className="w-11 h-11 rounded-full object-cover border-2 border-white/10" />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-white/10"
              style={{ background: avatarBg }}
            >
              {u.name.charAt(0).toUpperCase()}
            </div>
          )}
          {medal && <span className="absolute -top-1 -right-1 text-sm leading-none">{medal}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{u.name}</p>
          <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
        </div>

        {/* Completion ring */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <RingProgress pct={u.completionPct} color={STATUS_COLORS.done} size={52} />
          <span className="absolute text-[10px] font-bold text-white rotate-90">{u.completionPct}%</span>
        </div>
      </div>

      {/* Stats chips */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-zinc-800/50">
          <span className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-0.5">To Do</span>
          <span className="text-white text-base font-bold">{u.todo}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-500/10">
          <span className="text-blue-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Active</span>
          <span className="text-blue-300 text-base font-bold">{u.inProgress}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-green-500/10">
          <span className="text-green-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Done</span>
          <span className="text-green-300 text-base font-bold">{u.completed}</span>
        </div>
      </div>

      {/* Multi-segment progress bar */}
      {u.total > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
            <span>{u.total} tasks assigned</span>
            <span className="text-white font-semibold">{u.contributionPct}% of project</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/5 flex gap-0.5">
            {u.completed > 0 && (
              <div
                className="h-full rounded-l-full bg-green-500 transition-all duration-700"
                style={{ width: `${(u.completed / u.total) * 100}%` }}
              />
            )}
            {u.inProgress > 0 && (
              <div
                className="h-full bg-blue-500 transition-all duration-700"
                style={{ width: `${(u.inProgress / u.total) * 100}%` }}
              />
            )}
            {u.todo > 0 && (
              <div
                className="h-full rounded-r-full bg-zinc-600 transition-all duration-700"
                style={{ width: `${(u.todo / u.total) * 100}%` }}
              />
            )}
          </div>
          <div className="flex gap-3 mt-1.5 text-[9px]">
            <span className="text-green-400">● Done {Math.round((u.completed / u.total) * 100)}%</span>
            <span className="text-blue-400">● Active {Math.round((u.inProgress / u.total) * 100)}%</span>
            <span className="text-gray-500">● Todo {Math.round((u.todo / u.total) * 100)}%</span>
          </div>
        </div>
      )}
      {u.total === 0 && (
        <p className="text-[11px] text-gray-600 italic text-center">No tasks assigned yet</p>
      )}
    </div>
  );
}

// ─── Main dashboard ─────────────────────────────────────────────────────────────
export default function StatsDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [overall, setOverall] = useState<OverallStats | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectStats, setProjectStats] = useState<ProjectBreakdown | null>(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    async function init() {
      const [overallData, projectsData] = await Promise.all([
        getOverallStats(),
        getProjects()
      ]);
      setOverall(overallData);
      setProjects(projectsData);
      if (projectsData.length > 0) setSelectedProjectId(projectsData[0].id);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingProject(true);
    getProjectStats(selectedProjectId).then(data => {
      setProjectStats(data);
      setLoadingProject(false);
    });
  }, [selectedProjectId]);

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" />
      </div>
    );
  }

  const overallPct = (overall && overall.totalTasks > 0)
    ? Math.round((overall.completedTasks / overall.totalTasks) * 100)
    : 0;

  const pieData = overall ? [
    { name: 'Done',        value: overall.completedTasks,  fill: STATUS_COLORS.done },
    { name: 'In Progress', value: overall.inProgressTasks, fill: STATUS_COLORS.inProgress },
    { name: 'To Do',       value: overall.todoTasks,       fill: STATUS_COLORS.todo },
  ].filter(d => d.value > 0) : [];

  const projectPieData = projectStats ? [
    { name: 'Done',        value: projectStats.completedTasks,  fill: STATUS_COLORS.done },
    { name: 'In Progress', value: projectStats.inProgressTasks, fill: STATUS_COLORS.inProgress },
    { name: 'To Do',       value: projectStats.todoTasks,       fill: STATUS_COLORS.todo },
  ].filter(d => d.value > 0) : [];

  const barData = projectStats?.userStats?.filter((u: MemberStats) => u.total > 0) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ── Top KPI cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Projects" value={overall?.totalProjects ?? 0} icon={<Layers className="w-5 h-5" />} accent="white" />
        <StatCard title="To Do" value={overall?.todoTasks ?? 0} icon={<AlertCircle className="w-5 h-5" />} accent="gray" />
        <StatCard title="In Progress" value={overall?.inProgressTasks ?? 0} icon={<Clock className="w-5 h-5" />} accent="blue" />
        <StatCard title="Completed" value={overall?.completedTasks ?? 0} icon={<CheckCircle className="w-5 h-5" />} accent="green" sub={`${overallPct}% success rate`} />
      </div>

      {/* ── Project selector + overall chart row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Overall status donut */}
        <GlassCard className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall Tasks</h3>
            <PieChartIcon className="w-4 h-4 text-gray-600" />
          </div>
          {overall && overall.totalTasks > 0 ? (
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={38} outerRadius={52} dataKey="value" paddingAngle={3}>
                      {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-black text-white">{overallPct}%</span>
                  <span className="text-[9px] text-gray-500 uppercase">done</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                      <span className="text-[11px] text-gray-400">{d.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm italic">No tasks yet</div>
          )}
        </GlassCard>

        {/* Project selector + project donut */}
        <GlassCard className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Breakdown</h3>
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg text-xs py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
              >
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <Target className="w-4 h-4 text-gray-600" />
          </div>

          {loadingProject ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white/30" />
            </div>
          ) : projectStats ? (
            <div className="flex items-center gap-6 flex-1">
              {/* Donut */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={projectPieData} innerRadius={42} outerRadius={58} dataKey="value" paddingAngle={3}>
                      {projectPieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-black text-white">
                    {projectStats.totalTasks > 0 ? Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100) : 0}%
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase">done</span>
                </div>
              </div>

              {/* Legend + extra metrics */}
              <div className="flex-1 space-y-2.5">
                {[
                  { label: 'Done',        val: projectStats.completedTasks,  color: STATUS_COLORS.done },
                  { label: 'In Progress', val: projectStats.inProgressTasks, color: STATUS_COLORS.inProgress },
                  { label: 'To Do',       val: projectStats.todoTasks,       color: STATUS_COLORS.todo },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: row.color }} />
                    <div className="flex-1">
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${projectStats.totalTasks > 0 ? (row.val / projectStats.totalTasks) * 100 : 0}%`,
                            background: row.color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 w-16 text-right">
                      {row.val} <span className="text-gray-600">
                        ({projectStats.totalTasks > 0 ? Math.round((row.val / projectStats.totalTasks) * 100) : 0}%)
                      </span>
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5 flex justify-between text-[10px] text-gray-500">
                  <span>Total tasks: <span className="text-white font-bold">{projectStats.totalTasks}</span></span>
                  <span>Members: <span className="text-white font-bold">{projectStats.userStats.length}</span></span>
                  {projectStats.unassignedCount > 0 && (
                    <span className="text-yellow-500/80">⚠ {projectStats.unassignedCount} unassigned</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm italic">Select a project</div>
          )}
        </GlassCard>
      </div>

      {/* ── Stacked bar chart: per-user task breakdown ─────────────────── */}
      {barData.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Task Distribution by Member</h3>
            <BarChart2 className="w-4 h-4 text-gray-600" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend
                  iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#888', paddingTop: 12 }}
                />
                <Bar dataKey="completed" stackId="a" fill={STATUS_COLORS.done}       name="Done"        radius={[0,0,0,0]} />
                <Bar dataKey="inProgress" stackId="a" fill={STATUS_COLORS.inProgress} name="In Progress" radius={[0,0,0,0]} />
                <Bar dataKey="todo"       stackId="a" fill={STATUS_COLORS.todo}       name="To Do"       radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* ── Member contribution cards ─────────────────────────────────── */}
      {projectStats && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Team Contributions</h3>
              <p className="text-xs text-gray-500 mt-0.5">Individual performance in <span className="text-white font-semibold">{projectStats.projectName}</span></p>
            </div>
            <Trophy className="w-5 h-5 text-yellow-500/60" />
          </div>

          {projectStats.userStats.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No members in this project yet.</p>
              <p className="text-gray-600 text-xs mt-1">Add members from the project board to track their contributions.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projectStats.userStats.map((u: MemberStats, i: number) => (
                <MemberCard
                  key={u.id}
                  u={u}
                  rank={i + 1}
                  totalProjectTasks={projectStats.totalTasks}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────────
const ACCENT: Record<string, string> = {
  white: 'border-white/10',
  gray:  'border-zinc-700/30',
  blue:  'border-blue-500/20',
  green: 'border-green-500/20',
};
const ACCENT_BG: Record<string, string> = {
  white: 'bg-white/5',
  gray:  'bg-zinc-700/10',
  blue:  'bg-blue-500/10',
  green: 'bg-green-500/10',
};
const ACCENT_ICON: Record<string, string> = {
  white: 'text-gray-300',
  gray:  'text-gray-500',
  blue:  'text-blue-400',
  green: 'text-green-400',
};

function StatCard({
  title, value, icon, accent = 'white', sub,
}: {
  title: string; value: string | number; icon: React.ReactNode; accent?: string; sub?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 border ${ACCENT[accent]} ${ACCENT_BG[accent]} flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-300`}>
      <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${ACCENT_ICON[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

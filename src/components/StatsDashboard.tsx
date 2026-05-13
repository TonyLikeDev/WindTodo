'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
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

// ─── Custom tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-3 text-xs shadow-2xl">
      <p className="text-white font-bold mb-1.5">{label}</p>
      {payload.map((p: any) => (
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

function MemberCard({ u, rank }: { u: any; rank: number }) {
  const avatarBg = AVATAR_PALETTE[(rank - 1) % AVATAR_PALETTE.length];
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col gap-4 hover:border-white/15 transition-all duration-300 hover:bg-white/[0.03]">
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
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <RingProgress pct={u.completionPct} color={STATUS_COLORS.done} size={52} />
          <span className="absolute text-[10px] font-bold text-white rotate-90">{u.completionPct}%</span>
        </div>
      </div>
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
      {u.total > 0 && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
            <span>{u.total} tasks assigned</span>
            <span className="text-white font-semibold">{u.contributionPct}% of project</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/5 flex gap-0.5">
            {u.completed > 0 && <div className="h-full bg-green-500" style={{ width: `${(u.completed / u.total) * 100}%` }} />}
            {u.inProgress > 0 && <div className="h-full bg-blue-500" style={{ width: `${(u.inProgress / u.total) * 100}%` }} />}
            {u.todo > 0 && <div className="h-full bg-zinc-600" style={{ width: `${(u.todo / u.total) * 100}%` }} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatsDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [overall, setOverall] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectStats, setProjectStats] = useState<any>(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    async function init() {
      const [overallData, projectsData] = await Promise.all([getOverallStats(), getProjects()]);
      setOverall(overallData);
      setProjects(projectsData);
      if (projectsData.length > 0) setSelectedProjectId(projectsData[0].id);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
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

  const overallPct = overall?.totalTasks > 0 ? Math.round((overall.completedTasks / overall.totalTasks) * 100) : 0;
  const pieData = overall ? [
    { name: 'Done', value: overall.completedTasks, fill: STATUS_COLORS.done },
    { name: 'In Progress', value: overall.inProgressTasks, fill: STATUS_COLORS.inProgress },
    { name: 'To Do', value: overall.todoTasks, fill: STATUS_COLORS.todo },
  ].filter(d => d.value > 0) : [];

  const projectPieData = projectStats ? [
    { name: 'Done', value: projectStats.completedTasks, fill: STATUS_COLORS.done },
    { name: 'In Progress', value: projectStats.inProgressTasks, fill: STATUS_COLORS.inProgress },
    { name: 'To Do', value: projectStats.todoTasks, fill: STATUS_COLORS.todo },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Projects" value={overall?.totalProjects ?? 0} icon={<Layers className="w-5 h-5" />} />
        <StatCard title="To Do" value={overall?.todoTasks ?? 0} icon={<AlertCircle className="w-5 h-5" />} />
        <StatCard title="In Progress" value={overall?.inProgressTasks ?? 0} icon={<Clock className="w-5 h-5" />} />
        <StatCard title="Completed" value={overall?.completedTasks ?? 0} icon={<CheckCircle className="w-5 h-5" />} sub={`${overallPct}% rate`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall</h3>
            <PieChartIcon className="w-4 h-4 text-gray-600" />
          </div>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={40} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project</h3>
              <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg text-xs py-1 px-2 text-white">
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <Target className="w-4 h-4 text-gray-600" />
          </div>
          <div className="h-48 flex items-center justify-center">
            {loadingProject ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white/30" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStats?.userStats?.filter((u: any) => u.total > 0) ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" stackId="a" fill={STATUS_COLORS.done} />
                  <Bar dataKey="inProgress" stackId="a" fill={STATUS_COLORS.inProgress} />
                  <Bar dataKey="todo" stackId="a" fill={STATUS_COLORS.todo} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      {projectStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projectStats.userStats.map((u: any, i: number) => <MemberCard key={u.id} u={u} rank={i + 1} />)}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, sub }: { title: string; value: string | number; icon: React.ReactNode; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 bg-white/5 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white/5 text-gray-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

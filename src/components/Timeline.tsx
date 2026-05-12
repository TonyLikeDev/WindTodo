'use client';

import GlassCard from './GlassCard';

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  description?: string;
  isActive?: boolean;
};

export default function Timeline({ title, events }: { title: string; events: TimelineEvent[] }) {
  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
            </span>
            <span className="text-xs text-accent-400 font-medium">Live</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
        <div className="relative min-h-full before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          <div className="space-y-6 relative pb-4">
            {events.map((event) => (
            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon/Dot */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-black/80 bg-black/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${event.isActive ? 'ring-2 ring-accent-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10' : 'group-hover:border-white/20 transition-colors z-10'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${event.isActive ? 'bg-accent-400 shadow-[0_0_10px_rgba(6,182,212,1)]' : 'bg-white/30 group-hover:bg-white/60 transition-colors'}`}></div>
              </div>
              
              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group-hover:border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-base font-medium ${event.isActive ? 'text-white' : 'text-gray-300 group-hover:text-white transition-colors'}`}>{event.title}</h4>
                  <time className={`text-xs font-mono px-2 py-1 rounded bg-black/40 ${event.isActive ? 'text-accent-400 border border-accent-500/30' : 'text-gray-500'}`}>
                    {event.time}
                  </time>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

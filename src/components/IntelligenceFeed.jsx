import { useState, useMemo } from 'react';
import rawFeedData from '../data/intelligenceFeed.json';

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Opportunities', 'Tools', 'News', 'OpenClaw Improvements'];

const PRIORITY_CONFIG = {
  High: {
    badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
    border: 'border-l-4 border-l-red-500',
    dot: 'bg-red-500',
  },
  Medium: {
    badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    border: 'border-l-4 border-l-amber-500',
    dot: 'bg-amber-500',
  },
  Low: {
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    border: 'border-l-4 border-l-blue-500',
    dot: 'bg-blue-500',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimestamp(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}

function CategoryTag({ category }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700/60 text-slate-300 border border-slate-600/40">
      {category}
    </span>
  );
}

function InfoRow({ label, value, accent }) {
  return (
    <div className="space-y-0.5">
      <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? 'text-emerald-400' : 'text-slate-500'}`}>
        {label}
      </p>
      <p className="text-sm text-slate-300 leading-relaxed">{value}</p>
    </div>
  );
}

function ActionButton({ label, onClick, variant = 'default' }) {
  const variants = {
    execute:
      'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 shadow-sm shadow-emerald-900/40',
    save:
      'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600/50',
    dismiss:
      'bg-transparent hover:bg-red-900/30 text-slate-500 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30',
    default:
      'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600/50',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-150 cursor-pointer ${variants[variant] ?? variants.default}`}
    >
      {label}
    </button>
  );
}

function IntelCard({ item, onExecute, onSave, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const pCfg = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.Low;

  if (item.dismissed) return null;

  return (
    <div
      className={`
        relative bg-slate-800/70 backdrop-blur-sm rounded-lg overflow-hidden
        border border-slate-700/50 hover:border-slate-600/70
        transition-all duration-200 group
        ${pCfg.border}
        ${item.saved ? 'ring-1 ring-emerald-500/30' : ''}
      `}
    >
      {/* Saved indicator */}
      {item.saved && (
        <div className="absolute top-0 right-0 bg-emerald-600/20 border-l border-b border-emerald-500/30 px-2 py-0.5 rounded-bl text-xs text-emerald-400 font-medium">
          ✓ Strategy
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-white transition-colors">
              {item.headline}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <PriorityBadge priority={item.priority} />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryTag category={item.category} />
          <span className="text-xs text-slate-500">{formatTimestamp(item.timestamp)}</span>
        </div>

        {/* What Happened — always visible */}
        <p className="text-sm text-slate-400 leading-relaxed">{item.whatHappened}</p>

        {/* Expanded details */}
        {expanded && (
          <div className="space-y-3 pt-1 border-t border-slate-700/50">
            <InfoRow label="Why It Matters" value={item.whyItMatters} />
            <InfoRow label="Opportunity Angle" value={item.opportunityAngle} accent />
            <InfoRow label="Recommended Action" value={item.recommendedAction} accent />
          </div>
        )}

        {/* Toggle expand */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-slate-500 hover:text-emerald-400 transition-colors font-medium"
        >
          {expanded ? '↑ Less detail' : '↓ Why it matters · Action'}
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-700/40">
          <ActionButton
            label="⚡ Execute"
            variant="execute"
            onClick={() => onExecute(item)}
          />
          <ActionButton
            label={item.saved ? '✓ Saved' : '📌 Save to Strategy'}
            variant="save"
            onClick={() => onSave(item.id)}
          />
          <div className="flex-1" />
          <ActionButton
            label="Dismiss"
            variant="dismiss"
            onClick={() => onDismiss(item.id)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────

function FilterBar({ activeFilter, setActiveFilter, counts }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const count = counts[cat] ?? 0;
        const isActive = activeFilter === cat;
        return (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
              transition-all duration-150 cursor-pointer
              ${isActive
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700/80 hover:text-slate-200 border border-slate-700/50'}
            `}
          >
            {cat}
            {count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1
                  ${isActive ? 'bg-emerald-500/40 text-emerald-100' : 'bg-slate-700 text-slate-400'}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntelligenceFeed({ initialData = rawFeedData }) {
  const [feedItems, setFeedItems] = useState(
    [...initialData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  );
  const [activeFilter, setActiveFilter] = useState('All');

  // Category counts (active, non-dismissed items)
  const counts = useMemo(() => {
    const active = feedItems.filter((i) => !i.dismissed);
    const all = { All: active.length };
    CATEGORIES.slice(1).forEach((cat) => {
      all[cat] = active.filter((i) => i.category === cat).length;
    });
    return all;
  }, [feedItems]);

  // Filtered items
  const visibleItems = useMemo(() => {
    return feedItems.filter((item) => {
      if (item.dismissed) return false;
      if (activeFilter === 'All') return true;
      return item.category === activeFilter;
    });
  }, [feedItems, activeFilter]);

  // Handlers
  const handleExecute = (item) => {
    // Placeholder — wire to agent workflow dispatcher
    console.log('[IntelFeed] Execute triggered for:', item.id, item.headline);
    alert(`🚀 Executing workflow for:\n"${item.headline}"\n\n(Wire to agent dispatcher)`);
  };

  const handleSave = (id) => {
    setFeedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, saved: !item.saved } : item))
    );
  };

  const handleDismiss = (id) => {
    setFeedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dismissed: true } : item))
    );
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="text-emerald-400">⚡</span>
            Intelligence Feed
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Live signals · Act on what matters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {counts.All} active signal{counts.All !== 1 ? 's' : ''}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Filter tabs */}
      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {/* Feed */}
      <div className="space-y-3">
        {visibleItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm">No signals in this category</p>
          </div>
        ) : (
          visibleItems.map((item) => (
            <IntelCard
              key={item.id}
              item={item}
              onExecute={handleExecute}
              onSave={handleSave}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
}

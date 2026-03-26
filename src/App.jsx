import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Target, 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  DollarSign,
  Mail,
  Phone,
  FileText,
  UserCheck,
  Clock,
  Zap,
  ShoppingBag,
  Globe,
  Package
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './index.css';

// ============================================
// DATA STRUCTURE - Updated for Strategic Pivot
// ============================================
const initialData = {
  goals: [
    { id: 1, name: 'Phase 1: Services', target: 10000, current: 0, phase: 'Phase 1', status: 'in-progress', eta: '14 days' },
    { id: 2, name: 'Phase 2: Products', target: 50000, current: 0, phase: 'Phase 2', status: 'not-started', eta: '45 days' },
    { id: 3, name: 'Phase 3: Scale', target: 100000, current: 0, phase: 'Phase 3', status: 'not-started', eta: '90 days' },
  ],
  agents: [
    { id: 1, name: 'Strategist', task: 'Strategic pivot completed', status: 'complete', started: '14:52', runtime: '5m', lastUpdate: '14:57' },
    { id: 2, name: 'Marketer', task: 'Fiverr gig descriptions', status: 'complete', started: '18:23', runtime: '4m', lastUpdate: '18:27' },
    { id: 3, name: 'Developer', task: 'Portfolio page deployment', status: 'complete', started: '18:23', runtime: '4m', lastUpdate: '18:27' },
    { id: 4, name: 'Product', task: 'Template pack creation', status: 'complete', started: '18:27', runtime: '1m', lastUpdate: '18:28' },
    { id: 5, name: 'Sales', task: 'Account creation (Fiverr/Upwork)', status: 'waiting', started: '-', runtime: '-', lastUpdate: '-' },
  ],
  services: [
    { id: 1, name: 'Klaviyo Email Automation', price: '£300-500', delivery: '3-5 days', status: 'ready', platform: 'Fiverr/Upwork' },
    { id: 2, name: 'Order & Inventory Automation', price: '£400-700', delivery: '5-7 days', status: 'ready', platform: 'Fiverr/Upwork' },
    { id: 3, name: 'Full Automation Package', price: '£800-1,500', delivery: '7-10 days', status: 'ready', platform: 'Fiverr/Upwork' },
    { id: 4, name: 'AI Customer Service Bot', price: '£500-1,000', delivery: '5-7 days', status: 'ready', platform: 'Fiverr/Upwork' },
  ],
  products: [
    { id: 1, name: 'Make.com Template Pack', price: '£47-97', status: 'ready', platform: 'Gumroad' },
    { id: 2, name: 'Shopify Automation App', price: '£19-49/mo', status: 'planned', platform: 'Shopify App Store' },
    { id: 3, name: 'Automation Course', price: '£97-297', status: 'planned', platform: 'Gumroad' },
  ],
  platforms: [
    { id: 1, name: 'shanebell.dev', status: 'live', url: 'http://64.227.32.144:8080/', notes: 'Portfolio deployed' },
    { id: 2, name: 'Fiverr', status: 'blocked', url: '-', notes: 'W-9 form technical issue - contact support' },
    { id: 3, name: 'Upwork', status: 'pending', url: '-', notes: 'Alternative to Fiverr' },
    { id: 4, name: 'Gumroad', status: 'pending', url: '-', notes: 'Account creation needed' },
  ],
  metrics: {
    prospects: 50,
    outreachSent: 0,
    responses: 0,
    callsBooked: 0,
    proposalsSent: 0,
    clientsSigned: 0,
    revenue: 0,
    activeGigs: 0,
    inquiries: 0,
  },
  blockers: [
    { id: 1, item: 'Fiverr W-9 form submission', status: 'blocked', owner: 'Prime', notes: 'Infinite spinner - contact Fiverr support' },
    { id: 2, item: 'Upwork freelancer profile', status: 'waiting', owner: 'Prime', notes: 'Alternative path - no tax form required' },
    { id: 3, item: 'Gumroad account', status: 'waiting', owner: 'Prime', notes: 'Sign up at gumroad.com' },
  ],
  operationsLog: [
    { id: 1, time: '14:52', action: 'Strategic review', result: 'Old plan abandoned, pivot approved' },
    { id: 2, time: '14:56', action: 'New plan confirmed', result: 'Hybrid product + service model' },
    { id: 3, time: '15:20', action: 'Strategic pivot doc created', result: 'Full revenue plan documented' },
    { id: 4, time: '18:23', action: 'Sonnet subagent confirmed working', result: 'All 3 models operational' },
    { id: 5, time: '18:27', action: 'Portfolio page deployed', result: 'Live at :8080' },
    { id: 6, time: '18:27', action: 'Fiverr gigs completed', result: '4 full gig listings ready' },
    { id: 7, time: '18:28', action: 'Template pack completed', result: '10 workflows + sales materials' },
    { id: 8, time: '20:02', action: 'Mission Control updated', result: 'All assets documented' },
    { id: 9, time: '20:30', action: 'Dashboard restarted', result: 'Mission Control live at :5174' },
    { id: 10, time: '20:33', action: 'Dashboard data updated', result: 'New goals and status reflected' },
    { id: 11, time: '23:25', action: 'Fiverr seller activation attempted', result: 'W-9 form blocked by technical issue' },
    { id: 12, time: '23:53', action: 'Cookie-based automation attempted', result: 'Fiverr detected and blocked access' },
    { id: 13, time: '00:12', action: 'Session ended', result: 'Progress saved to memory' },
  ],
};

// ============================================
// HELPER COMPONENTS
// ============================================

const StatusBadge = ({ status }) => {
  const styles = {
    'complete': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'not-started': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
    'waiting': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'decision': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'ready': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'live': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'blocked': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    'planned': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  };
  
  const labels = {
    'complete': 'Complete',
    'in-progress': 'In Progress',
    'pending': 'Pending',
    'not-started': 'Not Started',
    'waiting': 'Waiting',
    'decision': 'Decision',
    'ready': 'Ready',
    'live': 'Live',
    'blocked': 'Blocked',
    'planned': 'Planned',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles['not-started']}`}>
      {labels[status] || status}
    </span>
  );
};

const ProgressBar = ({ current, target, color = 'emerald' }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const colorClasses = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>£{current.toLocaleString()}</span>
        <span>£{target.toLocaleString()}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className={`${colorClasses[color]} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-slate-500 mt-1">{percentage.toFixed(0)}%</div>
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ icon: Icon, label, value, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };
  
  return (
    <Card className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
    </Card>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

function App() {
  const [data, setData] = useState(initialData);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const chartData = [
    { name: 'Prospects', value: data.metrics.prospects, color: '#10b981' },
    { name: 'Gigs', value: data.metrics.activeGigs, color: '#f59e0b' },
    { name: 'Inquiries', value: data.metrics.inquiries, color: '#3b82f6' },
    { name: 'Clients', value: data.metrics.clientsSigned, color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Zap className="text-emerald-400" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-xs text-slate-400">Real-time operations dashboard • Strategic Pivot Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-500">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </span>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Strategic Pivot Banner */}
        <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-400">Strategic Pivot — March 25, 2026</h3>
              <p className="text-xs text-slate-400 mt-1">
                OLD: Cold email agency targeting enterprises → NEW: Productized services on Fiverr/Upwork + Digital products
              </p>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <section className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="text-emerald-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Revenue Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.goals.map((goal, index) => (
              <Card key={goal.id}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">{goal.phase}</span>
                  <StatusBadge status={goal.status} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{goal.name}</h3>
                <p className="text-xs text-slate-500 mb-4">ETA: {goal.eta}</p>
                <ProgressBar 
                  current={goal.current} 
                  target={goal.target} 
                  color={index === 0 ? 'emerald' : index === 1 ? 'amber' : 'purple'}
                />
              </Card>
            ))}
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-emerald-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Key Metrics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <MetricCard icon={Users} label="Prospects" value={data.metrics.prospects} color="emerald" />
            <MetricCard icon={ShoppingBag} label="Active Gigs" value={data.metrics.activeGigs} color="amber" />
            <MetricCard icon={Mail} label="Inquiries" value={data.metrics.inquiries} color="blue" />
            <MetricCard icon={Phone} label="Calls" value={data.metrics.callsBooked} color="purple" />
            <MetricCard icon={FileText} label="Proposals" value={data.metrics.proposalsSent} color="rose" />
            <MetricCard icon={UserCheck} label="Clients" value={data.metrics.clientsSigned} color="emerald" />
            <MetricCard icon={DollarSign} label="Revenue" value={`£${data.metrics.revenue}`} color="emerald" />
            <MetricCard icon={Package} label="Products" value={data.products.filter(p => p.status === 'ready').length} color="blue" />
          </div>
        </section>

        {/* Services & Products Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Services */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="text-emerald-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Productized Services</h2>
            </div>
            <Card className="h-80 overflow-auto">
              <table className="w-full">
                <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Delivery</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.services.map((service) => (
                    <tr key={service.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-3 font-medium text-white">{service.name}</td>
                      <td className="py-3 text-emerald-400">{service.price}</td>
                      <td className="py-3 text-slate-400">{service.delivery}</td>
                      <td className="py-3"><StatusBadge status={service.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          {/* Products */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="text-blue-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Digital Products</h2>
            </div>
            <Card className="h-80 overflow-auto">
              <table className="w-full">
                <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Platform</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-3 font-medium text-white">{product.name}</td>
                      <td className="py-3 text-emerald-400">{product.price}</td>
                      <td className="py-3 text-slate-400">{product.platform}</td>
                      <td className="py-3"><StatusBadge status={product.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>
        </div>

        {/* Platforms & Agents Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Platforms */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="text-emerald-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Platform Status</h2>
            </div>
            <Card className="h-80 overflow-auto">
              <table className="w-full">
                <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Platform</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.platforms.map((platform) => (
                    <tr key={platform.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-3 font-medium text-white">{platform.name}</td>
                      <td className="py-3"><StatusBadge status={platform.status} /></td>
                      <td className="py-3 text-slate-400 text-xs">{platform.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          {/* Active Agents */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="text-emerald-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Active Agents</h2>
            </div>
            <Card className="h-80 overflow-auto">
              <table className="w-full">
                <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Agent</th>
                    <th className="text-left py-2">Task</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-3 font-medium text-white">{agent.name}</td>
                      <td className="py-3 text-slate-400">{agent.task}</td>
                      <td className="py-3"><StatusBadge status={agent.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>
        </div>

        {/* Blockers & Operations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blockers */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-amber-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Blockers & Decisions</h2>
            </div>
            <Card>
              <table className="w-full">
                <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Item</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Owner</th>
                    <th className="text-left py-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.blockers.map((blocker) => (
                    <tr key={blocker.id} className="border-b border-slate-700/50 last:border-0">
                      <td className="py-3 font-medium text-white">{blocker.item}</td>
                      <td className="py-3"><StatusBadge status={blocker.status} /></td>
                      <td className="py-3 text-slate-400">{blocker.owner}</td>
                      <td className="py-3 text-slate-400 text-xs">{blocker.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          {/* Operations Log */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="text-emerald-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Recent Operations</h2>
            </div>
            <Card className="max-h-64 overflow-auto">
              <div className="space-y-3">
                {data.operationsLog.slice().reverse().map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 pb-3 border-b border-slate-700/50 last:border-0">
                    <span className="text-xs text-slate-500 font-mono mt-0.5">{log.time}</span>
                    <div>
                      <p className="text-sm text-white">{log.action}</p>
                      <p className="text-xs text-emerald-400">{log.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-slate-500">
            Mission Control Dashboard • Auto-updates as agents complete tasks
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

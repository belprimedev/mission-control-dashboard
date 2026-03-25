# Mission Control Dashboard

A professional, real-time operations dashboard built with React, Tailwind CSS, and Vite.

![Dashboard Preview](https://via.placeholder.com/800x400/0f172a/10b981?text=Mission+Control+Dashboard)

## Features

- **Real-time Goal Progress**: Track 3 revenue phases (£10K, £50K, £100K) with visual progress bars
- **Active Agents Table**: Monitor agent status with color-coded indicators
- **Week 1 Task Tracker**: Interactive checkboxes for task management
- **Key Metrics Cards**: Quick view of prospects, outreach, revenue, and more
- **Blockers & Decisions**: Track what's blocking progress
- **Recent Operations Log**: Timeline of recent activities
- **Refresh Button**: Simulate data updates with loading state
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd /workspace/mission-control-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Data Structure

All dashboard data is stored in `src/App.jsx` in the `initialData` object:

```javascript
const initialData = {
  goals: [...],        // Revenue goals
  agents: [...],       // Active agents
  week1Tasks: [...],   // Week 1 tasks
  metrics: {...},      // Key metrics
  blockers: [...],     // Blockers & decisions
  operationsLog: [...] // Recent operations
};
```

Update this object to change the dashboard data.

## Customization

### Colors

The dashboard uses a dark theme with the following color scheme:
- Background: `slate-900`
- Cards: `slate-800/50`
- Success: `emerald-500`
- Warning: `amber-500`
- Info: `blue-500`

### Adding New Metrics

1. Add the metric to the `metrics` object in `initialData`
2. Add a new `MetricCard` component in the metrics grid section
3. Update the chart data if needed

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=dist
```

## Project Structure

```
mission-control-dashboard/
├── public/
├── src/
│   ├── App.jsx        # Main dashboard component
│   ├── index.css      # Tailwind imports
│   └── main.jsx       # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## License

MIT

---

Built with ⚡ by Apex Operator
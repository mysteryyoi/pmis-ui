# PMIS - Predictive Maintenance Information System UI

A modern, React-based frontend application designed to serve as a comprehensive dashboard for monitoring industrial assets, predictive maintenance models, and operational workflows.

## Features

- **Asset Management**: Monitor industrial equipment and machinery with detailed views for individual assets.
- **Predictive Analytics**: View machine learning predictions for asset health and manage system alerts.
- **MLOps Integration**: Manage the lifecycle of predictive models, track training datasets, evaluation runs, and overall model performance.
- **Maintenance Workflows**: Track and manage maintenance tasks and work orders generated from predictive alerts.
- **Centralized Dashboard**: High-level Key Performance Indicators (KPIs) and system health overviews.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pmis-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

### Building for Production

To create a production build, run:
```bash
npm run build
```

This will generate a `dist` folder with the optimized production assets.

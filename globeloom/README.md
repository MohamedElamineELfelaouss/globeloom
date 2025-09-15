# GlobeLoom - AI Trip Planner

This is a standalone React frontend for the GlobeLoom AI Trip Planner application, completely isolated from backend dependencies.

## Features

- **Landing Page**: Hero section with trip planning introduction
- **Create Trip**: Interactive form to plan new trips with destination, duration, budget, and traveler selection
- **View Trip**: Display detailed trip information with itinerary and hotel recommendations
- **My Trips**: List and manage saved trips
- **Mock Data**: Fully functional UI with simulated API responses

## Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd globeloom
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (Button, Input)
│   └── custom/             # App-specific components (Hero, Header)
├── constants/              # Form options and data
├── services/               # Mock API services
├── create-trip/           # Trip creation page
├── view-trip/             # Trip details page
├── my-trips/              # User trips page
├── lib/                   # Utilities
├── App.jsx                # Home page
└── main.jsx               # App entry point
```

## Mock Services

The application uses mock services that simulate:
- **AI Trip Generation**: Predefined trip templates based on destination
- **Image Services**: Unsplash placeholder images
- **Local Storage**: Trip data persistence

## Key Features Isolated

- ✅ Google OAuth authentication (replaced with mock sign-in)
- ✅ Firebase database (replaced with localStorage)
- ✅ Google Gemini AI API (replaced with mock trip generation)
- ✅ Google Places API (replaced with mock location data)
- ✅ External image APIs (replaced with Unsplash placeholders)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

This is an isolated frontend for demonstration purposes. The UI components maintain the original design and functionality while using mock data services.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

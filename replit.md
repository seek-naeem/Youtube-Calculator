# YouTube Creator Earnings Calculator

## Overview

This is a full-stack web application built for YouTube content creators to calculate their potential earnings based on views, RPM (Revenue Per Mille), and currency preferences. The application features a modern, animated interface with glass morphism design effects and provides trending niche information to help creators make informed decisions about their content strategy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI components with custom shadcn/ui styling
- **Animation**: GSAP (GreenSock Animation Platform) for smooth animations and transitions
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API**: RESTful API endpoints for data operations
- **Validation**: Zod for request/response validation
- **Development**: Hot module replacement with Vite middleware integration

### Key Design Decisions
- **Monorepo Structure**: Shared schema and types between client and server
- **Glass Morphism Design**: Modern UI with backdrop blur effects and transparency
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme Support**: Light/dark mode with smooth transitions
- **Animation-First**: Heavy use of GSAP for engaging user experience

## Key Components

### Data Models
- **Currencies**: Support for multiple currencies with exchange rates
- **Trending Niches**: Curated list of trending YouTube niches with RPM ranges
- **Earnings Calculations**: User calculation history with timestamps

### Frontend Components
- **EarningsCalculator**: Main calculator interface with real-time calculations
- **EarningsDisplay**: Animated earnings visualization with daily/monthly/yearly projections
- **TrendingNiches**: Interactive cards showing trending content categories
- **MorphingLogo**: Animated logo with color transitions
- **Header/Footer**: Navigation and branding components

### API Endpoints
- `GET /api/currencies` - Retrieve available currencies
- `GET /api/trending-niches` - Get trending content niches
- `POST /api/earnings-calculation` - Save user calculations
- `GET /api/earnings-calculations` - Retrieve calculation history
- `POST /api/youtube-import` - Import YouTube video/channel data with thumbnail extraction

## Recent Updates (December 2024)

### Enhanced YouTube Integration
- **Video Data Extraction**: Added comprehensive video URL parsing supporting multiple YouTube formats
- **Thumbnail Display**: Automatic thumbnail fetching and display for imported videos
- **Video Metadata**: Shows video title, channel name, view count, subscriber count, and duration
- **Layout Optimization**: Moved trending niches section below calculator for better user flow
- **Improved UX**: Added visual cards displaying imported video/channel information

### Data Models Updates
- **YouTube Videos**: New schema for storing video metadata including thumbnails and analytics
- **Enhanced Import**: Support for both individual videos and channel data import

## Data Flow

1. **User Input**: User enters daily views, RPM, and selects currency (or imports from YouTube)
2. **YouTube Integration**: Video URLs are parsed to extract video ID and fetch thumbnail/metadata
3. **Real-time Calculation**: Frontend calculates earnings using utility functions
4. **API Communication**: React Query manages server state and caching
5. **Data Persistence**: Calculations saved to PostgreSQL via Drizzle ORM
6. **Animation Updates**: GSAP animates number changes and UI transitions

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **GSAP**: Professional animation library
- **React Query**: Server state management
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Wouter**: Lightweight routing

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Environment variable for DATABASE_URL connection
- **API Proxy**: Vite proxies API requests to Express server

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Deployment**: Single Node.js server serves both API and static files

### Architecture Benefits
- **Type Safety**: Shared TypeScript types between client and server
- **Performance**: Serverless database with efficient caching
- **User Experience**: Smooth animations and responsive design
- **Developer Experience**: Hot reloading and type checking throughout development
- **Scalability**: Stateless API design with external database
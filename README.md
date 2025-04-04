# Weather App

A React Native weather application built with TypeScript and Redux, providing current weather conditions and 5-day forecasts.


https://github.com/user-attachments/assets/92d93466-b2b7-48ba-9101-086a82133976


## Features

- Current weather conditions
- 5-day weather forecast
- Location search
- Current location detection
- Recent searches history

## Setup

### Prerequisites

- Node.js >= 18
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

### Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd WeatherApp
npm install
```

2. Set up your API key:

```bash
# Copy the template file
cp src/config/env.template.ts src/config/env.ts

# Edit src/config/env.ts and replace 'your_api_key_here' with your OpenWeatherMap API key
```

3. Run the app:

```bash
# iOS
npm run ios

# Android
npm run android
```

## Architecture

```
src/
├── components/    # Reusable UI components
├── config/       # App configuration
├── hooks/        # Custom React hooks
├── navigation/   # Navigation setup
├── screens/      # App screens
├── services/     # API services
├── store/        # Redux store
├── theme/        # UI theme
└── types/        # TypeScript types
```

### Key Components

- **Weather Service** (`services/weatherApi.ts`)

  - Handles OpenWeatherMap API integration
  - Provides current weather and forecast data

- **State Management** (`store/weatherSlice.ts`)

  - Redux store for weather data
  - Manages app state and recent searches

- **Location Hook** (`hooks/useGeolocation.ts`)
  - Handles device location permissions
  - Provides current location coordinates

### Environment Configuration

The app uses a simple configuration file for environment variables:

```typescript
// src/config/env.ts
export const ENV = {
  WEATHER_API_KEY: 'your_api_key_here', // Add your API key here
};
```

## API Integration

Uses OpenWeatherMap API endpoints:

- Current Weather: `/weather`
- 5-day Forecast: `/forecast`
- Geocoding: `/geo/1.0/direct`

## License

MIT

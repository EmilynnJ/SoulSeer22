// Project Structure for SoulSeer Frontend

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
});

// package.json
{
  "name": "soulseer-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@stripe/react-stripe-js": "^2.5.0",
    "@stripe/stripe-js": "^3.0.3",
    "agora-rtc-react": "^2.0.0",
    "agora-rtc-sdk-ng": "^4.20.0",
    "axios": "^1.6.7",
    "date-fns": "^3.3.1",
    "jwt-decode": "^4.0.0",
    "lodash": "^4.17.21",
    "luxon": "^3.4.4",
    "mux-embed": "^4.30.0",
    "react": "^18.2.0",
    "react-datepicker": "^5.0.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.1",
    "react-router-dom": "^6.22.0",
    "socket.io-client": "^4.7.4",
    "styled-components": "^6.1.8",
    "twilio-video": "^2.28.1",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.0.8"
  }
}

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SoulSeer - Connect with gifted spiritual readers" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>SoulSeer - Spiritual Guidance and Readings</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// Main file structure
/src
  /assets
    /images
      logo.svg
      favicon.svg
      background.jpg
    /icons
  /components
    /layout
      Header.jsx
      Footer.jsx
      Sidebar.jsx
      MainLayout.jsx
    /ui
      Button.jsx
      Card.jsx
      Modal.jsx
      Loader.jsx
      Alert.jsx
    /auth
      LoginForm.jsx
      RegisterForm.jsx
      ForgotPasswordForm.jsx
    /readers
      ReaderCard.jsx
      ReaderProfile.jsx
      ReaderApplication.jsx
      AvailabilityCalendar.jsx
    /sessions
      SessionCard.jsx
      SessionControls.jsx
      ChatInterface.jsx
      VideoInterface.jsx
      PhoneInterface.jsx
    /shop
      ProductCard.jsx
      CartItem.jsx
      Checkout.jsx
    /live
      LiveStream.jsx
      StreamControls.jsx
      ViewerList.jsx
      GiftPanel.jsx
    /admin
      UserManagement.jsx
      SessionLogs.jsx
      TransactionHistory.jsx
      ShopManagement.jsx
      ReaderApplications.jsx
  /contexts
    AuthContext.jsx
    CartContext.jsx
    SocketContext.jsx
    ThemeContext.jsx
  /hooks
    useAuth.jsx
    useCart.jsx
    useSocket.jsx
    useStripe.jsx
    useRTC.jsx
  /pages
    Welcome.jsx
    Home.jsx
    About.jsx
    Readers.jsx
    Live.jsx
    Shop.jsx
    Community.jsx
    Messages.jsx
    HelpCenter.jsx
    Policies.jsx
    ApplyReader.jsx
    Login.jsx
    Register.jsx
    /dashboard
      AdminDashboard.jsx
      ReaderDashboard.jsx
      ClientDashboard.jsx
  /services
    api.js
    auth.js
    stripe.js
    rtc.js
    socket.js
  /utils
    formatters.js
    validators.js
    helpers.js
  App.jsx
  main.jsx
  theme.css
  routes.jsx

// manifest.json
{
  "short_name": "SoulSeer",
  "name": "SoulSeer - Spiritual Guidance and Readings",
  "icons": [
    {
      "src": "favicon.svg",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/svg+xml"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}

// service-worker.js
// This will be automatically generated during the build process

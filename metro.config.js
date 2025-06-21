const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Completely disable cache to prevent serialization errors
config.resetCache = true;
config.cacheStores = [];
config.cache = {
  cacheStores: [],
};

// Disable file map cache
config.fileMap = {
  ...config.fileMap,
  cache: false,
};

// Disable transformer cache
config.transformer = {
  ...config.transformer,
  enableBabelRCLookup: false,
  enableBabelRuntime: false,
};

// Add CORS configuration for Tempo development environment
config.server = {
  ...config.server,
  cors: {
    origin: [
      "https://app.tempo.new",
      "https://tempo.new",
      "http://localhost:3000",
      "http://localhost:19006",
      "https://intelligent-williams1-s4hpn.view-3.tempo-dev.app",
      "*",
    ],
    credentials: true,
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });

const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithAudioAPIMetroConfig,
} = require("react-native-audio-api/metro-config");

/** @type {import("expo/metro-config").MetroConfig} */
const config = getDefaultConfig(__dirname);

// Agregar configuración para lucide-react-native
config.resolver.alias = {
  ...config.resolver.alias,
  "lucide-react-native": "lucide-react-native/src/lucide-react-native",
};

config.resolver.platforms = ["native", "android", "ios", "web"];

module.exports = wrapWithAudioAPIMetroConfig(config);

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
  
const config = getDefaultConfig(__dirname);
  
config.resolver.alias = {
    "@": require("path").resolve(__dirname, "src"),
};

module.exports = withNativeWind(config, { input: './global.css' });
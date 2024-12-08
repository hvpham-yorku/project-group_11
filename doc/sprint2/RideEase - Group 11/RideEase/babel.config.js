module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Correctly defined presets
    plugins: [
      'nativewind/babel',   // If you are using nativewind
      'expo-router/babel'   // Correct way to load expo-router plugin
    ],
  };
};
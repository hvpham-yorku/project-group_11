module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Correctly defined presets
    plugins: ["nativewind/babel"],  // Plugins placed in the correct property
  };
};
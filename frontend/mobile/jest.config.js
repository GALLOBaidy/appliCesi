module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["./jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|expo(nent)?|@expo" +
      "|expo-router" +
      "|react-native-reanimated" +
      "|@testing-library" +
      ")",
  ],
};

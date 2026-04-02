import "@testing-library/jest-native/extend-expect";

// Mock minimal pour expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

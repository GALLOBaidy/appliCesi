jest.mock("axios");

import { render } from "@testing-library/react-native";
import Profile from "@/app/(tabs)/profile";

// Mock du hook useAuth
jest.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { firstName: "John", lastName: "Doe" },
    logout: jest.fn(),
  }),  
}));  

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    Ionicons: (props: any) => React.createElement("Icon", props),
    MaterialIcons: (props: any) => React.createElement("Icon", props),
    FontAwesome: (props: any) => React.createElement("Icon", props),
  };  
});  


test("Le profil se rend sans crash", () => {
  render(<Profile />);
});

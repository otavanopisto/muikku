import { createTheme } from "@mantine/core";
import { brand /* , dark */ } from "./colors";
import { muikkuTokens } from "./tokens";

export const muikkuDefaultTheme = createTheme({
  primaryColor: "brand",
  //primaryShade: { light: 6, dark: 5 },
  //defaultRadius: "md",

  colors: {
    brand,

    //dark, // only if you override the dark scale
  },
  other: {
    ...muikkuTokens,
    padam: "#3b0a0a", // or pick fields you need in the resolver
  },
});

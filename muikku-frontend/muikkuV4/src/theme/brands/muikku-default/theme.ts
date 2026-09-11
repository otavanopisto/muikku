import { createTheme } from "@mantine/core";
import { brand /* , dark */ } from "./colors";
import { muikkuTokens } from "./tokens";

export const muikkuDefaultTheme = createTheme({
  primaryColor: "brand",
  //primaryShade: { light: 6, dark: 5 },

  colors: {
    brand,

    //dark, // only if you override the dark scale
  },
  other: {
    ...muikkuTokens, // or pick fields you need in the resolver
  },
});

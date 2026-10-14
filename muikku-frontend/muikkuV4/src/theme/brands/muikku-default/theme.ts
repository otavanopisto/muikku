import { colorsTuple, createTheme, virtualColor } from "@mantine/core";
import { brand /* , dark */ } from "./colors";
import { muikkuTokens } from "./tokens";

export const muikkuDefaultTheme = createTheme({
  primaryColor: "brand",
  //primaryShade: { light: 6, dark: 5 },

  colors: {
    brand,
    darkPanel: colorsTuple("oklch(27.6% 0.0233 248.68)"),
    lightPanel: colorsTuple("oklch(1 0 0)"),
    // Panel title text colors
    darkPanelTitleText: colorsTuple("oklch(0.9209 0 0)"),
    lightPanelTitleText: colorsTuple("oklch(0.1 0 0)"),
    darkPanelSeenTitleText: colorsTuple("oklch(0.6209 0 0)"),
    lightPanelSeenTitleText: colorsTuple("oklch(0.6 0 0)"),
    // Panel date text colors
    darkPanelContentText: colorsTuple("oklch(0.7544 0 0)"),
    lightPanelContentText: colorsTuple("oklch(0.5 0 0)"),
    darkPanelSeenContentText: colorsTuple("oklch(0.5544 0 0)"),
    lightPanelSeenContentText: colorsTuple("oklch(0.8 0 0)"),

    panels: virtualColor({
      name: "panels",
      dark: "darkPanel",
      light: "lightPanel",
    }),
    panelTitleText: virtualColor({
      name: "panelTitleText",
      dark: "darkPanelTitleText",
      light: "lightPanelTitleText",
    }),
    panelSeenTitleText: virtualColor({
      name: "panelSeenTitleText",
      dark: "darkPanelSeenTitleText",
      light: "lightPanelSeenTitleText",
    }),

    panelContentText: virtualColor({
      name: "panelContentText",
      dark: "darkPanelContentText",
      light: "lightPanelContentText",
    }),
    panelSeenContentText: virtualColor({
      name: "panelSeenContentText",
      dark: "darkPanelSeenContentText",
      light: "lightPanelSeenContentText",
    }),
    //dark, // only if you override the dark scale
  },
  other: {
    ...muikkuTokens, // or pick fields you need in the resolver
  },
});

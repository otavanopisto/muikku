import { type MantineColorsTuple } from "@mantine/core";

export const brand: MantineColorsTuple = [
  "#e6f7ff", // 0
  "#bae7ff",
  "#91d5ff",
  "#69c0ff",
  "#40a9ff",
  "#1890ff",
  "#0EA5E9", // 6 — primary-ish cyan/blue from mock
  "#0984c7",
  "#076a9e",
  "#045276", // 9
];

/** Warning, attention, incomplete. Shade 6 is the swatch from the status guide. */
export const warning: MantineColorsTuple = [
  "oklch(95.10% 0.0645 90.86)",
  "oklch(93.23% 0.0755 86.34)",
  "oklch(91.39% 0.0867 82.85)",
  "oklch(89.40% 0.0975 79.06)",
  "oklch(87.61% 0.1096 77.02)",
  "oklch(85.67% 0.1219 74.66)",
  "oklch(83.96% 0.1344 73.34)", // 6
  "oklch(75.90% 0.1345 73.06)",
  "oklch(67.86% 0.1341 73.20)",
  "oklch(59.05% 0.1273 70.84)",
];

/** Error, danger, failure, failed. Shade 6 is the swatch from the status guide. */
export const error: MantineColorsTuple = [
  "oklch(93.60% 0.0322 22.46)",
  "oklch(90.60% 0.0485 21.22)",
  "oklch(87.87% 0.0642 20.82)",
  "oklch(85.00% 0.0816 20.76)",
  "oklch(82.42% 0.0982 20.92)",
  "oklch(79.75% 0.1162 20.61)",
  "oklch(77.21% 0.1343 20.63)", // 6
  "oklch(69.20% 0.1343 20.57)",
  "oklch(61.21% 0.1354 20.18)",
  "oklch(52.17% 0.1345 20.69)",
];

/** Info, in progress. Shade 6 is the swatch from the status guide. */
export const info: MantineColorsTuple = [
  "oklch(96.39% 0.0412 202.08)",
  "oklch(93.91% 0.0485 214.24)",
  "oklch(91.72% 0.0567 221.88)",
  "oklch(89.49% 0.0666 227.19)",
  "oklch(87.27% 0.0769 231.20)",
  "oklch(85.08% 0.0874 234.36)",
  "oklch(82.91% 0.0982 236.93)", // 6
  "oklch(74.90% 0.0979 237.13)",
  "oklch(66.94% 0.0986 236.87)",
  "oklch(57.90% 0.0984 237.44)",
];

/** Success, done, saved, updated. Shade 6 is the swatch from the status guide. */
export const success: MantineColorsTuple = [
  "oklch(94.14% 0.1025 147.08)",
  "oklch(93.02% 0.1247 146.96)",
  "oklch(91.99% 0.1463 146.74)",
  "oklch(90.94% 0.1691 146.59)",
  "oklch(89.50% 0.1885 146.54)",
  "oklch(87.60% 0.2056 146.47)",
  "oklch(85.76% 0.2219 146.47)", // 6
  "oklch(77.78% 0.2221 146.41)",
  "oklch(69.97% 0.2171 145.46)",
  "oklch(61.75% 0.2068 142.98)",
];

/** Aborted, cancelled, discarded. Shade 6 is the swatch from the status guide. */
export const aborted: MantineColorsTuple = [
  "oklch(96.93% 0.0144 264.50)",
  "oklch(88.05% 0.0240 272.79)",
  "oklch(79.30% 0.0263 271.07)",
  "oklch(70.39% 0.0285 271.72)",
  "oklch(61.44% 0.0314 270.18)",
  "oklch(52.60% 0.0342 270.69)",
  "oklch(43.75% 0.0375 271.03)", // 6
  "oklch(35.83% 0.0361 269.56)",
  "oklch(27.67% 0.0381 270.95)",
  "oklch(18.77% 0.0376 270.70)",
];

// Optional: custom dark greys if default Mantine dark feels wrong
export const dark: MantineColorsTuple = [
  "#0B1120",
  "#1E293B",
  "#334155",
  "#475569",
  "#64748B",
  "#94A3B8",
  "#CBD5E1",
  "#E2E8F0",
  "#F1F5F9",
  "#F8FAFC",
];

// priority colors

/** High priority.  Shade 6 is Okabe–Ito vermillion (#D55E00), which stays distinct from green for red–green color blindness. */
export const high: MantineColorsTuple = [
  "oklch(96.50% 0.0191 47.51)",
  "oklch(93.00% 0.0391 47.51)",
  "oklch(88.00% 0.0697 47.51)",
  "oklch(82.00% 0.1101 47.51)",
  "oklch(75.00% 0.1500 47.51)",
  "oklch(68.50% 0.1650 47.51)",
  "oklch(62.13% 0.1705 47.51)", // 6
  "oklch(54.00% 0.1496 47.51)",
  "oklch(46.00% 0.1281 47.51)",
  "oklch(38.00% 0.1071 47.51)",
];
/** Medium priority.Shade 6 is Okabe–Ito blue (#0072B2), distinct from high-priority blue and green for red–green color blindness. */

export const medium: MantineColorsTuple = [
  "oklch(96.50% 0.0179 244.05)",
  "oklch(93.00% 0.0363 244.05)",
  "oklch(87.50% 0.0650 244.05)",
  "oklch(80.00% 0.0900 244.05)",
  "oklch(71.00% 0.1150 244.05)",
  "oklch(62.00% 0.1300 244.05)",
  "oklch(53.19% 0.1313 244.05)", // 6
  "oklch(46.00% 0.1137 244.05)",
  "oklch(39.00% 0.0965 244.05)",
  "oklch(32.00% 0.0793 244.05)",
];

/** Low priority. Shade 6 is violet (#938AF9), distinct from high-priority blue and medium-priority vermillion for red–green color blindness. */
export const low: MantineColorsTuple = [
  "oklch(96.50% 0.0173 285.00)",
  "oklch(93.00% 0.0350 285.00)",
  "oklch(88.50% 0.0585 285.00)",
  "oklch(84.00% 0.0828 285.00)",
  "oklch(79.00% 0.1109 285.00)",
  "oklch(74.00% 0.1401 285.00)",
  "oklch(69.00% 0.1600 285.00)", // 6
  "oklch(60.00% 0.1450 285.00)",
  "oklch(51.00% 0.1250 285.00)",
  "oklch(42.00% 0.1050 285.00)",
];

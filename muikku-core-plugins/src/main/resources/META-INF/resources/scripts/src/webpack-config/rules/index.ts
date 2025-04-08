import * as webpack from "webpack";

import { js, ts, ts2, scss, css, cssDependencies } from "./rules";

// Defines the rules for the webpack configuration
const rules: webpack.RuleSetRule[] = [js, ts, ts2, scss, css, cssDependencies];

export default rules;

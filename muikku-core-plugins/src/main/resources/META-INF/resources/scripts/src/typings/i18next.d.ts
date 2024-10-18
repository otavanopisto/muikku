import { resources, defaultNS } from "../locales/i18n";

declare module "i18next" {
  // eslint-disable-next-line jsdoc/require-jsdoc
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["fi"];
  }
}

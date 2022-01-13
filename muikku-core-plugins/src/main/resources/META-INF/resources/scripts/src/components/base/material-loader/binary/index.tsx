import { MaterialContentNodeType } from "~/reducers/workspaces";
import { i18nType } from "reducers/base/i18n";
import Any from "./any";
import Pdf from "./pdf";
import Flash from "./flash";
import Image from "./image";
import Audio from "./audio";
import * as React from "react";

const registry = {
  "^image/": Image,
  pdf$: Pdf,
  "x-shockwave-flash$": Flash,
  "^audio/": Audio,
};

/**
 * BinaryMaterialLoader
 * @param props props
 * @param props.material material
 * @param props.i18n i18n
 * @param props.invisible invisible
 */
export default function BinaryMaterialLoader(props: {
  material: MaterialContentNodeType;
  i18n: i18nType;
  invisible?: boolean;
}) {
  let Element = Any;
  Object.keys(registry).forEach((matchKey) => {
    const regex = new RegExp(matchKey);
    if (regex.test(props.material.contentType)) {
      Element = (registry as any)[matchKey];
    }
  });

  return <Element {...props} />;
}

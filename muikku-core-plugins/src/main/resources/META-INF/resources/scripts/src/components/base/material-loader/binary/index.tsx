import Any from "./any";
import Pdf from "./pdf";
import Flash from "./flash";
import Image from "./image";
import Audio from "./audio";
import * as React from "react";
import { MaterialContentNode } from "~/generated/client";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

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
 * @param props.invisible invisible
 */
export default function BinaryMaterialLoader(props: {
  material: MaterialContentNodeWithIdAndLogic;
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

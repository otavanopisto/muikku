import { MaterialContentNodeType } from "~/reducers/workspaces";
import { i18nType } from "reducers/base/i18n";
import Any from "./any";
import Pdf from "./pdf";
import Flash from "./flash";
import Image from "./image";
import * as React from "react";

const registry = {
  "^image/": Image,
  "pdf$": Pdf,
  "x-shockwave-flash$": Flash,
}

export default function BinaryMaterialLoader(props: {
  material: MaterialContentNodeType,
  i18n: i18nType,
}) {
  let Element = Any;
  Object.keys(registry).forEach((matchKey) => {
    const regex = new RegExp(matchKey);
    if (regex.test(props.material.contentType)) {
      Element = (registry as any)[matchKey];
    }
  });
  
  return <Element {...props}/>
}
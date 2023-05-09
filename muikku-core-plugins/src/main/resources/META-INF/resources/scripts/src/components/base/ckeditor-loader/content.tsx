import * as React from "react";
import Base from "./base";

/**
 * MaterialLoaderContentProps
 */
interface CkeditorLoaderContentProps {
  html: string;
}

/**
 * CkeditorLoaderContent
 * @param props props
 */
function CkeditorLoaderContent(props: CkeditorLoaderContentProps) {
  return <Base html={props.html} usedAs="default" />;
}

export default CkeditorLoaderContent;

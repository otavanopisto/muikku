import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Link from "~/components/general/link";

type MaterialLoaderProducersLicenseProps = MaterialLoaderProps;

/**
 * MaterialLoaderProducersLicense
 * @param props props
 */
export function MaterialLoaderProducersLicense(
  props: MaterialLoaderProducersLicenseProps
) {
  if (
    !(
      (props.material.producers && props.material.producers.length) ||
      props.material.license
    )
  ) {
    return null;
  }

  const license = props.material.license;
  const hasLink = props.material.license
    ? props.material.license.indexOf("http://") === 0 ||
      props.material.license.indexOf("https://") === 0
    : false;

  return (
    <div className="material-page__metadata-container">
      {props.material.producers && props.material.producers.length ? (
        <div className="material-page__producers">
          <div className="material-page__producers-label">
            {props.i18n.text.get("plugin.workspace.materials.producersLabel")}:
          </div>
          <div className="material-page__producers-item">
            {props.material.producers.map((p) => p.name).join(", ")}
          </div>
        </div>
      ) : null}
      {props.material.license ? (
        <div className="material-page__license">
          <div className="material-page__license-label">
            {props.i18n.text.get("plugin.workspace.materials.licenseLabel")}:
          </div>
          {hasLink ? (
            <Link
              className="material-page__license-item"
              href={props.material.license}
              openInNewTab="_blank"
            >
              {props.material.license}
            </Link>
          ) : (
            <span>{props.material.license}</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

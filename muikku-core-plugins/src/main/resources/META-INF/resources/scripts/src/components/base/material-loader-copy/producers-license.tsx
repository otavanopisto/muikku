import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader-copy";
import Link from "~/components/general/link";

type MaterialLoaderProducersLicenseProps = MaterialLoaderProps;

/**
 * MaterialLoaderProducersLicense
 * @param props props
 */
export function MaterialLoaderProducersLicense(
  props: MaterialLoaderProducersLicenseProps
) {
  const { t } = useTranslation(["materials", "common"]);

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
    <div className="material-page__metadata-container rs_skip">
      {props.material.producers && props.material.producers.length ? (
        <div className="material-page__producers">
          <div className="material-page__producers-label">
            {t("labels.producers", { ns: "materials" })}:
          </div>
          <div className="material-page__producers-item">
            {props.material.producers.map((p) => p.name).join(", ")}
          </div>
        </div>
      ) : null}
      {license ? (
        <div className="material-page__license">
          <div className="material-page__license-label">
            {t("labels.license", { ns: "materials" })}:
          </div>
          {hasLink ? (
            <Link
              className="material-page__license-item"
              href={license}
              openInNewTab="_blank"
            >
              {license}
            </Link>
          ) : (
            <span>{license}</span>
          )}
        </div>
      ) : null}
    </div>
  );
}

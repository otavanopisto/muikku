import * as React from "react";
import { useTranslation } from "react-i18next";
import Link from "~/components/general/link";
import { RenderProps, RenderState } from "../types";

/**
 * MaterialLoaderProducersLicenseProps
 */
interface MaterialLoaderProducersLicenseProps
  extends RenderProps,
    RenderState {}

/**
 * MaterialLoaderProducersLicense
 * @param props props
 */
export function MaterialLoaderProducersLicense(
  props: MaterialLoaderProducersLicenseProps
) {
  const { material } = props;

  const { t } = useTranslation(["materials", "common"]);

  if (
    !((material.producers && material.producers.length) || material.license)
  ) {
    return null;
  }

  const license = material.license;
  const hasLink = material.license
    ? material.license.indexOf("http://") === 0 ||
      material.license.indexOf("https://") === 0
    : false;

  return (
    <div className="material-page__metadata-container rs_skip">
      {material.producers && material.producers.length ? (
        <div className="material-page__producers">
          <div className="material-page__producers-label">
            {t("labels.producers", { ns: "materials" })}:
          </div>
          <div className="material-page__producers-item">
            {material.producers.map((p) => p.name).join(", ")}
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

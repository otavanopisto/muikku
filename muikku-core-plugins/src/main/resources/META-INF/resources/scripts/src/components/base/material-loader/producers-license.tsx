import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';

interface MaterialLoaderProducersLicenseProps extends MaterialLoaderProps {
}

export function MaterialLoaderProducersLicense(props: MaterialLoaderProducersLicenseProps) {
  if (!((props.material.producers && props.material.producers.length) || props.material.license)) {
    return null;
  }

  return (<div className="material-page__metadata-container">
    {props.material.producers && props.material.producers.length ?
      <div className="material-page__producers">
        <div className="material-page__producers-label">{props.i18n.text.get("plugin.workspace.materials.producersLabel")}:</div>
        <div className="material-page__producers-item">{props.material.producers.map((p) => p.name).join(", ")}</div>
      </div>
    : null}
    {props.material.license ?
      <div className="material-page__license">
        <div className="material-page__license-label">{props.i18n.text.get("plugin.workspace.materials.licenseLabel")}:</div>
        <div className="material-page__license-item">{props.material.license}</div>
      </div> 
    : null}
  </div>);
}
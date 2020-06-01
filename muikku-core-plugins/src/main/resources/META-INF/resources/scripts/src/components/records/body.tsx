import MainFunctionNavbar from '../base/main-function/navbar';
import Application from './body/application';
import Aside from './body/aside';
import $ from "~/lib/jquery";

import * as React from 'react';

// TODO remove once merged with new branch
let hasLoadedNecessaryLibs = false;

function loadNecessaryLibs() {
  if (hasLoadedNecessaryLibs) {
    return;
  }
  hasLoadedNecessaryLibs = true;

  $.fn.muikkuWebSocket = function(...args: any[]){
    return this;
  }

  const libraries = [
    "/scripts/gui/environment.js",
    "//cdnjs.cloudflare.com/ajax/libs/jquery_lazyload/1.9.5/jquery.lazyload.min.js",
    "//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.1/jquery.magnific-popup.min.js",
    "//cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.28.0/js/jquery.fileupload.min.js",
    "//cdn.muikkuverkko.fi/libs/jquery.auto-grow-input/1.0.3/jquery.auto-grow-input.min.js",
    "//cdn.muikkuverkko.fi/libs/autosize/3.0.15/autosize.min.js",
    "//cdn.muikkuverkko.fi/libs/modernizr/3.3.1-webrtc/modernizr.min.js",
    "//cdn.muikkuverkko.fi/libs/gumadapter/1.0.0/gumadapter.js",
    "//cdnjs.cloudflare.com/ajax/libs/RecordRTC/5.5.8/RecordRTC.min.js",
    "//cdn.muikkuverkko.fi/libs/waypoints/4.0.1/lib/jquery.waypoints.min.js",
    "//cdn.muikkuverkko.fi/libs/lodash/4.12.0/lodash.min.js",
    "//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js",
    "//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js",
    "/scripts/gui/muikku-audio-field.js",
    "/scripts/gui/lazypdf.js",
    "/scripts/gui/lazyswf.js",
    "/scripts/gui/lazyframe.js",
    "/scripts/gui/audiorecord.js",
    "/scripts/gui/connectionlostnotifier.js",
    "/scripts/gui/muikku-file-field-component.js",
    "/scripts/gui/muikku-connect-field-component.js",
    "/scripts/gui/muikku-math-exercise-component.js",
    "/scripts/gui/muikku-rich-memo-field-component.js",
    "/scripts/gui/muikku-sorter-component.js",
    "/scripts/gui/muikku-image-details.js",
    "/scripts/gui/muikku-word-definition.js",
    "/scripts/gui/muikku-explanation-widget.js",
    "/scripts/gui/article-details.js",
    "/scripts/gui/muikku-field.js",
    "/scripts/gui/muikku-material-loader.js",
    "/scripts/gui/muikku-word-definition.js",
    "//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js",
    "//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js",
    "/scripts/gui/locales.js",
  ];

  const css = ["/css/deprecated/flex/records.css"];

  libraries.forEach((lib) => {
    const script = document.createElement("script");
    script.src = lib;
    script.type = "text/javascript";
    script.defer = true;

    document.head.appendChild(script);
  });

  css.forEach((css) => {
    const link = document.createElement("link");
    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";

    document.head.appendChild(link);
  });
}

export default class RecordsBody extends React.Component<{},{}> {
  componentDidMount() {
    loadNecessaryLibs();
  }
  render(){
    let aside = <Aside />
    return (<div>
      <MainFunctionNavbar activeTrail="records" navigation={aside}/>
      <Application aside={aside}/>
    </div>);
  }
}

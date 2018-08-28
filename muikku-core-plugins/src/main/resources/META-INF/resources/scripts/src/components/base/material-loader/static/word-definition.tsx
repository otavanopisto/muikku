import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";

interface ImageProps {
  element: HTMLElement,
  dataset: {
    muikkuWordDefinition: string
  },
  i18n: i18nType
}

export default function image(props: ImageProps){
  return <Dropdown openByHover modifier="word-definition" content={props.dataset.muikkuWordDefinition}>
    <mark data-muikku-word-definition={props.dataset.muikkuWordDefinition}>{props.element.textContent}</mark>
  </Dropdown>
}
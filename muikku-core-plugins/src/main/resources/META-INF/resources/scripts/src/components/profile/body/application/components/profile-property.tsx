import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";

export default function ProfileProperty(props: {
  i18n: i18nType,
  label: string,
  condition: boolean,
  value: string | Array<string | {
    key: any,
    value: string
  }>
}){
  if (!props.condition){
    return null;
  }
  return <div className="profile-element__item">
    <label className="profile-element__label">{props.i18n.text.get(props.label)}</label>
    {typeof props.value === "string" ?
      <div>{props.value}</div> :
      props.value.map((v)=>{
        return typeof v === "string" ? <div className="profile-element__data" key={v}>{v}</div> : <div className="profile-element__data" key={v.key}>{v.value}</div>
      })}
  </div>
}
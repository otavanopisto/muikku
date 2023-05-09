import * as React from "react";

/**
 * ProfileProperty
 * @param props props
 * @param props.label label
 * @param props.condition condition
 * @param props.modifier modifier
 * @param props.value value
 */
export default function ProfileProperty(props: {
  label: string;
  condition: boolean;
  modifier?: string;
  value:
    | string
    | Array<
        | string
        | {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            key: any;
            value: string;
          }
      >;
}) {
  if (!props.condition) {
    return null;
  }

  return (
    <div className="application-sub-panel__item  application-sub-panel__item--profile">
      <div className="form__row">
        <div className="form-element">
          <label>{props.label}</label>
          <div
            className={`application-sub-panel__item-data ${
              props.modifier
                ? "application-sub-panel__item-data--" + props.modifier
                : ""
            }`}
          >
            {typeof props.value === "string" ? (
              <span className="application-sub-panel__single-entry">
                {props.value}
              </span>
            ) : (
              props.value.map((v) =>
                typeof v === "string" ? (
                  <span className="application-sub-panel__single-entry" key={v}>
                    {v}
                  </span>
                ) : (
                  <span
                    className="application-sub-panel__single-entry"
                    key={v.key}
                  >
                    {v.value}
                  </span>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

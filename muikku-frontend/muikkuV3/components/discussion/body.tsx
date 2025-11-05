import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import { useTranslation } from "react-i18next";

/**
 * DiscussionBodyProps
 */
interface DiscussionBodyProps {}

/**
 * CoursepickerBody
 * @param props props
 */
const DiscussionBody = (props: DiscussionBodyProps) => {
  const { t } = useTranslation("common");

  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.discussion")}
        activeTrail="discussion"
      />
      <Application />
    </div>
  );
};

export default DiscussionBody;

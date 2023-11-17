import MainFunctionNavbar from "../base/main-function/navbar";
import ScreenContainer from "../general/screen-container";
import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";

import CheckContactInfoDialog from "~/components/base/check-contact-info-dialog";
import "~/sass/elements/wcag.scss";
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from "react-i18next";
import StudentComponent from "./layouts/student";
import StaffComponent from "./layouts/staff";
// import GuardianComponent from "./layouts/guardian";

/**
 * IndexBodyProps
 */
interface IndexBodyProps extends WithTranslation {
  status: StatusType;
}

/**
 * IndexBody
 * @param props component props
 */
const IndexBody: React.FC<IndexBodyProps> = (props) => {
  const status = props.status;
  const { t } = useTranslation("frontPage");
  return (
    <div>
      <MainFunctionNavbar activeTrail="index" />
      <ScreenContainer viewModifiers="index">
        <h1 className="visually-hidden">{t("wcag.indexViewHeader")}</h1>
        {status.isStudent ? (
          <StudentComponent studiesEnded={status.isActiveUser} />
        ) : (
          <StaffComponent />
        )}
      </ScreenContainer>
      <CheckContactInfoDialog />
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["frontPage"])(
  connect(mapStateToProps, mapDispatchToProps)(IndexBody)
);

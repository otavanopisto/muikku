import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import {
  ProfileAuthorizations,
  ProfileState,
} from "~/reducers/main-function/profile";
import {
  UpdateProfileAuthorizationsTriggerType,
  updateProfileAuthorizations,
} from "../../../../actions/main-function/profile";

/**
 * AuthorizationsProps
 */
interface AuthorizationsProps {
  profile: ProfileState;
  displayNotification: DisplayNotificationTriggerType;
  updateProfileAuthorizations: UpdateProfileAuthorizationsTriggerType;
}

/**
 * Authorizations component
 * @param props props
 */
const Authorizations = (props: AuthorizationsProps) => {
  const [sliceIntegrationActive, setSliceIntegrationActive] =
    React.useState(false);
  const [locked, setLocked] = React.useState(false);

  const { t } = useTranslation(["common", "profile"]);

  // Effect to update slice integration active state
  React.useEffect(() => {
    if (props.profile.authorizations) {
      setSliceIntegrationActive(props.profile.authorizations.studentCardActive);
    }
  }, [props.profile.authorizations]);

  /**
   * Handles slice integration change
   * @param event event
   */
  const handleSliceIntegrationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSliceIntegrationActive(event.target.checked);
  };

  /**
   * Handles authorization save
   */
  const handleAuthorizationSave = () => {
    setLocked(true);

    // Updated authorizations object
    let updatedAuthorizations: Partial<ProfileAuthorizations> = {};

    // If information has changed
    if (
      sliceIntegrationActive !== props.profile.authorizations.studentCardActive
    ) {
      updatedAuthorizations = {
        studentCardActive: sliceIntegrationActive,
      };
    }

    props.updateProfileAuthorizations({
      current: props.profile.authorizations,
      updated: updatedAuthorizations,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        props.displayNotification(t("notifications.saveSuccess"), "success");

        setLocked(false);
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      fail: () => {
        props.displayNotification(t("notifications.saveError"), "error");

        setLocked(false);
      },
    });
  };

  // Nothing to show if not in authorizations or no authorizations properties
  if (
    props.profile.location !== "authorizations" ||
    (props.profile.authorizations &&
      Object.keys(props.profile.authorizations).length === 0)
  ) {
    return null;
  }

  return (
    <section>
      <h2 className="application-panel__content-header">
        {t("labels.authorizations", { ns: "profile" })}
      </h2>
      <div className="application-sub-panel">
        <div className="application-sub-panel__body">
          <div className="application-sub-panel__item  application-sub-panel__item--profile">
            <div className="form__row">
              <div className={`form-element`}>
                <label>
                  {t("labels.studentCardAuthorizationTitle", { ns: "profile" })}
                </label>
                <div className="form-element form-element--checkbox-radiobutton">
                  <input
                    checked={sliceIntegrationActive}
                    id="profileSliceIntegration"
                    type="checkbox"
                    onChange={handleSliceIntegrationChange}
                  />
                  <label htmlFor="profileSliceIntegration">
                    {t("labels.iWantDigitalStudentCard", { ns: "profile" })}
                  </label>
                </div>
                <div className="form-element__description">
                  {t("content.sliceAuthorization1", { ns: "profile" })}
                </div>
                <div className="form-element__description">
                  {t("content.sliceAuthorization2", { ns: "profile" })}
                </div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel__item  application-sub-panel__item--profile">
            <div className="form__buttons">
              <Button
                buttonModifiers="primary-function-save"
                onClick={handleAuthorizationSave}
                disabled={locked}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    profile: state.profile,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateProfileAuthorizations,
      displayNotification,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorizations);

import Link from "~/components/general/link";
import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import {
  filterHighlight,
  filterMatch,
  intersect,
  difference,
  flatten,
} from "~/util/modifiers";
import { connect } from "react-redux";
import {
  createGuiderFilterLabel,
  CreateGuiderFilterLabelTriggerType,
} from "~/actions/main-function/guider";
import {
  addGuiderLabelToCurrentUser,
  removeGuiderLabelFromCurrentUser,
  AddGuiderLabelToCurrentUserTriggerType,
  RemoveGuiderLabelFromCurrentUserTriggerType,
  AddGuiderLabelToSelectedUsersTriggerType,
  addGuiderLabelToSelectedUsers,
  RemoveGuiderLabelFromSelectedUsersTriggerType,
  removeGuiderLabelFromSelectedUsers,
} from "~/actions/main-function/guider";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers";
import { GuiderState } from "~/reducers/main-function/guider";
import { ButtonPill } from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * GuiderToolbarLabelsProps
 */
interface GuiderToolbarLabelsProps extends WithTranslation<["common"]> {
  guider: GuiderState;
  createGuiderFilterLabel: CreateGuiderFilterLabelTriggerType;
  addGuiderLabelToCurrentUser: AddGuiderLabelToCurrentUserTriggerType;
  removeGuiderLabelFromCurrentUser: RemoveGuiderLabelFromCurrentUserTriggerType;
  addGuiderLabelToSelectedUsers: AddGuiderLabelToSelectedUsersTriggerType;
  removeGuiderLabelFromSelectedUsers: RemoveGuiderLabelFromSelectedUsersTriggerType;
}

/**
 * GuiderToolbarLabelsState
 */
interface GuiderToolbarLabelsState {
  labelFilter: string;
}

/**
 * GuiderToolbarLabels
 */
class GuiderToolbarLabels extends React.Component<
  GuiderToolbarLabelsProps,
  GuiderToolbarLabelsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuiderToolbarLabelsProps) {
    super(props);

    this.state = {
      labelFilter: "",
    };

    this.updateLabelFilter = this.updateLabelFilter.bind(this);
  }

  /**
   * updateLabelFilter
   * @param e e
   */
  updateLabelFilter(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ labelFilter: e.target.value });
  }

  /**
   * render
   */
  render() {
    if (this.props.guider.currentStudent) {
      return (
        <Dropdown
          modifier="guider-labels"
          items={[
            <div
              key="update-label"
              className="form-element form-element--new-label"
            >
              <input
                className="form-element__input"
                value={this.state.labelFilter}
                onChange={this.updateLabelFilter}
                type="text"
                placeholder={this.props.i18n.t("labels.createAndSearch", {
                  ns: "flags",
                })}
              />
            </div>,
            <Link
              key="link-new"
              className="link link--full link--new"
              onClick={this.props.createGuiderFilterLabel.bind(
                null,
                this.state.labelFilter
              )}
            >
              {this.props.i18n.t("actions.create", { ns: "flags" })}
            </Link>,
          ].concat(
            this.props.guider.availableFilters.labels
              .filter((item) => filterMatch(item.name, this.state.labelFilter))
              .map((label) => {
                const isSelected = (
                  this.props.guider.currentStudent.labels || []
                ).find((l) => l.flagId === label.id);

                return (
                  <Link
                    key={label.id}
                    className={`link link--full link--guider-label-dropdown ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={
                      !isSelected
                        ? this.props.addGuiderLabelToCurrentUser.bind(
                            null,
                            label
                          )
                        : this.props.removeGuiderLabelFromCurrentUser.bind(
                            null,
                            label
                          )
                    }
                  >
                    <span
                      className="link__icon icon-flag"
                      style={{ color: label.color }}
                    ></span>
                    <span className="link__text">
                      {filterHighlight(label.name, this.state.labelFilter)}
                    </span>
                  </Link>
                );
              })
          )}
        >
          <ButtonPill
            buttonModifiers="flag"
            icon="flag"
            disabled={this.props.guider.toolbarLock}
          />
        </Dropdown>
      );
    }

    let allInCommon: number[] = [];
    let onlyInSome: number[] = [];
    const isAtLeastOneSelected = this.props.guider.selectedStudents.length >= 1;

    if (isAtLeastOneSelected) {
      const partialIds = this.props.guider.selectedStudents.map((student) =>
        student.flags.map((l) => l.flagId)
      );
      allInCommon = intersect(...partialIds);
      onlyInSome = difference(allInCommon, flatten(...partialIds));
    }

    return (
      <Dropdown
        modifier="guider-labels"
        items={[
          <div
            key="update-label"
            className="form-element form-element--new-label"
          >
            <input
              className="form-element__input"
              value={this.state.labelFilter}
              onChange={this.updateLabelFilter}
              type="text"
              placeholder={this.props.i18n.t("labels.createAndSearch", {
                ns: "flags",
              })}
            />
          </div>,
          <Link
            tabIndex={0}
            key="create-label"
            className="link link--full"
            onClick={this.props.createGuiderFilterLabel.bind(
              null,
              this.state.labelFilter
            )}
          >
            {this.props.i18n.t("actions.create", { ns: "flags" })}
          </Link>,
        ].concat(
          this.props.guider.availableFilters.labels
            .filter((item) => filterMatch(item.name, this.state.labelFilter))
            .map((label) => {
              const isSelected = allInCommon.includes(label.id as number);
              const isPartiallySelected = onlyInSome.includes(
                label.id as number
              );

              return (
                <Link
                  key={label.id}
                  className={`link link--full link--guider-label-dropdown ${
                    isSelected ? "selected" : ""
                  } ${isPartiallySelected ? "semi-selected" : ""}`}
                  disabled={!isAtLeastOneSelected}
                  onClick={
                    !isSelected || isPartiallySelected
                      ? this.props.addGuiderLabelToSelectedUsers.bind(
                          null,
                          label
                        )
                      : this.props.removeGuiderLabelFromSelectedUsers.bind(
                          null,
                          label
                        )
                  }
                >
                  <span
                    className="link__icon icon-flag"
                    style={{ color: label.color }}
                  ></span>
                  <span className="link__text">
                    {filterHighlight(label.name, this.state.labelFilter)}
                  </span>
                </Link>
              );
            })
        )}
      >
        <ButtonPill buttonModifiers="flag" icon="flag" />
      </Dropdown>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      createGuiderFilterLabel,
      addGuiderLabelToCurrentUser,
      removeGuiderLabelFromCurrentUser,
      addGuiderLabelToSelectedUsers,
      removeGuiderLabelFromSelectedUsers,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(GuiderToolbarLabels)
);

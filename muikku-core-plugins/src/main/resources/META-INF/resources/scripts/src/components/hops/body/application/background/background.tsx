import * as React from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";
import CompulsoryStudiesHopsWizard from "../wizard/compulsory-studies-wizard/compulsory-studies-hops-wizard";
import SecondaryStudiesHopsWizard from "../wizard/secondary-studies-wizard/secondary-studies-hops-wizard";

/**
 * BackgroundProps
 */
interface BackgroundProps {
  hops: HopsState;
  onHasUnsavedChanges?: (hasUnsavedChanges: boolean) => void;
}

/**
 * Background component
 * @param props props
 */
const Background = (props: BackgroundProps) => {
  const { hops, onHasUnsavedChanges } = props;

  if (!hops.studentInfo || !hops.hopsForm) {
    return null;
  }

  if (hops.studentInfo.studyProgrammeEducationType === "peruskoulu") {
    return (
      <CompulsoryStudiesHopsWizard onHasUnsavedChanges={onHasUnsavedChanges} />
    );
  }

  return (
    <SecondaryStudiesHopsWizard onHasUnsavedChanges={onHasUnsavedChanges} />
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Background);

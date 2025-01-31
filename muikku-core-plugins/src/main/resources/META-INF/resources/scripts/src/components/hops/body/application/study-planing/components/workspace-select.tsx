import * as React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { OptionDefault } from "~/components/general/react-select/types";
import { useAvailableWorkspaces } from "../hooks/useAvailableWorkspaces";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { useTranslation } from "react-i18next";
import { HopsAvailableCourse } from "~/generated/client";
import { Action, Dispatch } from "redux";

/**
 * WorkspaceSelectProps
 */
interface WorkspaceSelectProps {
  /**
   * Selected workspace instance id
   */
  selectedWorkspaceInstanceId?: number;
  /**
   * On change
   */
  onChange: (selectedCourse?: OptionDefault<HopsAvailableCourse>) => void;
  /**
   * If select is disabled
   */
  disabled: boolean;
  /**
   * Subject code
   */
  subjectCode: string;
  /**
   * Course number
   */
  courseNumber: number;
  /**
   * OPS. E.g "OPS 2021"
   */
  ops?: string;
  /**
   * Id
   */
  id: string;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WorkspaceSelect
 * @param props props
 */
const WorkspaceSelect: React.FC<WorkspaceSelectProps> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const {
    selectedWorkspaceInstanceId,
    id,
    onChange,
    disabled,
    displayNotification,
    subjectCode,
    courseNumber,
    ops,
  } = props;
  const { availableCourses, loadingAvailableCourses } = useAvailableWorkspaces({
    parameters: {
      subjectCode,
      courseNumber,
      ops,
    },
    displayNotification,
  });

  /**
   * handleSelectChange
   * @param option option
   */
  const handleSelectChange = (option: OptionDefault<HopsAvailableCourse>) => {
    onChange(option);
  };

  const options: OptionDefault<HopsAvailableCourse>[] = availableCourses.map(
    (course) => ({
      value: course,
      label: course.name,
    })
  );

  const selectedValue = selectedWorkspaceInstanceId
    ? (options.find(
        (option) => option.value.id === selectedWorkspaceInstanceId
      ) ?? {
        value: {
          id: selectedWorkspaceInstanceId,
          startDate: "",
          endDate: "",
          instanceExists: false,
        },
        label: "Kurssi-ilmentymää ei löytynyt",
      })
    : null;

  return (
    <Select
      id={id}
      className="react-select-override react-select-override--hops"
      classNamePrefix="react-select-override"
      isClearable
      placeholder={t("labels.search", {
        ns: "pedagogySupportPlan",
        context: "course",
      })}
      options={options}
      value={selectedValue}
      onChange={handleSelectChange}
      noOptionsMessage={() =>
        t("content.empty", { ns: "common", context: "courses" })
      }
      isLoading={loadingAvailableCourses}
      isDisabled={disabled}
    />
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {
    displayNotification,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceSelect);

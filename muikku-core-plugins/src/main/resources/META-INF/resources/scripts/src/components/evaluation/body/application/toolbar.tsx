import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/evaluation.scss";
import { ButtonPill } from "../../../general/button";
import Dropdown from "~/components/general/dropdown";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
  ApplicationPanelToolsContainer,
} from "../../../general/application-panel/application-panel";
import { SearchFormElement } from "../../../general/form-element";
import { bindActionCreators } from "redux";
import { EvaluationState } from "../../../../reducers/main-function/evaluation/index";
import { EvaluationFilters } from "../../../../@types/evaluation";
import {
  SetEvaluationFilters,
  setEvaluationFilters,
} from "../../../../actions/main-function/evaluation/evaluationActions";
import {
  UpdateEvaluationSearch,
  updateEvaluationSearch,
} from "../../../../actions/main-function/evaluation/evaluationActions";

interface EvaluationToolbarProps {
  i18n: i18nType;
  title: string;
  updateEvaluationSearch: UpdateEvaluationSearch;
  evaluations: EvaluationState;
  setEvaluationFilters: SetEvaluationFilters;
}

interface EvaluationToolbarState {}

class EvaluationToolbar extends React.Component<
  EvaluationToolbarProps,
  EvaluationToolbarState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationToolbarProps) {
    super(props);
  }

  /**
   * handleSearchFormElementChange
   * @param e
   */
  handleSearchFormElementChange = (e: string) => {
    this.props.updateEvaluationSearch({ searchString: e });
  };

  /**
   * handleCheckboxClick
   */
  handleCheckboxClick =
    (filter: keyof EvaluationFilters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFilters: EvaluationFilters = {
        ...this.props.evaluations.evaluationFilters,
        [filter]: e.target.checked,
      };

      this.props.setEvaluationFilters({ evaluationFilters: updatedFilters });
    };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const checkboxes = [
      <div className="checkbox__item">
        <input
          onChange={this.handleCheckboxClick("evaluated")}
          checked={this.props.evaluations.evaluationFilters.evaluated}
          type="checkbox"
          className="evaluation__input"
        />
        <label>Arvioidut</label>
      </div>,
      <div className="checkbox__item">
        <input
          onChange={this.handleCheckboxClick("assessmentRequest")}
          checked={this.props.evaluations.evaluationFilters.assessmentRequest}
          type="checkbox"
          className="evaluation__input"
        />
        <label>Arvioinnin pyytäneet</label>
      </div>,
      <div className="checkbox__item">
        <input
          onChange={this.handleCheckboxClick("supplementationRequest")}
          checked={
            this.props.evaluations.evaluationFilters.supplementationRequest
          }
          type="checkbox"
          className="evaluation__input"
        />
        <label>Täydennyspyynnön saaneet</label>
      </div>,
      <div className="checkbox__item">
        <input
          onChange={this.handleCheckboxClick("notEvaluated")}
          checked={this.props.evaluations.evaluationFilters.notEvaluated}
          type="checkbox"
          className="evaluation__input"
        />
        <label>Arvioimattomat</label>
      </div>,
    ];

    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolsContainer>
            <SearchFormElement
              updateField={this.handleSearchFormElementChange}
              name="guider-search"
              id="searchUsers"
              placeholder="Vapaa haku"
              value={this.props.evaluations.evaluationSearch}
            />
            {this.props.evaluations.selectedWorkspaceId ? (
              <Dropdown items={checkboxes}>
                <ButtonPill
                  style={{ margin: "0 10px" }}
                  className="search__input__filters"
                  icon="cog"
                />
              </Dropdown>
            ) : null}
          </ApplicationPanelToolsContainer>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { updateEvaluationSearch, setEvaluationFilters },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationToolbar);

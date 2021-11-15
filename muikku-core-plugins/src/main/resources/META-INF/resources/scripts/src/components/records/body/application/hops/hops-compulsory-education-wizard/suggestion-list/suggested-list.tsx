import * as React from "react";
import {
  Course,
  StudentActivityCourse,
} from "../../../../../../../@types/shared";
import AnimateHeight from "react-animate-height";
import { useSuggestionList } from "./hooks/useSuggestedList";
import { StateType } from "../../../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { GuiderType } from "../../../../../../../reducers/main-function/guider/index";
import { i18nType } from "../../../../../../../reducers/base/i18n";

interface SuggestionListProps {
  subjectCode: string;
  suggestedActivityCourses?: StudentActivityCourse[];
  course: Course;
  i18n: i18nType;
  guider: GuiderType;
  loadData?: boolean;
  onLoad?: () => void;
  updateSuggestion: (
    goal: "add" | "remove",
    courseNumber: number,
    subjectCode: string,
    suggestionId: number,
    studentId: string
  ) => void;
}

const defaultSuggestionListProps = {
  loadData: true,
};

const SuggestionList = (props: SuggestionListProps) => {
  props = { ...defaultSuggestionListProps, ...props };

  const { isLoading, suggestionsList } = useSuggestionList(
    props.subjectCode,
    props.course,
    props.loadData
  );

  React.useEffect(() => {
    if (!isLoading && props.onLoad) {
      props.onLoad();
    }
  }, [isLoading]);

  /**
   * handleSuggestOptionalClick
   */
  const handleSuggestOptionalClick = () => {
    console.log("handleSuggestOptionalClick");
  };

  /**
   * list of suggestion items
   */
  const listItems =
    suggestionsList.length > 0 ? (
      suggestionsList.map((suggestion) => {
        let isSuggested = false;
        let isSuggestedToHops = false;
        if (
          props.suggestedActivityCourses &&
          props.suggestedActivityCourses.findIndex(
            (item) => item.courseId === suggestion.id
          ) !== -1
        ) {
          isSuggested = true;
        }

        return (
          <div
            key={suggestion.id}
            style={{ display: "flex", flexFlow: "column", margin: "5px 0px" }}
          >
            {isLoading ? (
              <div className="loader-empty" />
            ) : (
              <>
                <div style={{ display: "flex", flexFlow: "row" }}>
                  <h6>{suggestion.name}</h6>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "1rem" }}>Ehdota:</p>
                  <button
                    style={{ margin: "5px 5px", cursor: "pointer", zIndex: 40 }}
                    onClick={() =>
                      props.updateSuggestion(
                        isSuggested ? "remove" : "add",
                        props.course.courseNumber,
                        props.subjectCode,
                        suggestion.id,
                        props.guider.currentStudent.basic.id
                      )
                    }
                  >
                    {isSuggested ? "Ehdotettu" : "Seuraavaksi?"}
                  </button>
                  {!props.course.mandatory ? (
                    <button
                      style={{
                        margin: "5px 5px",
                        cursor: "pointer",
                        zIndex: 40,
                      }}
                      onClick={() =>
                        props.updateSuggestion(
                          isSuggested ? "remove" : "add",
                          props.course.courseNumber,
                          props.subjectCode,
                          suggestion.id,
                          props.guider.currentStudent.basic.id
                        )
                      }
                    >
                      Valinnaiseksi?
                    </button>
                  ) : null}
                </div>{" "}
              </>
            )}
          </div>
        );
      })
    ) : (
      <div style={{ display: "flex", flexFlow: "column", margin: "5px 0px" }}>
        <div style={{ display: "flex", flexFlow: "row" }}>
          <h6> Ei kursseja. Tarkista kurssitarjonta!</h6>
        </div>
      </div>
    );

  return (
    <AnimateHeight height="auto">
      {isLoading ? <div className="loader-empty" /> : listItems}
    </AnimateHeight>
  );
};

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionList);

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
import { UpdateSuggestionParams } from "./handlers/handlers";

/**
 * SuggestionListProps
 */
interface SuggestionListProps {
  subjectCode: string;
  suggestedActivityCourses?: StudentActivityCourse[];
  course: Course;
  i18n: i18nType;
  guider: GuiderType;
  loadData?: boolean;
  onLoad?: () => void;
  updateSuggestion: (params: UpdateSuggestionParams) => void;
}

/**
 * defaultSuggestionListProps
 */
const defaultSuggestionListProps = {
  loadData: true,
};

/**
 * SuggestionList
 * @param props
 * @returns JSX.Element
 */
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
        if (props.suggestedActivityCourses) {
          const suggestedCourse = props.suggestedActivityCourses.find(
            (item) => item.courseId === suggestion.id
          );

          if (suggestedCourse && suggestedCourse.status === "SUGGESTED_NEXT") {
            isSuggested = true;
          } else if (
            suggestedCourse &&
            suggestedCourse.status === "SUGGESTED_OPTIONAL"
          ) {
            isSuggestedToHops = true;
          }
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
                      props.updateSuggestion({
                        goal: isSuggested ? "remove" : "add",
                        courseNumber: props.course.courseNumber,
                        subjectCode: props.subjectCode,
                        suggestionId: suggestion.id,
                        studentId: props.guider.currentStudent.basic.id,
                        type: "NEXT",
                      })
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
                        props.updateSuggestion({
                          goal: isSuggestedToHops ? "remove" : "add",
                          courseNumber: props.course.courseNumber,
                          subjectCode: props.subjectCode,
                          suggestionId: suggestion.id,
                          studentId: props.guider.currentStudent.basic.id,
                          type: "OPTIONAL",
                        })
                      }
                    >
                      {isSuggestedToHops ? "Ehdotettu" : "Valinnaiseksi?"}
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

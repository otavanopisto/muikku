import * as React from "react";
import { Course, Suggestion } from "../../../../../../../@types/shared";
import Button from "~/components/general/button";
import AnimateHeight from "react-animate-height";
import { useSuggestionList } from "./hooks/useSuggestedList";
import { StateType } from "../../../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { GuiderType } from "../../../../../../../reducers/main-function/guider/index";
import { i18nType } from "../../../../../../../reducers/base/i18n";
import mApi from "~/lib/mApi";
import promisify from "../../../../../../../util/promisify";

interface SuggestionListProps {
  subjectCode: string;
  course: Course;
  i18n: i18nType;
  guider: GuiderType;
  onLoad?: () => void;
}

const SuggestionList = (props: SuggestionListProps) => {
  const { suggestionsList, isLoading } = useSuggestionList(
    props.subjectCode,
    props.course
  );

  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && props.onLoad) {
      props.onLoad();
    }
  }, [isLoading]);

  const handleSuggestNextClick =
    (suggestion: Suggestion) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSaving(true);

      try {
        setTimeout(async () => {
          const jotain = await promisify(
            mApi().hops.student.toggleSuggestion.create(
              props.guider.currentStudent.basic.id,
              {
                id: suggestion.id,
                subject: props.subjectCode,
                courseNumber: props.course.courseNumber,
              }
            ),
            "callback"
          )();

          console.log(jotain);
        }, 2000);
      } catch (error) {
        console.error(error);
      }

      setSaving(false);

      console.log("handleSuggestNextClick");
    };

  const handleSuggestOptionalClick = () => {
    console.log("handleSuggestOptionalClick");
  };

  const listItems =
    suggestionsList.length > 0 ? (
      suggestionsList.map((suggestion) => (
        <div
          key={suggestion.id}
          style={{ display: "flex", flexFlow: "column", margin: "5px 0px" }}
        >
          {saving ? (
            <div className="empty-loader" />
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
                  onClick={handleSuggestNextClick(suggestion)}
                >
                  Seuraavaksi?
                </button>
                {!props.course.mandatory ? (
                  <button
                    style={{ margin: "5px 5px", cursor: "pointer", zIndex: 40 }}
                    onClick={handleSuggestOptionalClick}
                  >
                    Valinnaiseksi?
                  </button>
                ) : null}
              </div>{" "}
            </>
          )}
        </div>
      ))
    ) : (
      <div style={{ display: "flex", flexFlow: "column", margin: "5px 0px" }}>
        <div style={{ display: "flex", flexFlow: "row" }}>
          <h6> Ei kursseja. Tarkista kurssitarjonta!</h6>
        </div>
      </div>
    );

  return (
    <>
      <AnimateHeight height={isLoading ? "auto" : 0}>
        <div className="loader-empty" />
      </AnimateHeight>
      <AnimateHeight height={isLoading ? 0 : "auto"}>{listItems}</AnimateHeight>
    </>
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

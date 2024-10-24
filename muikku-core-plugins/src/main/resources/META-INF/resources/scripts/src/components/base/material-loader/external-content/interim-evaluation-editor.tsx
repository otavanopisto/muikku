import * as React from "react";
import equals = require("deep-equal");
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import $ from "~/lib/jquery";
import {
  UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger,
  updateCurrentWorkspaceInterimEvaluationRequests,
} from "../../../../actions/workspaces/index";
import { characterCount, wordCount } from "~/helper-functions/materials";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { InterimEvaluationRequest } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/* eslint-disable camelcase */
const ckEditorConfig = {
  autoGrow_onStartup: true,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents' html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "Strike", "RemoveFormat"],
    },
    { name: "clipboard", items: ["Cut", "Copy", "Paste", "Undo", "Redo"] },
    { name: "links", items: ["Link"] },
    {
      name: "insert",
      items: ["Image", "Table", "Muikku-mathjax", "Smiley", "SpecialChar"],
    },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "styles", items: ["Format"] },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "Outdent",
        "Indent",
        "Blockquote",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
      ],
    },
    { name: "tools", items: ["Maximize"] },
  ],
  removePlugins: "image,exportpdf",
  extraPlugins: "image2,widget,lineutils,autogrow,muikku-mathjax,divarea",
  resize_enabled: true,
};

/**
 * InterimEvaluationEditorProps
 */
interface InterimEvaluationEditorProps
  extends MaterialLoaderProps,
    WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateConfiguration: any;
  updateCurrentWorkspaceInterimEvaluationRequests: UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * InterimEvaluationEditorState
 */
interface InterimEvaluationEditorState {
  loading: boolean;
  requestData: InterimEvaluationRequest;
  value: string;
  words: number;
  characters: number;
}

/**
 * InterimEvaluationEditor
 */
class InterimEvaluationEditor extends React.Component<
  InterimEvaluationEditorProps,
  InterimEvaluationEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: InterimEvaluationEditorProps) {
    super(props);

    const requestData =
      props.workspace.interimEvaluationRequests &&
      props.workspace.interimEvaluationRequests.find(
        (request) =>
          (props.usedAs === "default" &&
            request.workspaceMaterialId ===
              this.props.material.workspaceMaterialId) ||
          (props.usedAs === "evaluationTool" &&
            request.workspaceMaterialId === this.props.material.assignment.id)
      );

    const rawText = (requestData && $(requestData.requestText).text()) || "";

    // set the state with the counts
    this.state = {
      loading: false,
      requestData: requestData || null,
      value: (requestData && requestData.requestText) || "",
      words: wordCount(rawText),
      characters: characterCount(rawText),
    };

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
  }

  /**
   * shouldComponentUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   * @returns boolean true if should update
   */
  shouldComponentUpdate(
    nextProps: InterimEvaluationEditorProps,
    nextState: InterimEvaluationEditorState
  ) {
    return (
      !equals(this.props.workspace, nextProps.workspace) ||
      this.props.readOnly !== nextProps.readOnly ||
      !equals(nextState, this.state) ||
      (this.props.usedAs === "default" &&
        nextProps.stateConfiguration &&
        !equals(nextProps.stateConfiguration, this.props.stateConfiguration))
    );
  }

  /**
   * onCKEditorChange - this one is for a ckeditor change
   * @param value value
   */
  onCKEditorChange(value: string) {
    // we need the raw text
    const rawText = $(value).text();
    // and update the state
    this.setState({
      value,
      words: wordCount(rawText),
      characters: characterCount(rawText),
    });
  }

  /**
   * handlePushInterimRequest
   */
  handlePushInterimRequest = async () => {
    const evaluationApi = MApi.getEvaluationApi();
    const { t } = this.props;

    // If there is no request data, we need to create a new one
    // otherwise delete existing one
    if (this.props.stateConfiguration.state === "SUBMITTED") {
      try {
        const requestData = await evaluationApi.deleteInterimEvaluationRequest({
          interimEvaluationRequestId: this.state.requestData.id,
        });

        this.props.displayNotification(
          t("notifications.cancelSuccess", {
            ns: "workspace",
            context: "interimEvaluationRequests",
          }),
          "success"
        );

        this.setState(
          {
            requestData,
          },
          () => {
            this.props.updateCurrentWorkspaceInterimEvaluationRequests({
              requestData,
            });
            this.props.onPushAnswer && this.props.onPushAnswer();
          }
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        this.props.displayNotification(
          t("notifications.cancelError", {
            ns: "workspace",
            context: "interimEvaluationRequests",
          }),
          "error"
        );
      }
    } else {
      try {
        const requestData = await evaluationApi.createInterimEvaluationRequest({
          createInterimEvaluationRequestRequest: {
            workspaceMaterialId: this.props.material.workspaceMaterialId,
            requestText: this.state.value,
          },
        });

        this.props.displayNotification(
          t("notifications.sendSuccess", {
            ns: "workspace",
            context: "interimEvaluationRequests",
          }),
          "success"
        );

        this.setState(
          {
            requestData,
          },
          () => {
            this.props.updateCurrentWorkspaceInterimEvaluationRequests({
              requestData,
            });
            this.props.onPushAnswer && this.props.onPushAnswer();
          }
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        this.props.displayNotification(
          t("notifications.sendError_interimEvaluationRequests", {
            ns: "workspace",
          }),
          "error"
        );
      }
    }
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    let creatingInterimEvaluationRequestBlocked = false;

    const isSubmitted =
      this.props.stateConfiguration &&
      this.props.stateConfiguration.state === "SUBMITTED";
    const isEvaluated =
      this.props.stateConfiguration &&
      this.props.stateConfiguration.state === "PASSED";

    if (this.props.workspace && this.props.workspace.activity) {
      creatingInterimEvaluationRequestBlocked =
        this.props.workspace.activity.assessmentStates.find((a) =>
          ["pending", "pending_pass", "pending_fail"].includes(a.state)
        ) !== undefined;
    }

    let field = (
      <CKEditor configuration={ckEditorConfig} onChange={this.onCKEditorChange}>
        {this.state.value}
      </CKEditor>
    );

    if (
      isSubmitted ||
      isEvaluated ||
      this.props.readOnly ||
      creatingInterimEvaluationRequestBlocked
    ) {
      field = (
        <span
          className="material-page__ckeditor-replacement material-page__ckeditor-replacement--readonly"
          dangerouslySetInnerHTML={{ __html: this.state.value }}
        />
      );
    }

    const buttons = this.props.stateConfiguration ? (
      <div className="material-page__buttonset">
        {!this.props.stateConfiguration["button-disabled"] ? (
          <Button
            disabled={this.state.loading}
            buttonModifiers={this.props.stateConfiguration["button-class"]}
            onClick={this.handlePushInterimRequest}
          >
            {t(this.props.stateConfiguration["button-text"], {
              ns: "workspace",
            })}
          </Button>
        ) : null}
        {this.props.stateConfiguration[
          "displays-hide-show-answers-on-request-button-if-allowed"
        ] && this.props.material.correctAnswers === "ON_REQUEST" ? (
          <Button
            disabled={this.state.loading}
            buttonModifiers="muikku-show-correct-answers-button"
            onClick={this.props.onToggleAnswersVisible}
          >
            {this.props.answersVisible
              ? t("actions.hide", { ns: "materials" })
              : t("actions.show", { ns: "materials" })}
          </Button>
        ) : null}
      </div>
    ) : null;

    return (
      <>
        <div className="material-page__content rich-text">
          <span className="material-page__interim-evaluation-field-label">
            {t("labels.teacherMessage", { ns: "materials" })}
          </span>
          <span className={`material-page__interim-evaluation-wrapper`}>
            {field}
          </span>
        </div>

        {creatingInterimEvaluationRequestBlocked && !isEvaluated ? (
          <div className="material-page__content-disclaimer rich-text">
            {t("content.interimEvaluationDisclaimer", { ns: "materials" })}
          </div>
        ) : (
          !this.props.readOnly && buttons
        )}
      </>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { updateCurrentWorkspaceInterimEvaluationRequests, displayNotification },
    dispatch
  );
}

export default withTranslation(["workspace", "materials", "common"])(
  connect(null, mapDispatchToProps)(InterimEvaluationEditor)
);

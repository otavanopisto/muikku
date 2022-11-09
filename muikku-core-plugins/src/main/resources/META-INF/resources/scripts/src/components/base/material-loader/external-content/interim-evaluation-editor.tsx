import * as React from "react";
import equals = require("deep-equal");
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import $ from "~/lib/jquery";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { WorkspaceInterimEvaluationRequest } from "~/reducers/workspaces";
import promisify from "~/util/promisify";
import {
  UpdateCurrentWorkspaceInterimEvaluationRequestsTrigger,
  updateCurrentWorkspaceInterimEvaluationRequests,
} from "../../../../actions/workspaces/index";
import { characterCount, wordCount } from "~/helper-functions/materials";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";

/* eslint-disable camelcase */
const ckEditorConfig = {
  autoGrow_onStartup: true,
  mathJaxLib:
    "//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML",
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
interface InterimEvaluationEditorProps extends MaterialLoaderProps {
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
  requestData: WorkspaceInterimEvaluationRequest;
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
        (request: WorkspaceInterimEvaluationRequest) =>
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
    // If there is no request data, we need to create a new one
    // otherwise delete existing one
    if (this.props.stateConfiguration.state === "SUBMITTED") {
      try {
        const requestData = (await promisify(
          mApi().evaluation.interimEvaluationRequest.del(
            this.state.requestData.id
          ),
          "callback"
        )()) as WorkspaceInterimEvaluationRequest;

        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.materialsLoader.cancelInterimEvaluationRequest.success"
          ),
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
      } catch (error) {
        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.materialsLoader.cancelInterimEvaluationRequest.error"
          ),
          "error"
        );
      }
    } else {
      try {
        const requestData = (await promisify(
          mApi().evaluation.interimEvaluationRequest.create({
            workspaceMaterialId: this.props.material.workspaceMaterialId,
            requestText: this.state.value,
          }),
          "callback"
        )()) as WorkspaceInterimEvaluationRequest;

        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.materialsLoader.submitInterimEvaluationRequest.success"
          ),
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
      } catch (error) {
        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.materialsLoader.submitInterimEvaluationRequest.error"
          ),
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
    let field = (
      <CKEditor configuration={ckEditorConfig} onChange={this.onCKEditorChange}>
        {this.state.value}
      </CKEditor>
    );

    if (
      (this.props.stateConfiguration &&
        (this.props.stateConfiguration.state === "SUBMITTED" ||
          this.props.stateConfiguration.state === "PASSED")) ||
      this.props.readOnly
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
            {this.props.i18n.text.get(
              this.props.stateConfiguration["button-text"]
            )}
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
            {this.props.i18n.text.get(
              this.props.answersVisible
                ? "plugin.workspace.materialsLoader.hideAnswers"
                : "plugin.workspace.materialsLoader.showAnswers"
            )}
          </Button>
        ) : null}
      </div>
    ) : null;

    return (
      <>
        <div className="material-page__content rich-text">
          <span className={`material-page__interim-evaluation-wrapper`}>
            {field}
          </span>
        </div>
        {!this.props.readOnly && buttons}
      </>
    );
  }
}

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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateCurrentWorkspaceInterimEvaluationRequests, displayNotification },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterimEvaluationEditor);

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useTranslation } from "react-i18next";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { ButtonPill } from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import Dropdown from "~/components/general/dropdown";
import LicenseSelector from "~/components/general/license-selector";
import Link from "~/components/general/link";
import {
  Language,
  MaterialAI,
  MaterialAnswersType,
  MaterialAssigmentType,
  MaterialViewRestriction,
} from "~/generated/client";
import { StateType } from "~/reducers";
import { languageOptions } from "~/reducers/workspaces";
import {
  answersType,
  CKEditorConfig,
  MaterialAnswersTypeConfig,
  MATERIAL_ANSWERS_TYPE_CONFIGS,
} from "./helpers";
import DeleteWorkspaceMaterialDialog from "../material-editor/delete-dialog";
import { EditorPermissions } from "./editor-strategy";
import {
  assignmentPageType,
  MaterialPageTypeConfig,
  MaterialRestrictTypeConfig,
  materialSectionOrPageChanges,
  MATERIAL_PAGE_TYPE_CONFIGS,
  MATERIAL_RESTRICT_TYPE_CONFIGS,
  restrictType,
} from "./helpers";
import AddProducer from "~/components/general/add-producer";
import FileUploader from "~/components/general/file-uploader";
import {
  createWorkspaceMaterialAttachment,
  requestWorkspaceMaterialContentNodeAttachments,
  setWorkspaceMaterialEditorState,
  updateWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";
import { PageLocation, UploadingValue } from "~/@types/shared";
import ConfirmRemoveAttachment from "../material-editor/confirm-remove-attachment";
import useExamSettings from "./hooks/useExamSettings";
import { ExamSettingsRandom } from "~/generated/client";
import _ from "lodash";
import Select from "react-select";
import useExamAttendees from "./hooks/useExamAttendees";
import { ExamCategories } from "./exam-categories";

/**
 * Editor tab props
 */
interface EditorTabProps {
  editorPermissions: EditorPermissions;
  examEnabled: boolean;
}

/**
 * Section content tab props
 */
interface SectionContentTabProps extends EditorTabProps {}

/**
 * Simple content tab component for sections
 * @param props - Props for the component
 * @returns Section content tab for the editor
 */
export const SectionContentTab = (props: SectionContentTabProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  /**
   * Handles title change
   * @param e e
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: { title: e.target.value },
        isDraft: true,
      })
    );
  };

  /**
   * Handles title language change
   * @param e e
   */
  const handleTitleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          titleLanguage:
            e.currentTarget.value !== ""
              ? (e.currentTarget.value as Language)
              : null,
        },
        isDraft: true,
      })
    );
  };

  if (!editorState.opened) {
    return null;
  }

  return (
    <div className="material-editor__content-wrapper">
      <EditorButtonSet
        editorPermissions={props.editorPermissions}
        examEnabled={props.examEnabled}
      />

      <div className="form__row">
        <div className="form-element">
          <input
            className="form-element__input form-element__input--material-editor-title"
            placeholder="Section title"
            value={editorState.currentDraftNodeValue.title}
            onChange={handleTitleChange}
          />
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">{t("labels.language")}</h3>
        <div className="form__row">
          <div className="form-element">
            <select
              className="form-element__select form-element__select--material-editor"
              onChange={handleTitleLanguageChange}
              value={editorState.currentDraftNodeValue.titleLanguage || ""}
            >
              <option value="">
                {t("labels.inherited", {
                  ns: "workspace",
                })}
              </option>
              {languageOptions.map((language: string) => (
                <option key={language} value={language}>
                  {t("labels.language", {
                    context: language,
                    ns: "workspace",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Material content tab props
 */
interface MaterialContentTabProps extends EditorTabProps {
  locationPage?: PageLocation;
}

/**
 * Simple content tab component for materials
 * @param props - Props for the component
 * @returns Material content tab for the editor
 */
export const MaterialContentTab = (props: MaterialContentTabProps) => {
  const [height, setHeight] = React.useState(0);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  // Get editor related values from redux
  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );
  const status = useSelector((state: StateType) => state.status);
  const locale = useSelector((state: StateType) => state.locales);

  // Set height of the editor based on the window height
  React.useEffect(() => {
    const heightOffset: number = 40;
    window.addEventListener("resize", () =>
      setHeight(window.innerHeight - heightOffset)
    );

    return () => {
      window.removeEventListener("resize", () =>
        setHeight(window.innerHeight - heightOffset)
      );
    };
  }, []);

  /**
   * Handles title change
   * @param e e
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: { title: e.target.value },
        isDraft: true,
      })
    );
  };

  /**
   * Handles title language change
   * @param e e
   */
  const handleTitleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          titleLanguage:
            e.currentTarget.value !== ""
              ? (e.currentTarget.value as Language)
              : null,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles page content change
   * @param content content
   */
  const handlePageContentChange = (content: string) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: { html: content },
        isDraft: true,
      })
    );
  };

  /**
   * Refreshes attachments
   */
  const refreshAttachments = () => {
    if (editorState.currentNodeValue && editorState.currentNodeWorkspace) {
      setTimeout(() => {
        dispatch(
          requestWorkspaceMaterialContentNodeAttachments(
            editorState.currentNodeWorkspace,
            editorState.currentNodeValue
          )
        );
      }, 3000);
    }
  };

  if (!editorState.opened) {
    return null;
  }

  return (
    <div className="material-editor__content-wrapper">
      <EditorButtonSet
        editorPermissions={props.editorPermissions}
        examEnabled={props.examEnabled}
      />

      {editorState.canSetTitle && (
        <div className="form__row">
          <div className="form-element">
            <input
              className="form-element__input form-element__input--material-editor-title"
              value={editorState.currentDraftNodeValue.title}
              onChange={handleTitleChange}
            />
          </div>
        </div>
      )}

      {props?.locationPage === "Home" && (
        <div className="material-editor__sub-section">
          <h3 className="material-editor__sub-title">{t("labels.language")}</h3>
          <div className="form__row">
            <div className="form-element">
              <select
                className="form-element__select form-element__select--material-editor"
                onChange={handleTitleLanguageChange}
                value={editorState.currentDraftNodeValue.titleLanguage || ""}
              >
                <option value="">
                  {t("labels.inherited", {
                    ns: "workspace",
                  })}
                </option>
                {languageOptions.map((language: string) => (
                  <option key={language} value={language}>
                    {t("labels.language", {
                      context: language,
                      ns: "workspace",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div
        id="materialEditorContainer"
        className="material-editor__editor-container"
      >
        <CKEditor
          ancestorHeight={height}
          configuration={CKEditorConfig(
            locale.current,
            status.contextPath,
            editorState.currentNodeWorkspace,
            editorState.currentDraftNodeValue,
            editorState.disablePlugins
          )}
          onChange={handlePageContentChange}
          onDrop={refreshAttachments}
        >
          {editorState.currentDraftNodeValue?.html || ""}
        </CKEditor>
      </div>
    </div>
  );
};

/**
 * Exam settings tab props
 */
interface ExamSettingsTabProps extends EditorTabProps {}

/**
 * Simple exam settings tab component
 * @param props - Props for the component
 * @returns Exam settings tab for the editor
 */
export const ExamSettingsTab = (props: ExamSettingsTabProps) => {
  const { t } = useTranslation();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const {
    loading,
    examSettings,
    updatedExamSettings,
    handleSave,
    handleCancel,
    handleExamSettingsChange,
  } = useExamSettings();

  if (!editorState.opened) {
    return null;
  }

  const canSave = !_.isEqual(examSettings, updatedExamSettings);

  const publishModifiers = ["material-editor-publish-page", "material-editor"];
  const revertModifiers = ["material-editor-revert-page", "material-editor"];

  if (!canSave || loading) {
    publishModifiers.push("disabled");
    revertModifiers.push("disabled");
  }

  return (
    <div className="material-editor__content-wrapper">
      <div className="material-editor__buttonset">
        <div className="material-editor__buttonset-primary"></div>
        <div className="material-editor__buttonset-secondary">
          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("labels.save", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers={publishModifiers}
              onClick={handleSave}
              icon="leanpub"
            />
          </Dropdown>

          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("actions.cancel", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers={revertModifiers}
              onClick={handleCancel}
              icon="undo"
            />
          </Dropdown>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Kuvaus</h3>
        <div className="form__row">
          <div className="form-element">
            <CKEditor
              onChange={(content) =>
                handleExamSettingsChange("description", content)
              }
            >
              {updatedExamSettings?.description || ""}
            </CKEditor>
          </div>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Tehtävien satunnaisuus</h3>
        <div className="form__row">
          <div className="form-element">
            <select
              className="form-element__select form-element__select--material-editor"
              disabled={loading}
              value={updatedExamSettings?.random || ExamSettingsRandom.None}
              onChange={(e) =>
                handleExamSettingsChange(
                  "random",
                  e.target.value as ExamSettingsRandom
                )
              }
            >
              <option value={ExamSettingsRandom.None}>Ei satunnaisuutta</option>
              <option value={ExamSettingsRandom.Global}>
                Koko kokeen satunnaisuus
              </option>
              <option value={ExamSettingsRandom.Category}>
                Kategoria-perusteinen satunnaisuus
              </option>
            </select>
          </div>
        </div>
      </div>

      {updatedExamSettings?.random === ExamSettingsRandom.Global && (
        <div className="material-editor__sub-section">
          <h3 className="material-editor__sub-title">
            Satunnaisten tehtävien määrä:
          </h3>

          <div className="form__row">
            <div className="form-element">
              <NumericFormat
                id="duration"
                className="form-element__input form-element__input--material-editor"
                value={updatedExamSettings?.randomCount || 0}
                min={1}
                disabled={loading}
                decimalScale={0}
                onValueChange={(values) =>
                  handleExamSettingsChange("randomCount", values.floatValue)
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Kesto (minuutteina):</h3>

        <div className="form__row">
          <div className="form-element">
            <NumericFormat
              id="duration"
              className="form-element__input form-element__input--material-editor"
              value={updatedExamSettings?.minutes || 0}
              min={1}
              disabled={loading}
              decimalScale={0}
              onValueChange={(values) =>
                handleExamSettingsChange("minutes", values.floatValue)
              }
            />
          </div>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Salli useat yritykset</h3>
        <div className="form__row">
          <div className="form-element">
            <select
              className="form-element__select form-element__select--material-editor"
              disabled={loading}
              value={updatedExamSettings?.allowMultipleAttempts ? "YES" : "NO"}
              onChange={(e) =>
                handleExamSettingsChange(
                  "allowMultipleAttempts",
                  e.target.value === "YES"
                )
              }
            >
              <option value="YES">Kyllä</option>
              <option value="NO">Ei</option>
            </select>
          </div>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Avoin kaikille</h3>
        <div className="form__row">
          <div className="form-element">
            <select
              className="form-element__select form-element__select--material-editor"
              disabled={loading}
              value={updatedExamSettings?.openForAll ? "YES" : "NO"}
              onChange={(e) =>
                handleExamSettingsChange("openForAll", e.target.value === "YES")
              }
            >
              <option value="YES">Kyllä</option>
              <option value="NO">Ei</option>
            </select>
          </div>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Kokeen kategoriat</h3>

        <ExamCategories
          categories={updatedExamSettings?.categories || []}
          onUpdate={(categories) =>
            handleExamSettingsChange("categories", categories)
          }
          disabled={loading}
        />
      </div>
    </div>
  );
};

/**
 * Exam attendees tab props
 */
interface ExamAttendeesTabProps extends EditorTabProps {}

/**
 * Simple exam attendees tab component
 * @param props - Props for the component
 * @returns Exam attendees tab for the editor
 */
export const ExamAttendeesTab = (props: ExamAttendeesTabProps) => {
  const { t } = useTranslation();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const {
    loading,
    studentOptions,
    selectedStudentOptions,
    hasChanges,
    handleExamAttendeeChange,
    handleSave,
    handleRevert,
  } = useExamAttendees();

  const canSave = hasChanges;

  const publishModifiers = ["material-editor-publish-page", "material-editor"];
  const revertModifiers = ["material-editor-revert-page", "material-editor"];

  if (!canSave || loading) {
    publishModifiers.push("disabled");
    revertModifiers.push("disabled");
  }

  if (!editorState.opened) {
    return null;
  }

  return (
    <div className="material-editor__content-wrapper">
      <div className="material-editor__buttonset">
        <div className="material-editor__buttonset-primary"></div>
        <div className="material-editor__buttonset-secondary">
          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("labels.save", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers={publishModifiers}
              onClick={handleSave}
              icon="leanpub"
            />
          </Dropdown>

          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("actions.cancel", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers={revertModifiers}
              onClick={handleRevert}
              icon="undo"
            />
          </Dropdown>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">Kokeen osallistujat</h3>
        <Select
          id="examAttendees"
          className="react-select-override react-select-override--material-editor"
          classNamePrefix="react-select-override"
          closeMenuOnSelect={false}
          isMulti
          menuPortalTarget={document.body}
          menuPosition={"fixed"}
          // eslint-disable-next-line jsdoc/require-jsdoc
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          value={selectedStudentOptions}
          placeholder={t("labels.select", {
            ns: "common",
          })}
          noOptionsMessage={() =>
            t("content.empty", {
              ns: "pedagogySupportPlan",
              context: "options",
            })
          }
          options={studentOptions}
          onChange={handleExamAttendeeChange}
          isSearchable={true}
          isDisabled={loading}
        />
      </div>
    </div>
  );
};

/**
 * Metadata tab props
 */
interface MetadataTabProps extends EditorTabProps {}

/**
 * Simple metadata tab component for materials
 * @param props - Props for the component
 * @returns Metadata tab for the editor
 */
export const MetadataTab = (props: MetadataTabProps) => {
  const { canSetProducers, canSetLicense } = props.editorPermissions;

  const dispatch = useDispatch();

  // Get editor related values from redux
  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const { t } = useTranslation();

  /**
   * Handles add producer
   * @param name name
   */
  const handleAddProducer = (name: string) => {
    const newProducers = [
      ...(editorState.currentDraftNodeValue.producers || []),
    ];
    newProducers.push({
      id: null,
      name,
      materialId: editorState.currentDraftNodeValue.id,
    });

    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: { producers: newProducers },
        isDraft: true,
      })
    );
  };

  /**
   * Handles remove producer
   * @param index index
   */
  const handleRemoveProducer = (index: number) => {
    const newProducers = [
      ...(editorState.currentDraftNodeValue.producers || []),
    ];
    newProducers.splice(index, 1);

    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          producers: newProducers,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles title language change
   * @param e e
   */
  const handleTitleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          titleLanguage:
            e.currentTarget.value !== ""
              ? (e.currentTarget.value as Language)
              : null,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles license change
   * @param license license
   */
  const handleLicenseChange = (license: string) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          license: license,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles material AI use change
   * @param e e
   */
  const handleMaterialAiUseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          ai:
            e.currentTarget.value !== ""
              ? (e.currentTarget.value as MaterialAI)
              : null,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles max points change
   * @param values values
   */
  const handleMaxPointsChange = (values: NumberFormatValues) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          maxPoints: values.floatValue,
        },
        isDraft: true,
      })
    );
  };

  if (!editorState.opened) {
    return null;
  }

  return (
    <div className="material-editor__content-wrapper">
      <EditorButtonSet
        editorPermissions={props.editorPermissions}
        examEnabled={props.examEnabled}
      />

      {canSetProducers && (
        <div className="material-editor__sub-section">
          <h3 className="material-editor__sub-title">
            {t("labels.producers", { ns: "users" })}
          </h3>

          <div className="material-editor__add-producer-container">
            <AddProducer
              modifier="add-material-producer"
              removeProducer={handleRemoveProducer}
              addProducer={handleAddProducer}
              producers={editorState.currentDraftNodeValue.producers || []}
            />
          </div>
        </div>
      )}

      {canSetLicense && (
        <div className="material-editor__sub-section">
          <h3 className="material-editor__sub-title">
            {t("labels.license", { ns: "workspace" })}
          </h3>
          <LicenseSelector
            wcagLabel="materialLicense"
            wcagDesc={t("wcag.materialLicense", { ns: "workspace" })}
            modifier="material-editor"
            value={editorState.currentDraftNodeValue.license || null}
            onChange={handleLicenseChange}
          />
        </div>
      )}

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">{t("labels.language")}</h3>
        <div className="form__row">
          <div className="form-element">
            <select
              className="form-element__select form-element__select--material-editor"
              onChange={handleTitleLanguageChange}
              value={editorState.currentDraftNodeValue.titleLanguage || ""}
            >
              <option value="">
                {t("labels.inherited", {
                  ns: "workspace",
                })}
              </option>
              {languageOptions.map((language: string) => (
                <option key={language} value={language}>
                  {t("labels.language", {
                    context: language,
                    ns: "workspace",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">
          {t("labels.materialAiUse", { ns: "materials" })}
        </h3>
        <div className="form__row">
          <div className="form-element">
            <select
              className="form-element__select form-element__select--material-editor"
              onChange={handleMaterialAiUseChange}
              value={editorState.currentDraftNodeValue.ai || ""}
            >
              <option value="">
                {t("labels.materialAiNotDefined", {
                  ns: "materials",
                })}
              </option>
              <option value="ALLOWED">
                {t("labels.materialAiAllowed", {
                  ns: "materials",
                })}
              </option>
              <option value="DISALLOWED">
                {t("labels.materialAiDisallowed", {
                  ns: "materials",
                })}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="material-editor__sub-section">
        <h3 className="material-editor__sub-title">
          {t("labels.pointsMax", { ns: "workspace" })}
        </h3>
        <div className="form__row">
          <div className="form-element">
            <NumericFormat
              className="form-element__input form-element__input--material-editor-assignment-points"
              value={editorState.currentDraftNodeValue.maxPoints}
              decimalScale={2}
              decimalSeparator=","
              allowNegative={false}
              onValueChange={handleMaxPointsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Attachments tab props
 */
interface AttachmentsTabProps extends EditorTabProps {}

/**
 * Simple attachments tab component for materials
 * @param props - Props for the component
 * @returns Attachments tab for the editor
 */
export const AttachmentsTab = (props: AttachmentsTabProps) => {
  const [uploadingValues, setUploadingValues] = React.useState<
    UploadingValue[]
  >([]);

  // Get editor related values from redux
  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const dispatch = useDispatch();

  const { t } = useTranslation();

  if (!editorState.opened) {
    return null;
  }

  /**
   * Handles files upload
   * @param e e
   */
  const onFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      createWorkspaceMaterialAttachment(
        {
          workspace: editorState.currentNodeWorkspace,
          material: editorState.currentNodeValue,
          files: Array.from(e.target.files),
          uploadingValues: [...uploadingValues].concat(
            Array.from(e.target.files).map((file) => ({
              name: file.name,
              contentType: file.type,
              progress: 0,
              file,
            }))
          ),
          // eslint-disable-next-line jsdoc/require-jsdoc
          success: () => {
            setUploadingValues([]);
          },
          // eslint-disable-next-line jsdoc/require-jsdoc
          fail: () => {
            setUploadingValues([]);
          },
        },
        (updatedValues: UploadingValue[]) => {
          setUploadingValues(updatedValues);
        }
      )
    );
  };

  return (
    <div className="material-editor__content-wrapper">
      <EditorButtonSet
        editorPermissions={props.editorPermissions}
        examEnabled={props.examEnabled}
      />

      <FileUploader
        uploadingValues={uploadingValues}
        onFileInputChange={onFilesUpload}
        modifier="material-editor"
        displayNotificationOnError
        fileTooLargeErrorText={t("notifications.sizeTooLarge", {
          ns: "files",
        })}
        files={editorState.currentNodeValue.childrenAttachments}
        fileIdKey="materialId"
        fileNameKey="title"
        fileUrlGenerator={(a) =>
          `/workspace/${editorState.currentNodeWorkspace.urlName}/materials/${a.path}`
        }
        deleteDialogElement={ConfirmRemoveAttachment}
        hintText={t("content.add", { ns: "materials", context: "file" })}
        deleteFileText={t("actions.remove")}
        downloadFileText={t("actions.download")}
        notificationOfSuccessText={t("notifications.uploadSuccess", {
          ns: "files",
        })}
        displayNotificationOnSuccess
        uploadingTextProcesser={(percent: number) =>
          t("content.statusUploading", {
            ns: "materials",
            progress: percent,
          })
        }
      />
    </div>
  );
};

/**
 * Editor button set
 */
interface EditorButtonSetProps extends EditorTabProps {}

/**
 * Editor button set component
 * @param props - Props for the component
 * @returns Editor button set for the editor
 */
export const EditorButtonSet = (props: EditorButtonSetProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  //const { editorPermissions, examEnabled } = props;

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  // Check if the section or page has changed
  const canPublish = React.useMemo(() => {
    if (!editorState.currentNodeValue || !editorState.currentDraftNodeValue) {
      return false;
    }

    return materialSectionOrPageChanges(
      editorState.currentNodeValue,
      editorState.currentDraftNodeValue
    );
  }, [editorState.currentNodeValue, editorState.currentDraftNodeValue]);

  // Check if the section or page is hidden
  const isHidden =
    editorState.currentDraftNodeValue?.hidden ||
    (editorState.parentNodeValue && editorState.parentNodeValue?.hidden);

  // Hide/Show button modifiers
  const hideShowButtonModifiers = [
    "material-editor-show-hide-page",
    "material-editor",
  ];

  if (isHidden) {
    hideShowButtonModifiers.push("material-editor-disabled");
  } else {
    hideShowButtonModifiers.push("material-editor-enabled");
  }

  // Assignment page type
  const materialPageType = assignmentPageType(
    editorState.currentDraftNodeValue?.assignmentType
  );

  const assignmentPageTypeClassName = "material-editor-" + materialPageType;

  // Restrict type
  const restrictTypeValue = restrictType(
    editorState.currentDraftNodeValue?.viewRestrict
  );

  const restrictTypeClassName = "material-editor-" + restrictTypeValue;

  // Answers type
  const answersTypeValue = answersType(
    editorState.currentDraftNodeValue?.correctAnswers
  );

  const publishModifiers = ["material-editor-publish-page", "material-editor"];
  const revertModifiers = ["material-editor-revert-page", "material-editor"];
  if (!canPublish) {
    publishModifiers.push("disabled");
    revertModifiers.push("disabled");
  }

  /**
   * handleToggleHiddenStatus
   */
  const handleToggleHiddenStatus = () => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          hidden: !editorState.currentDraftNodeValue.hidden,
        },
        isDraft: true,
      })
    );
  };

  /**
   * handleCycleCorrectAnswers
   */
  const handleCycleCorrectAnswers = () => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          correctAnswers:
            !editorState.currentDraftNodeValue.correctAnswers ||
            editorState.currentDraftNodeValue.correctAnswers === "ALWAYS"
              ? "ON_REQUEST"
              : editorState.currentDraftNodeValue.correctAnswers ===
                  "ON_REQUEST"
                ? "NEVER"
                : "ALWAYS",
        },
        isDraft: true,
      })
    );
  };

  /**
   * handlePublish
   */
  const handlePublish = () => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentNodeValue,
        update: editorState.currentDraftNodeValue,
      })
    );
  };

  /**
   * handleRevert
   */
  const handleRevert = () => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: editorState.currentNodeValue,
        isDraft: true,
      })
    );
  };

  /**
   * handleClose
   */
  const handleClose = () => {
    dispatch(
      setWorkspaceMaterialEditorState({
        ...editorState,
        opened: false,
      })
    );
  };

  /**
   * createRestrictTypeComponent
   * @param config config
   * @param index index
   * @param onClose onClose
   * @returns createRestrictTypeComponent
   */
  const createRestrictTypeComponent = (
    config: MaterialRestrictTypeConfig,
    index: number,
    onClose: () => void
  ) => (
    <RestrictTypeButton
      key={`restrict-type-button-${index}`}
      materialRestrictConfig={config}
      onClose={onClose}
    />
  );

  /**
   * createAssignmentPageComponent
   * @param config config
   * @param index index
   * @param onClose onClose
   * @returns createAssignmentPageComponent
   */
  const createAssignmentPageComponent = (
    config: MaterialPageTypeConfig,
    index: number,
    onClose: () => void
  ) => (
    <AssignmentPageButton
      key={`assignment-page-button-${index}`}
      materialPageConfig={config}
      onClose={onClose}
    />
  );

  /**
   * createMaterialAnswersTypeComponent
   * @param config config
   * @param onClose onClose
   * @returns createMaterialAnswersTypeComponent
   */
  const createMaterialAnswersTypeComponent = (
    config: MaterialAnswersTypeConfig,
    onClose: () => void
  ) => (
    <MaterialAnswersTypeButton
      materialAnswersTypeConfig={config}
      onClose={onClose}
    />
  );

  return (
    <div className="material-editor__buttonset">
      <div className="material-editor__buttonset-primary">
        {editorState.canHide &&
        (!editorState.parentNodeValue ||
          !editorState.parentNodeValue.hidden) ? (
          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={
              isHidden
                ? t("labels.setVisible", { ns: "materials" })
                : t("labels.hide", { ns: "materials" })
            }
          >
            <ButtonPill
              buttonModifiers={hideShowButtonModifiers}
              onClick={handleToggleHiddenStatus}
              icon="eye"
            />
          </Dropdown>
        ) : null}
        {editorState.canRestrictView ? (
          <Dropdown
            openByHover={false}
            modifier="material-editor-restriction-type"
            persistent
            items={MATERIAL_RESTRICT_TYPE_CONFIGS.map(
              (config, index) => (closeDropdown: () => void) =>
                createRestrictTypeComponent(config, index, closeDropdown)
            )}
          >
            <ButtonPill
              buttonModifiers={[
                "material-editor-restrict-page",
                "material-editor",
                restrictTypeClassName,
              ]}
              icon="restriction"
            />
          </Dropdown>
        ) : null}
        {editorState.canChangePageType ? (
          <Dropdown
            modifier="material-editor-page-type"
            openByHover={false}
            persistent
            items={MATERIAL_PAGE_TYPE_CONFIGS.map(
              (config, index) => (closeDropdown: () => void) =>
                createAssignmentPageComponent(config, index, closeDropdown)
            )}
          >
            <ButtonPill
              buttonModifiers={[
                "material-editor-change-page-type",
                "material-editor",
                assignmentPageTypeClassName,
              ]}
              icon="puzzle"
            />
          </Dropdown>
        ) : null}

        {editorState.canChangeExerciseType &&
        editorState.currentDraftNodeValue?.assignmentType === "EXERCISE" ? (
          <Dropdown
            modifier="material-editor-answers-type"
            openByHover={false}
            items={MATERIAL_ANSWERS_TYPE_CONFIGS.map(
              (config) => (closeDropdown: () => void) =>
                createMaterialAnswersTypeComponent(config, closeDropdown)
            )}
          >
            <ButtonPill
              buttonModifiers={[
                "material-editor-change-answer-reveal-type",
                "material-editor",
                "material-editor-" + answersTypeValue,
              ]}
              icon="lightbulb"
              onClick={handleCycleCorrectAnswers}
            />
          </Dropdown>
        ) : null}
      </div>

      <div className="material-editor__buttonset-secondary">
        {editorState.canPublish ? (
          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("labels.publish", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers={publishModifiers}
              onClick={canPublish ? handlePublish : undefined}
              icon="leanpub"
            />
          </Dropdown>
        ) : null}
        {editorState.canRevert ? (
          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("actions.revert", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers={revertModifiers}
              onClick={canPublish ? handleRevert : undefined}
              icon="undo"
            />
          </Dropdown>
        ) : null}
        {editorState.canDelete ? (
          <DeleteWorkspaceMaterialDialog
            isSection={editorState.section}
            material={editorState.currentDraftNodeValue}
            onDeleteSuccess={handleClose}
          >
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={t("labels.remove", { ns: "materials" })}
            >
              <ButtonPill
                buttonModifiers={[
                  "material-editor-delete-page",
                  "material-editor",
                ]}
                icon="trash"
              />
            </Dropdown>
          </DeleteWorkspaceMaterialDialog>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Restrict type button props
 */
interface RestrictTypeButtonProps {
  materialRestrictConfig: MaterialRestrictTypeConfig;
  onClose: () => void;
}

/**
 * renderRestrictTypeButton
 * @param props asd
 * @returns renderRestrictTypeButton
 */
export const RestrictTypeButton = (props: RestrictTypeButtonProps) => {
  const { materialRestrictConfig, onClose } = props;

  const { t } = useTranslation();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const dispatch = useDispatch();

  const { type, classNameMod, text } = materialRestrictConfig;

  const isActive = editorState.currentDraftNodeValue?.viewRestrict === type;

  const restrictTypeClassName = classNameMod ? "link--" + classNameMod : "";

  const activePageTypeClassName = isActive
    ? "link--material-editor-dropdown-active"
    : "";

  /**
   * Handles change restrict type
   * @param type type
   * @param onClose onClose
   */
  const handleChangeRestrictType =
    (type: MaterialViewRestriction, onClose: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      dispatch(
        updateWorkspaceMaterialContentNode({
          workspace: editorState.currentNodeWorkspace,
          material: editorState.currentDraftNodeValue,
          update: { viewRestrict: type },
          isDraft: true,
        })
      );
      onClose();
    };

  return (
    <Link
      className={`link link--full link--material-editor-dropdown ${restrictTypeClassName} ${activePageTypeClassName}`}
      onClick={handleChangeRestrictType(type, onClose)}
    >
      <span className="link__icon icon-restriction"></span>
      <span>
        {t(text, {
          ns: "materials",
        })}
      </span>
    </Link>
  );
};

/**
 * Assignment page button props
 */
interface AssignmentPageButtonProps {
  materialPageConfig: MaterialPageTypeConfig;
  onClose: () => void;
}

/**
 * Assignment page type button
 * @param props props
 * @returns assignment page type button
 */
export const AssignmentPageButton = (props: AssignmentPageButtonProps) => {
  const { materialPageConfig, onClose } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const { assignmentType } = editorState.currentDraftNodeValue;

  const currentAssignmentType = assignmentType || null;

  const isActive = currentAssignmentType === materialPageConfig.type;

  const activePageTypeClassName = isActive
    ? "link--material-editor-dropdown-active"
    : "";

  const pageTypeClassName = materialPageConfig.classNameMod
    ? "link--" + materialPageConfig.classNameMod
    : "";

  /**
   * Handles change assignment type
   * @param type type
   * @param onClose onClose
   */
  const handleChangeAssignmentType =
    (type: MaterialAssigmentType, onClose: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // If the new assignment type is exercise, set the correct answers to always by default
      const correctAnswers = type === "EXERCISE" ? "ALWAYS" : null;

      dispatch(
        updateWorkspaceMaterialContentNode({
          workspace: editorState.currentNodeWorkspace,
          material: editorState.currentDraftNodeValue,
          update: { assignmentType: type, correctAnswers },
          isDraft: true,
        })
      );
      onClose();
    };

  return (
    <Link
      className={`link link--full link--material-editor-dropdown ${pageTypeClassName} ${activePageTypeClassName}`}
      onClick={handleChangeAssignmentType(materialPageConfig.type, onClose)}
    >
      <span className="link__icon icon-puzzle"></span>
      <span>{t(materialPageConfig.text, { ns: "materials" })}</span>
    </Link>
  );
};

/**
 * Material answers type button props
 */
interface MaterialAnswersTypeButtonProps {
  materialAnswersTypeConfig: MaterialAnswersTypeConfig;
  onClose: () => void;
}

/**
 * Material answers type button
 * @param props props
 * @returns Material answers type button
 */
export const MaterialAnswersTypeButton = (
  props: MaterialAnswersTypeButtonProps
) => {
  const { materialAnswersTypeConfig, onClose } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const { correctAnswers } = editorState.currentDraftNodeValue;

  const currentAnswersType = correctAnswers || null;

  const isActive = currentAnswersType === materialAnswersTypeConfig.type;

  const activeAnswersTypeClassName = isActive
    ? "link--material-editor-dropdown-active"
    : "";

  const pageTypeClassName = materialAnswersTypeConfig.classNameMod
    ? "link--" + materialAnswersTypeConfig.classNameMod
    : "";

  /**
   * Handles change assignment type
   * @param type type
   * @param onClose onClose
   */
  const handleChangeAssignmentType =
    (type: MaterialAnswersType, onClose: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      dispatch(
        updateWorkspaceMaterialContentNode({
          workspace: editorState.currentNodeWorkspace,
          material: editorState.currentDraftNodeValue,
          update: { correctAnswers: type },
          isDraft: true,
        })
      );
      onClose();
    };

  return (
    <Link
      className={`link link--full link--material-editor-dropdown ${pageTypeClassName} ${activeAnswersTypeClassName}`}
      onClick={handleChangeAssignmentType(
        materialAnswersTypeConfig.type,
        onClose
      )}
    >
      <span className="link__icon icon-lightbulb"></span>
      <span>{t(materialAnswersTypeConfig.text, { ns: "materials" })}</span>
    </Link>
  );
};

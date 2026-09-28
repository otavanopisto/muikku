import * as React from "react";
import Dialog from "../dialog";
import { SmowlActivityResults } from "./smowl-activity-results";
import { getSmowlApiAccountInfo } from "~/api_smowl/index";
import { isMApiError } from "~/api/api";
import { FetchError, ResponseError } from "~/generated/client";

/**
 * SmowlActivityResultsDialogProps
 */
interface SmowlActivityResultsDialogProps {
  activityId: number;
  activityType: string;
  lang: string;

  /**
   * Loader function that returns a JSON string of activity names, must include student id as key and first name
   * and last name as value e.g.: {"0":"John Doe","1":"Jane Doe","2":"Jim Doe"}
   */
  dataLoader: (activityId: number) => Promise<{
    aNamesJson: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * SmowlActivityResultsDialog
 * @param props SmowlActivityResultsDialogProps
 */
const SmowlActivityResultsDialog = (props: SmowlActivityResultsDialogProps) => {
  const { activityId, activityType, lang, dataLoader, children } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const { loading, smowlApiAccountInfo, aNamesJson } =
    useSmowlActivityResultDialog({
      activityId: activityId,
      dialogOpen: isOpen,
      dataLoader: dataLoader,
    });

  /**
   * content
   * @param closeDialog closeDialog
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = (closeDialog: () => any) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!smowlApiAccountInfo) {
      return <div>No SMOWL API account info</div>;
    }

    if (smowlApiAccountInfo.error || aNamesJson.error) {
      return <div>Error while initializing the dialog</div>;
    }

    return (
      <SmowlActivityResults
        activityId={activityId.toString()}
        activityType={activityType}
        entityName={smowlApiAccountInfo.entityName}
        swlAPIKey={smowlApiAccountInfo.swlAPIKey}
        aNamesJson={aNamesJson.data}
        lang={lang}
      />
    );
  };

  return (
    <Dialog
      disableScroll={true}
      title="SMOWL Activity Results"
      content={content}
      modifier={["studies"]}
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      {children}
    </Dialog>
  );
};

/**
 * UseSmowlActivityResultDialogProps
 */
interface UseSmowlActivityResultDialogProps {
  activityId: number;
  dialogOpen: boolean;
  dataLoader: (activityId: number) => Promise<{
    aNamesJson: string;
  }>;
}

/**
 * useSmowlActivityResultDialog
 * @param props UseSmowlActivityResultDialogProps
 * @returns useSmowlActivityResultDialog
 */
const useSmowlActivityResultDialog = (
  props: UseSmowlActivityResultDialogProps
) => {
  const { activityId, dialogOpen, dataLoader } = props;
  const [smowlApiAccountInfo, setSmowlApiAccountInfo] = React.useState<{
    swlAPIKey: string;
    entityName: string;
    loading: boolean;
    error?: ResponseError | FetchError;
  }>({
    swlAPIKey: null,
    entityName: null,
    loading: true,
  });
  const [aNamesJson, setaNamesJson] = React.useState<{
    data: string | null;
    loading: boolean;
    error?: ResponseError | FetchError;
  }>({
    data: null,
    loading: true,
  });

  React.useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    /**
     * Loads the SMOWL API account info
     */
    const loadSmowlApiAccountInfo = async () => {
      try {
        setSmowlApiAccountInfo((prev) => ({ ...prev, loading: true }));
        const smowlApiAccountInfo = await getSmowlApiAccountInfo();
        setSmowlApiAccountInfo({
          swlAPIKey: smowlApiAccountInfo.swlAPIKey,
          entityName: smowlApiAccountInfo.entityName,
          loading: false,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        setSmowlApiAccountInfo((prev) => ({
          ...prev,
          loading: false,
          error: err,
        }));
      }
    };

    loadSmowlApiAccountInfo();
  }, [dialogOpen]);

  React.useEffect(() => {
    if (!dialogOpen || aNamesJson.data) {
      return;
    }

    /**
     * Loads the activity names from the dataLoader
     */
    const loadANamesJson = async () => {
      try {
        setaNamesJson({ data: null, loading: true });
        const data = await dataLoader(activityId);
        setaNamesJson({ data: data.aNamesJson, loading: false });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        setaNamesJson((prev) => ({ ...prev, loading: false, error: err }));
      }
    };

    loadANamesJson();
  }, [aNamesJson.data, activityId, dataLoader, dialogOpen]);

  return React.useMemo(
    () => ({
      loading: smowlApiAccountInfo.loading || aNamesJson.loading,
      smowlApiAccountInfo,
      aNamesJson,
    }),
    [smowlApiAccountInfo, aNamesJson]
  );
};
export default SmowlActivityResultsDialog;

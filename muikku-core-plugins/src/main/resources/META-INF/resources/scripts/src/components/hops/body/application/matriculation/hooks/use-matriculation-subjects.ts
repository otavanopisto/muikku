import * as React from "react";
import MApi, { isMApiError } from "~/api/api";
import { MatriculationSubject } from "~/generated/client";

const recordsApi = MApi.getRecordsApi();

/**
 * useMatriculationSubjects
 */
export const useMatriculationSubjects = () => {
  const [matriculationSubjects, setMatriculationSubjects] = React.useState<{
    subjects: MatriculationSubject[];
    loading: boolean;
  }>({
    subjects: [],
    loading: true,
  });

  React.useEffect(() => {
    /**
     * Fetch matriculation subjects
     */
    const fetchMatriculationSubjects = async () => {
      try {
        const matriculationSubjects =
          await recordsApi.getMatriculationSubjects();

        setMatriculationSubjects({
          subjects: matriculationSubjects,
          loading: false,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        setMatriculationSubjects({
          subjects: [],
          loading: false,
        });

        /* this.props.displayNotification(
            this.props.i18n.t("notifications.loadError", {
              ns: "studies",
              context: "matriculationSubjects",
            }),
            "error"
          ); */
      }
    };

    fetchMatriculationSubjects();
  }, [matriculationSubjects.loading]);

  return matriculationSubjects;
};

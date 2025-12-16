import * as React from "react";
import { useSelector } from "react-redux";
import { generateRegistrationLinkWithJwt } from "~/api_smowl/index";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";

/**
 * UseExamActivityProps
 */
interface UseExamActivityProps {
  examId: number;
  isSmowlActivity: boolean;
}

/**
 * Hook to generate SMOWL registration link for exam activities
 * @param props - The properties for the hook
 */
export const useExamActivity = (props: UseExamActivityProps) => {
  const { examId, isSmowlActivity } = props;

  const { status, workspaces } = useSelector((state: StateType) => state);
  const [link, setLink] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!isSmowlActivity || !examId || !workspaces.currentWorkspace) {
      setLink(null);
      return;
    }

    /**
     * generateLink
     */
    const generateLink = async () => {
      try {
        setLoading(true);
        setError(null);

        const registrationLink = await generateRegistrationLinkWithJwt(
          {
            activityId: examId.toString(),
            activityType: "exam",
          },
          {
            userName: status.profile.loggedUserName,
            userEmail: status.profile.emails[0],
            lang: localize.lang,
            type: 0,
            activityUrl: window.location.href,
          }
        );

        setLink(registrationLink);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLink(null);
      } finally {
        setLoading(false);
      }
    };

    generateLink();
  }, [
    examId,
    isSmowlActivity,
    status.userId,
    status.profile.loggedUserName,
    status.profile.emails,
    workspaces.currentWorkspace,
  ]);

  return {
    link,
    loading,
    error,
  };
};

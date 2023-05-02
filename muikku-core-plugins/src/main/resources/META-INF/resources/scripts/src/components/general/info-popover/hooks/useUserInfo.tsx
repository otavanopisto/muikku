/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { sleep } from "~/helper-functions/shared";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

/**
 * UseStudentActivityState
 */
export interface UseUserInfoState {
  isLoading: boolean;
  userInfo: any;
}

/**
 * useStudentActivity
 * Custom hook to return student activity data
 */

/**
 * Custom hook to handle student course choices
 * @param userId userId
 * @param show boolean
 * @param displayNotification displayNotification
 * @returns student course choices
 */
export const useUserInfo = (
  userId: number,
  show: boolean,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [userInfo, setUserInfo] = React.useState<UseUserInfoState>({
    isLoading: true,
    userInfo: null,
  });

  const componentMounted = React.useRef(true);

  React.useEffect(
    () => () => {
      componentMounted.current = false;
    },
    []
  );

  React.useEffect(() => {
    /**
     * loadStudentChoiceData
     * Loads student choice data
     * @param userId of student
     */
    const loadUserInfoData = async (userId: number) => {
      setUserInfo((userInfo) => ({
        ...userInfo,
        isLoading: true,
      }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        await sleep(1000);

        if (componentMounted.current) {
          setUserInfo((userInfo) => ({
            ...userInfo,
            isLoading: false,
            userInfo: {},
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(err.message, "error");
          setUserInfo((userInfo) => ({
            ...userInfo,
            isLoading: false,
          }));
        }
      }
    };

    show && userInfo.userInfo === null && loadUserInfoData(userId);
  }, [userId, show, displayNotification, userInfo.userInfo]);

  return {
    userInfo,
  };
};

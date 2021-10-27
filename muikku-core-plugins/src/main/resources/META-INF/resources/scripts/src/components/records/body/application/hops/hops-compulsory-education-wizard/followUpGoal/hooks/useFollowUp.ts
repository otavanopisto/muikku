import * as React from "react";
import { updateFollowUpData } from "../handlers/handlers";
import { FollowUp } from "../../../../../../../../@types/shared";

/**
 * UseFollowUpGoalsState
 */
export interface UseFollowUpGoalsState {
  isLoading: boolean;
  followUpGoal: string;
  followUpStudies?: string;
  studySector?: string;
}

/**
 * Intial state
 */
const initialState: UseFollowUpGoalsState = {
  isLoading: false,
  followUpGoal: "",
  followUpStudies: "",
  studySector: "",
};

/**
 * useFollowUpGoal
 */
export const useFollowUpGoal = () => {
  const [followUpData, setFollowUpData] = React.useState(initialState);

  return {
    followUpData,
    updateFollowUpData: (dataToUpdate: FollowUp) =>
      updateFollowUpData(setFollowUpData, dataToUpdate),
  };
};

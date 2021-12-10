import mApi from "~/lib/mApi";
import promisify from "../../../../../../../../util/promisify";
import { StudentActivityCourse } from "~/@types/shared";
import { UseFollowUpGoalsState } from "../hooks/useFollowUp";
import { FollowUp } from "../../../../../../../../@types/shared";

type SetFollowUpData = React.Dispatch<
  React.SetStateAction<UseFollowUpGoalsState>
>;

export const updateFollowUpData = async (
  setFollowUpData: SetFollowUpData,
  dataToUpdate: FollowUp
) => {
  setFollowUpData({ ...dataToUpdate, isLoading: false });
};

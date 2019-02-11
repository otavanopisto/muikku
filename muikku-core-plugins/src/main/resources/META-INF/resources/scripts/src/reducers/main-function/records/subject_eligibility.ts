import { ActionType } from "actions";


/**
 * Enum describing matriculation eligibility
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 */

export type EligibleStatusType = "ELIGIBLE" | "NOT_ELIGIBLE";


/**
 * Interface representing matriculation eligibility REST model 
 * 
 */

export interface SubjectEligibilityType {
  egilibility: EligibleStatusType
  requiredCount: number;
  acceptedCount: number;
  loading: boolean;
}

export default function subjectEligibility(state:SubjectEligibilityType={
  egilibility: <EligibleStatusType>"NOT_ELIGIBLE",  
  requiredCount: 0,
  acceptedCount: 0,
  loading: true
}, action: ActionType):SubjectEligibilityType{
  if (action.type === "UPDATE_STUDIES_SUBJECT_ELIGIBILITY"){
     let updateAllProperties: SubjectEligibilityType = action.payload;
     return Object.assign({}, state, updateAllProperties);
   }
  return state;
}
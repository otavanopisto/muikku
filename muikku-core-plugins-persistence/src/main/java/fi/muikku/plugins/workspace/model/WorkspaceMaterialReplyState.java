package fi.muikku.plugins.workspace.model;

public enum WorkspaceMaterialReplyState {

  /* User has not touched the assignment */
  
  UNANSWERED,
  
  /* User has answered the assignment but has not marked it complete */

  ANSWERED,
  
  /* User has submitted the assignment to be evaluated or checked an exercise */
  
  SUBMITTED,
  
  /* User has withdrawn previously submitted assignment */
  
  WITHDRAWN,
  
  /* Teacher has evaluated the assignment */
  
  EVALUATED,
  
  /* Teacher has evaluated the assignment with a grade that is passing */
  
  PASSED,
  
  /* Teacher has evaluated the assignment with a grade that is non passing */
  
  FAILED
  
}

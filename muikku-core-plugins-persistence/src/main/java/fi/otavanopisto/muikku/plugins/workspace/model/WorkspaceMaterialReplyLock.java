package fi.otavanopisto.muikku.plugins.workspace.model;

public enum WorkspaceMaterialReplyLock {

  /* Material represented by this reply is not locked */
  
  NONE,
  
  /* Material is locked because it has been evaluated, the workspace has been evaluated, or the student has left an evaluation request */

  SOFT,
  
  /* Material is locked because the reply has been explicitly locked */
  
  HARD
  
}

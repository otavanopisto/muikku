package fi.muikku.plugins.workspace.rest.model;

import java.util.List;

public class WorkspaceMaterialCompositeReply {

  public WorkspaceMaterialCompositeReply(){
  }
  
  public WorkspaceMaterialCompositeReply(List<WorkspaceMaterialFieldAnswer> answers) {
    this.answers = answers;
  }

  public List<WorkspaceMaterialFieldAnswer> getAnswers() {
    return answers;
  }

  public void setAnswers(List<WorkspaceMaterialFieldAnswer> answers) {
    this.answers = answers;
  }

  private List<WorkspaceMaterialFieldAnswer> answers;

}
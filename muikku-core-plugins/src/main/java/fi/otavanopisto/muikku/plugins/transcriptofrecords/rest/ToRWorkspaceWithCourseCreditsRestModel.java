package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.List;

public class ToRWorkspaceWithCourseCreditsRestModel {

  public int getCompletedCourseCredits() {
    return completedCourseCredits;
  }
  public void setCompletedCourseCredits(int completedCourseCredits) {
    this.completedCourseCredits = completedCourseCredits;
  }
  
  public int getMandatoryCourseCredits() {
    return mandatoryCourseCredits;
  }
  public void setMandatoryCourseCredits(int mandatoryCourseCredits) {
    this.mandatoryCourseCredits = mandatoryCourseCredits;
  }

  public List<ToRWorkspaceRestModel> getWorkspaces() {
    return workspaces;
  }
  public void setWorkspaces(List<ToRWorkspaceRestModel> workspaces) {
    this.workspaces = workspaces;
  }

  public boolean isShowCredits() {
    return showCredits;
  }
  public void setShowCredits(boolean showCredits) {
    this.showCredits = showCredits;
  }

  private int completedCourseCredits;
  private int mandatoryCourseCredits;
  private List<ToRWorkspaceRestModel> workspaces;
  private boolean showCredits;
}
package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.List;

public class ToRWorkspaceWithStudyPointsRestModel {

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

  private int completedCourseCredits;
  private int mandatoryCourseCredits;
  private List<ToRWorkspaceRestModel> workspaces;
}
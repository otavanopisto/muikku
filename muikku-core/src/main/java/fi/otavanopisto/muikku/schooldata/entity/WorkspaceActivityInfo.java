package fi.otavanopisto.muikku.schooldata.entity;

import java.util.List;

public class WorkspaceActivityInfo {

  public String getLineName() {
    return lineName;
  }

  public void setLineName(String lineName) {
    this.lineName = lineName;
  }

  public String getLineCategory() {
    return lineCategory;
  }

  public void setLineCategory(String lineCategory) {
    this.lineCategory = lineCategory;
  }

  public boolean isDefaultLine() {
    return isDefaultLine;
  }

  public void setDefaultLine(boolean isDefaultLine) {
    this.isDefaultLine = isDefaultLine;
  }

  public List<WorkspaceActivity> getActivities() {
    return activities;
  }

  public void setActivities(List<WorkspaceActivity> activities) {
    this.activities = activities;
  }

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

  public boolean isShowCredits() {
    return showCredits;
  }

  public void setShowCredits(boolean showCredits) {
    this.showCredits = showCredits;
  }

  private String lineName;
  private String lineCategory;
  private boolean isDefaultLine;
  private List<WorkspaceActivity> activities;
  private int completedCourseCredits;
  private int mandatoryCourseCredits;
  private boolean showCredits;
}

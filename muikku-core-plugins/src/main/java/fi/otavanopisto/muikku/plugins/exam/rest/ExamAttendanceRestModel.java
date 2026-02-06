package fi.otavanopisto.muikku.plugins.exam.rest;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;

public class ExamAttendanceRestModel {
  
  public OffsetDateTime getStarted() {
    return started;
  }

  public void setStarted(OffsetDateTime started) {
    this.started = started;
  }

  public OffsetDateTime getEnded() {
    return ended;
  }

  public void setEnded(OffsetDateTime ended) {
    this.ended = ended;
  }

  public boolean isAllowRestart() {
    return allowRestart;
  }

  public void setAllowRestart(boolean allowRestart) {
    this.allowRestart = allowRestart;
  }

  public List<ContentNode> getContents() {
    return contents;
  }

  public void setContents(List<ContentNode> contents) {
    this.contents = contents;
  }

  public int getMinutes() {
    return minutes;
  }

  public void setMinutes(int minutes) {
    this.minutes = minutes;
  }

  public Long getFolderId() {
    return folderId;
  }

  public void setFolderId(Long folderId) {
    this.folderId = folderId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public RestAssignmentEvaluation getEvaluationInfo() {
    return evaluationInfo;
  }

  public void setEvaluationInfo(RestAssignmentEvaluation evaluationInfo) {
    this.evaluationInfo = evaluationInfo;
  }
  
  @JsonIgnore
  public void addAssignmentInfo(ExamAssignmentRestModel assignmentInfo) {
    assignmentInfos.add(assignmentInfo);
  }

  public List<ExamAssignmentRestModel> getAssignmentInfos() {
    return assignmentInfos;
  }

  public void setAssignmentInfos(List<ExamAssignmentRestModel> assignmentInfos) {
    this.assignmentInfos = assignmentInfos;
  }

  public boolean isProctored() {
    return proctored;
  }

  public void setProctored(boolean proctored) {
    this.proctored = proctored;
  }

  private Long folderId;
  private String name;
  private String description;
  private OffsetDateTime started;
  private OffsetDateTime ended;
  private boolean allowRestart;
  private int minutes;
  private List<ContentNode> contents;
  private RestAssignmentEvaluation evaluationInfo;
  private boolean proctored;
  private List<ExamAssignmentRestModel> assignmentInfos = new ArrayList<>();

}

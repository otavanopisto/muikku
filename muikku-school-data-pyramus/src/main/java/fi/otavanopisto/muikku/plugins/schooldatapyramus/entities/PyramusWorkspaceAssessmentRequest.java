package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;

public class PyramusWorkspaceAssessmentRequest implements WorkspaceAssessmentRequest {
  
  public PyramusWorkspaceAssessmentRequest(String identifier, String workSpaceUserIdentifier,
      String requestText, Date date, Date deadline, Boolean archived, Boolean handled) {
    super();
    this.identifier = identifier;
    this.workSpaceUserIdentifier = workSpaceUserIdentifier;
    this.requestText = requestText;
    this.date = date;
    this.deadline = deadline;
    this.archived = archived;
    this.handled = handled;
  }

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getWorkspaceUserIdentifier() {
    return workSpaceUserIdentifier;
  }

  @Override
  public String getWorkspaceUserSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public Date getDate() {
    return date;
  }

  @Override
  public Date getDeadline() {
    return deadline;
  }

  @Override
  public String getRequestText() {
    return requestText;
  }

  @Override
  public Boolean getArchived() {
    return archived;
  }

  @Override
  public Boolean getHandled() {
    return handled;
  }
  
  private String identifier;
  private String workSpaceUserIdentifier;
  private String requestText;
  private Date date;
  private Date deadline;
  private Boolean archived;
  private Boolean handled;
}

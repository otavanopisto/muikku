package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;

public class PyramusWorkspaceAssessmentRequest implements WorkspaceAssessmentRequest {
  
  public PyramusWorkspaceAssessmentRequest(String identifier, String workSpaceUserIdentifier,
      String requestText, Date date) {
    super();
    this.identifier = identifier;
    this.workSpaceUserIdentifier = workSpaceUserIdentifier;
    this.requestText = requestText;
    this.date = date;
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
  public String getRequestText() {
    return requestText;
  }

  private String identifier;
  private String workSpaceUserIdentifier;
  private String requestText;
  private Date date;
}

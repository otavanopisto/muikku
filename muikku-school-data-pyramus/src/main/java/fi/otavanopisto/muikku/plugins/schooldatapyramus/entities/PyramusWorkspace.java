package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractWorkspace;

public class PyramusWorkspace extends AbstractWorkspace {
  
  public PyramusWorkspace() {
    super();
  }

  public PyramusWorkspace(String identifier, String name, String nameExtension, String viewLink,
      SchoolDataIdentifier workspaceTypeId, String courseIdentifierIdentifier, String description,
      String subjectIdentifier, SchoolDataIdentifier educationTypeIdentifier, Date modified, Double length,
      String lengthUnitIdentifier, OffsetDateTime beginDate, OffsetDateTime endDate, boolean archived,
      boolean evaluationFeeApplicable, SchoolDataIdentifier curriculumIdentifier) {
    super(identifier, name, nameExtension, viewLink, workspaceTypeId, courseIdentifierIdentifier, description,
        subjectIdentifier, educationTypeIdentifier, modified, length, lengthUnitIdentifier, beginDate, endDate, archived,
        evaluationFeeApplicable, curriculumIdentifier);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
}

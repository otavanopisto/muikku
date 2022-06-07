package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface WorkspaceSubject {

  public SchoolDataIdentifier getIdentifier();

  public SchoolDataIdentifier getSubjectIdentifier();

  public Integer getCourseNumber();

  public Double getLength();

  public SchoolDataIdentifier getLengthUnitIdentifier();

}

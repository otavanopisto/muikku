package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface Subject extends SchoolDataEntity {

  public String getIdentifier();

  public String getName();

  public String getCode();

  public SchoolDataIdentifier schoolDataIdentifier();
}
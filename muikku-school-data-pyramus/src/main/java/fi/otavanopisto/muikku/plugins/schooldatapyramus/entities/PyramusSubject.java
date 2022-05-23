package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Subject;

public class PyramusSubject implements Subject {

  public PyramusSubject(String identifier, String name, String code) {
    this.name = name;
    this.identifier = identifier;
    this.code = code;
    this.schoolDataIdentifier = new SchoolDataIdentifier(identifier, getSchoolDataSource());
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public SchoolDataIdentifier schoolDataIdentifier() {
    return schoolDataIdentifier;
  }

  private final String name;
  private final String identifier;
  private final String code;
  private final SchoolDataIdentifier schoolDataIdentifier;
}

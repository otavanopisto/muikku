package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractEducationType implements EducationType {
  
  public AbstractEducationType() {
  }

  public AbstractEducationType(SchoolDataIdentifier identifier, String name, String code) {
    super();
    this.identifier = identifier;
    this.name = name;
    this.code = code;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
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

  private SchoolDataIdentifier identifier;
  private String name;
  private String code;

}

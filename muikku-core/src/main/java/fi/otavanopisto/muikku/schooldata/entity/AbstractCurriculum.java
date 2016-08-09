package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractCurriculum implements Curriculum {
  
  public AbstractCurriculum() {
  }

  public AbstractCurriculum(SchoolDataIdentifier identifier, String name) {
    super();
    this.identifier = identifier;
    this.name = name;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public String getName() {
    return name;
  }

  private SchoolDataIdentifier identifier;
  private String name;
}

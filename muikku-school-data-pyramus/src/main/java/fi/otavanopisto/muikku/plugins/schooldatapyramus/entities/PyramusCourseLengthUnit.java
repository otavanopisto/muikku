package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;

public class PyramusCourseLengthUnit implements CourseLengthUnit {

  public PyramusCourseLengthUnit(String identifier, String symbol, String name) {
    this.name = name;
    this.symbol = symbol;
    this.identifier = identifier;
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
  public String getSymbol() {
    return symbol;
  }

  @Override
  public String getName() {
    return name;
  }

  private String identifier;
  private String symbol;
  private String name;
}

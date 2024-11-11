package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceLengthUnitRestModel {

  public WorkspaceLengthUnitRestModel() {
  }
  
  public WorkspaceLengthUnitRestModel(String identifier, String symbol, String name) {
    this.identifier = identifier;
    this.symbol = symbol;
    this.name = name;
  }
  
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public String getSymbol() {
    return symbol;
  }

  public void setSymbol(String symbol) {
    this.symbol = symbol;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private String identifier;
  private String symbol;
  private String name;
}

package fi.muikku.plugins.dnm.parser.structure.model;

import java.util.List;

import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;

public class ConnectFieldData {
  
  public ConnectFieldData(List<ConnectFieldOption> options) {
    this.options = options;
  }

  public List<ConnectFieldOption> getOptions() {
    return options;
  }

  public void setOptions(List<ConnectFieldOption> options) {
    this.options = options;
  }

  private List<ConnectFieldOption> options;

}

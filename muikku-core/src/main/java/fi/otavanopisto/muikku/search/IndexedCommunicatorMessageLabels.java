package fi.otavanopisto.muikku.search;

public class IndexedCommunicatorMessageLabels{

  public Long getId() {
    return id;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String communicatorLabel) {
    this.label = communicatorLabel;
  }

  private Long id;
  
  private String label;
}

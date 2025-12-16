package fi.otavanopisto.muikku.schooldata.payload;

public class WorklistWorkspacePrice {

  public WorklistWorkspacePrice() {
  }

  public WorklistWorkspacePrice(Double full, Double half) {
    this.full = full;
    this.half = half;
  }

  public Double getFull() {
    return full;
  }

  public void setFull(Double full) {
    this.full = full;
  }

  public Double getHalf() {
    return half;
  }

  public void setHalf(Double half) {
    this.half = half;
  }

  private Double full;
  private Double half;

}
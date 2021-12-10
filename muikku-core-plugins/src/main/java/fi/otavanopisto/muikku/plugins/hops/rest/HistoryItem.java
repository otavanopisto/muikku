package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.Date;

public class HistoryItem {

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getModifier() {
    return modifier;
  }

  public void setModifier(String modifier) {
    this.modifier = modifier;
  }

  private Date date;
  private String modifier;

}

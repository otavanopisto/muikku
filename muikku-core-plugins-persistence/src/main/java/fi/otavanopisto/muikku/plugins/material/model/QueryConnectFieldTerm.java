package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QueryConnectFieldTerm extends QueryConnectFieldOption {

  public QueryConnectFieldCounterpart getCounterpart() {
    return counterpart;
  }
  
  public void setCounterpart(QueryConnectFieldCounterpart counterpart) {
    this.counterpart = counterpart;
  }

  @ManyToOne
  private QueryConnectFieldCounterpart counterpart; 
}

package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.material.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.model.material.QueryConnectFieldTerm;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialConnectFieldAnswer extends WorkspaceMaterialFieldAnswer {

  public QueryConnectFieldTerm getTerm() {
    return term;
  }
  
  public void setTerm(QueryConnectFieldTerm term) {
    this.term = term;
  }
  
  public QueryConnectFieldCounterpart getCounterpart() {
    return counterpart;
  }
  
  public void setCounterpart(QueryConnectFieldCounterpart counterpart) {
    this.counterpart = counterpart;
  }
  
  @ManyToOne
  private QueryConnectFieldTerm term;
  
  @ManyToOne
  private QueryConnectFieldCounterpart counterpart;
}

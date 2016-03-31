package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.plugins.material.model.QueryField;

public abstract class QueryFieldEvent {

  public QueryFieldEvent(QueryField queryField, boolean removeAnswers) {
    this.queryField = queryField;
    this.removeAnswers = removeAnswers;
  }
  
  public QueryField getQueryField() {
    return queryField;
  }
  
  public void setQueryField(QueryField queryField) {
    this.queryField = queryField;
  }
  
  public boolean getRemoveAnswers() {
    return removeAnswers;
  }

  public void setRemoveAnswers(boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }

  private QueryField queryField;
  private boolean removeAnswers;
}

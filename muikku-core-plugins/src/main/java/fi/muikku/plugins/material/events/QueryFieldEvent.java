package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.QueryField;

public abstract class QueryFieldEvent {

  public QueryFieldEvent(QueryField queryField) {
    this.queryField = queryField;
  }
  
  public QueryField getQueryField() {
    return queryField;
  }
  
  public void setQueryField(QueryField queryField) {
    this.queryField = queryField;
  }
  
  private QueryField queryField;
}

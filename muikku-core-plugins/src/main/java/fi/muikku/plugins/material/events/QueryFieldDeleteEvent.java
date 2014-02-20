package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.QueryField;

public class QueryFieldDeleteEvent extends QueryFieldEvent {

  public QueryFieldDeleteEvent(QueryField queryField) {
    super(queryField);
  }

}

package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.MaterialField;
import fi.muikku.plugins.material.model.QueryField;

public class QueryFieldUpdateEvent extends QueryFieldEvent {

  public QueryFieldUpdateEvent(QueryField queryField, MaterialField materialField, boolean removeAnswers) {
    super(queryField, removeAnswers);
    this.materialField = materialField;
  }
  
  public MaterialField getMaterialField() {
    return materialField;
  }

  public void setMaterialField(MaterialField materialField) {
    this.materialField = materialField;
  }

  private MaterialField materialField;

}

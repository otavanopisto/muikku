package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class SorterFieldMeta extends FieldMeta {
  
  public SorterFieldMeta() {
  }

  public SorterFieldMeta(String name, List<SorterFieldItemMeta> items) {
    super(name);
    setItems(items);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.sorter";
  }

  public List<SorterFieldItemMeta> getItems() {
    return items;
  }

  public void setItems(List<SorterFieldItemMeta> items) {
    this.items = items;
  }

  @JsonIgnore
  public boolean hasItemWithId(String itemId) {
    for (SorterFieldItemMeta item : items) {
      if (itemId.equals(item.getId())) {
        return true;
      }
    }
    return false;
  }
  
  private List<SorterFieldItemMeta> items;

}

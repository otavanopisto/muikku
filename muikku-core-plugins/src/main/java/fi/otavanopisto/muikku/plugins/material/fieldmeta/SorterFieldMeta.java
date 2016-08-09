package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class SorterFieldMeta extends FieldMeta {
  
  public SorterFieldMeta() {
  }

  public SorterFieldMeta(String name, String orientation, List<SorterFieldItemMeta> items) {
    super(name);
    setOrientation(orientation);
    setItems(items);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.sorter";
  }
  
  public String getOrientation() {
    return orientation;
  }

  public void setOrientation(String orientation) {
    this.orientation = orientation;
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
  
  private String orientation;
  private List<SorterFieldItemMeta> items;

}

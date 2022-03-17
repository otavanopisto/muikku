package fi.otavanopisto.muikku.model.workspace;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class EducationTypeMapping {
  
  public static class MappingItem {
    public String getEducationTypeIdentifier() {
      return educationTypeIdentifier;
    }
    public void setEducationTypeIdentifier(String educationTypeIdentifier) {
      this.educationTypeIdentifier = educationTypeIdentifier;
    }
    public Mandatority getMandatority() {
      return mandatority;
    }
    public void setMandatority(Mandatority mandatority) {
      this.mandatority = mandatority;
    }
    private String educationTypeIdentifier;
    private Mandatority mandatority;
  }
  
  public Mandatority getMandatority(SchoolDataIdentifier identifier) {
    if (identifier == null) {
      return null;
    }
    for (MappingItem item : items) {
      if (Objects.equals(item.getEducationTypeIdentifier(), identifier.toId())) {
        return item.getMandatority();
      }
    }

    return null;
  }
  
  public List<MappingItem> getItems() {
    return items;
  }

  public void setItems(List<MappingItem> items) {
    this.items = items;
  }

  List<MappingItem> items = new ArrayList<>();
}

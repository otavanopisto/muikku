package fi.otavanopisto.muikku.schooldata.payload;

import java.util.List;

public class StudyActivityRestModel {
  
  public List<StudyActivityItemRestModel> getItems() {
    return items;
  }

  public void setItems(List<StudyActivityItemRestModel> items) {
    this.items = items;
  }

  private List<StudyActivityItemRestModel> items;

}

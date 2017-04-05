package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.List;

public class VopsRESTModel {
  public static class VopsItem {
    public VopsItem(int courseNumber, boolean isCompleted) {
      super();
      this.courseNumber = courseNumber;
      this.completed = isCompleted;
    }
    
    public int getCourseNumber() {
      return courseNumber;
    }
    
    public boolean isCompleted() {
      return completed;
    }
    
    int courseNumber;
    boolean completed;
  }
  
  public static class VopsRow {
    public VopsRow(String subject, List<VopsItem> items) {
      super();
      this.subject = subject;
      this.items = items;
    }
    
    public List<VopsItem> getItems() {
      return items;
    }
    
    public String getSubject() {
      return subject;
    }

    String subject;
    List<VopsItem> items;
  }
  
  public VopsRESTModel(List<VopsRow> rows) {
    super();
    this.rows = rows;
  }
  
  public List<VopsRow> getRows() {
    return rows;
  }
  
  List<VopsRow> rows;
}

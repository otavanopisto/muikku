package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.List;

public class VopsRESTModel {
  public static class VopsItem {
    public VopsItem(int courseNumber, boolean isCompleted, String educationType, Mandatority mandatority) {
      super();
      this.courseNumber = courseNumber;
      this.completed = isCompleted;
      this.educationType = educationType;
      this.mandatority = mandatority;
    }
    
    public int getCourseNumber() {
      return courseNumber;
    }
    public boolean isCompleted() {
      return completed;
    }
    public String getEducationType() {
      return educationType;
    }
    public Mandatority getMandatority() {
      return mandatority;
    }
    public void setMandatority(Mandatority mandatority) {
      this.mandatority = mandatority;
    }

    private int courseNumber;
    private boolean completed;
    private String educationType;
    private Mandatority mandatority;
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

package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.List;

public class VopsRESTModel {
  public static class VopsItem {
    public VopsItem(int courseNumber, CourseCompletionState state, String educationSubtype, Mandatority mandatority) {
      super();
      this.courseNumber = courseNumber;
      this.state = state;
      this.educationSubtype = educationSubtype;
      this.mandatority = mandatority;
    }
    
    public int getCourseNumber() {
      return courseNumber;
    }
    public CourseCompletionState getState() {
      return state;
    }
    public String getEducationSubtype() {
      return educationSubtype;
    }
    public void setEducationSubtype(String educationSubtype) {
      this.educationSubtype = educationSubtype;
    }
    public Mandatority getMandatority() {
      return mandatority;
    }
    public void setMandatority(Mandatority mandatority) {
      this.mandatority = mandatority;
    }

    private int courseNumber;
    private CourseCompletionState state;
    private String educationSubtype;
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
  
  public VopsRESTModel(List<VopsRow> rows, int numCourses, int numMandatoryCourses) {
    super();
    this.rows = rows;
    this.numCourses = numCourses;
    this.numMandatoryCourses = numMandatoryCourses;
  }
  
  public List<VopsRow> getRows() {
    return rows;
  }
  
  public int getNumCourses() {
    return numCourses;
  }
  
  public int getNumMandatoryCourses() {
    return numMandatoryCourses;
  }
  
  int numMandatoryCourses;
  int numCourses;
  
  List<VopsRow> rows;
}

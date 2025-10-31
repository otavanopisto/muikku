package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import java.util.List;

public interface MatriculationExamEnrollment {
  public Long getId();
  public void setId(Long id);
  public Long getExamId();
  public void setExamId(Long examId);
  public String getEnrollAs();
  public void setEnrollAs(String enrollAs);
  boolean isRestartExam();
  void setRestartExam(boolean restartExam);
  public int getNumMandatoryCourses();
  public void setNumMandatoryCourses(int numMandatoryCourses);
  public String getLocation();
  public void setLocation(String location);
  boolean isCanPublishName();
  void setCanPublishName(boolean canPublishName);
  public String getContactInfoChange();
  public void setContactInfoChange(String contactInfoChange);
  public String getMessage();
  public void setMessage(String message);
  public Long getStudentId();
  public void setStudentId(Long studentId);
  public String getState();
  public void setState(String state);
  public List<MatriculationExamAttendance> getAttendances();
  public void setAttendances(List<MatriculationExamAttendance> attendances);
  public String getDegreeType();
  public void setDegreeType(String degreeType);
  public String getDegreeStructure();
  public void setDegreeStructure(String degreeStructure);
  public OffsetDateTime getEnrollmentDate();
  public void setEnrollmentDate(OffsetDateTime enrollmentDate);
}


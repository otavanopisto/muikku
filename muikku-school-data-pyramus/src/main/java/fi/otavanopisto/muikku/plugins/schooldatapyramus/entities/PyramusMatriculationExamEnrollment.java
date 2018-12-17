package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.LocalDate;

import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollment;

public class PyramusMatriculationExamEnrollment implements MatriculationExamEnrollment {
  
  public PyramusMatriculationExamEnrollment(LocalDate enrollmentDate) {
    this.enrollmentDate = enrollmentDate;
  }

  @Override
  public LocalDate getEnrollmentDate() {
    return enrollmentDate;
  }
  
  private final LocalDate enrollmentDate;

}

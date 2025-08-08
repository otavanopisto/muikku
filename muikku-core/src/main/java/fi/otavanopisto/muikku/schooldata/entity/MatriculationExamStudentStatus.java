package fi.otavanopisto.muikku.schooldata.entity;

public enum MatriculationExamStudentStatus {

  // Student not eligible to enroll for exam
  NOT_ELIGIBLE,
  // Student eligible to enroll for exam
  ELIGIBLE,
  // Student has submitted the form and it is pending processing (implies they were eligible at the time)
  PENDING,
  // Form was submitted and reviewed but was returned for supplementation
  SUPPLEMENTATION_REQUEST,
  // Student has supplemented the form after supplementation request
  SUPPLEMENTED,
  // Enrollment has been approved (implies the form was also submitted before)
  APPROVED,
  // Enrollment has been rejected (implies the form was also submitted before)
  REJECTED,
  // Confirmed by student
  CONFIRMED,
  // Form is filled on behalf of the student by their guidance counselor
  FILLED_ON_BEHALF;

}

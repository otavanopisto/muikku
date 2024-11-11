package fi.otavanopisto.muikku.schooldata.entity;

public interface StudentMatriculationEligibilityOPS2021 {
  
  boolean isEligible();
  Double getRequiredPassingGradeCourseCreditPoints();
  Double getPassingGradeCourseCreditPoints();
  
}
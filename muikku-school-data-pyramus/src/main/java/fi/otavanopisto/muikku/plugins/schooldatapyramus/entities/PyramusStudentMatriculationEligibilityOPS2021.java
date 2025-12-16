package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibilityOPS2021;

public class PyramusStudentMatriculationEligibilityOPS2021 implements StudentMatriculationEligibilityOPS2021 {

  public PyramusStudentMatriculationEligibilityOPS2021(boolean eligible, Double requiredPassingGradeCourseCreditPoints,
      Double passingGradeCourseCreditPoints) {
    this.eligible = eligible;
    this.requiredPassingGradeCourseCreditPoints = requiredPassingGradeCourseCreditPoints;
    this.passingGradeCourseCreditPoints = passingGradeCourseCreditPoints;
  }

  public boolean isEligible() {
    return eligible;
  }

  public Double getRequiredPassingGradeCourseCreditPoints() {
    return requiredPassingGradeCourseCreditPoints;
  }

  public Double getPassingGradeCourseCreditPoints() {
    return passingGradeCourseCreditPoints;
  }

  private final boolean eligible;
  private final Double requiredPassingGradeCourseCreditPoints;
  private final Double passingGradeCourseCreditPoints;
}
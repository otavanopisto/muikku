package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.StudentMatriculationEligibility;

/**
 * Pyramus SchoolDataEntity implementation for student matriculation eligibility
 * 
 * @author Antti Leppä
 */
@Deprecated
public class PyramusStudentMatriculationEligibility implements StudentMatriculationEligibility {

  private Boolean eligible;
  private int requirePassingGrades;
  private int acceptedCourseCount;
  private int acceptedTransferCreditCount;

  /**
   * Constructor
   * 
   * @param eligible whether student is eligible to participate matriculation exam
   * @param requirePassingGrades number of required passing grades
   * @param acceptedCourseCount accepted course count
   * @param acceptedTransferCreditCount accepted transfer credit count
   */
  public PyramusStudentMatriculationEligibility(Boolean eligible, int requirePassingGrades, int acceptedCourseCount, int acceptedTransferCreditCount) {
    super();
    this.eligible = eligible;
    this.requirePassingGrades = requirePassingGrades;
    this.acceptedCourseCount = acceptedCourseCount;
    this.acceptedTransferCreditCount = acceptedTransferCreditCount;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public int getRequirePassingGrades() {
    return requirePassingGrades;
  }

  @Override
  public int getAcceptedCourseCount() {
    return acceptedCourseCount;
  }

  @Override
  public int getAcceptedTransferCreditCount() {
    return acceptedTransferCreditCount;
  }

  @Override
  public boolean getEligible() {
    return eligible;
  }

}
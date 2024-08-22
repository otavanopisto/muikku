package fi.otavanopisto.muikku.schooldata.entity;

/**
 * Interface describing student matriculation eligibility
 * 
 * @author Antti Leppä
 */
@Deprecated
public interface StudentMatriculationEligibility extends SchoolDataEntity {
  
  /**
   * Returns number of required passing grades
   * 
   * @return number of required passing grades
   */
  public int getRequirePassingGrades();
  
  /**
   * Returns accepted course count
   * 
   * @return accepted course count
   */
  public int getAcceptedCourseCount();
  
  /**
   * Returns accepted transfer credit count
   * 
   * @return accepted transfer credit count
   */
  public int getAcceptedTransferCreditCount();
  
  /**
   * Returns whether student is eligible to participate matriculation exam
   * 
   * @return whether student is eligible to participate matriculation exam
   */
  public boolean getEligible();
	
}
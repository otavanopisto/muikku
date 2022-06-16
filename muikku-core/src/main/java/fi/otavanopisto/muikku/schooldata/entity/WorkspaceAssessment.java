package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface WorkspaceAssessment extends SchoolDataEntity {
  
  /**
   * Returns identifier of workspace assessment 
   * 
   * @return identifier of workspace assessment
   */
  public SchoolDataIdentifier getIdentifier();
  
  /**
   * Returns identifier of workspace user
   * 
   * @return identifier of workspace user
   */
  public SchoolDataIdentifier getWorkspaceUserIdentifier();
  
  /**
   * Returns identifier of workspace subject
   * 
   * @return identifier of workspace subject
   */
  public SchoolDataIdentifier getWorkspaceSubjectIdentifier();
  
  /**
   * Returns identifier of assessing user
   * 
   * @return identifier of assessing user
   */
  public SchoolDataIdentifier getAssessingUserIdentifier();
  
  /**
   * Returns identifier of grade
   * 
   * @return identifier of grade
   */
  public SchoolDataIdentifier getGradeIdentifier();

  /**
   * Returns identifier of grading scale
   * 
   * @return identifier of gradign scale
   */
  public SchoolDataIdentifier getGradingScaleIdentifier();
  
  /**
   * Returns verbal assessment
   * 
   * @return verbal assessment
   */
  public String getVerbalAssessment();
  
  /**
   * Returns assessment date
   * 
   * @return assessment date
   */
  public Date getDate();
  
  public Boolean getPassing();
  
}
package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface GroupUser extends SchoolDataEntity {

  String getIdentifier();
  
  String getUserIdentifier();

  String getUserSchoolDataSource();

  /**
   * Returns SchoolDataIdentifier of the GroupUser this
   * object represents.
   * 
   * @return GroupUser's SchoolDataIdentifier
   */
  default SchoolDataIdentifier schoolDataIdentifier() {
    return new SchoolDataIdentifier(getIdentifier(), getSchoolDataSource());
  }

  /**
   * Returns SchoolDataIdentifier of the user this GroupUser is
   * referring to.
   * 
   * @return User's SchoolDataIdentifier
   */
  default SchoolDataIdentifier userSchoolDataIdentifier() {
    return new SchoolDataIdentifier(getUserIdentifier(), getUserSchoolDataSource());
  }
}
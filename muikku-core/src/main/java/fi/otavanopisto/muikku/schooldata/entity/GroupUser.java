package fi.otavanopisto.muikku.schooldata.entity;

public interface GroupUser extends SchoolDataEntity {

  String getIdentifier();
  
  String getUserIdentifier();

  String getUserSchoolDataSource();

}
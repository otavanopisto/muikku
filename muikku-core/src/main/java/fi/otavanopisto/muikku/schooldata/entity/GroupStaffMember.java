package fi.otavanopisto.muikku.schooldata.entity;

public interface GroupStaffMember extends GroupUser {

  boolean isGroupAdvisor();
  boolean isStudyAdvisor();
  boolean isMessageReceiver();

}

package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.GroupStaffMember;

public class PyramusGroupStaffMember implements GroupStaffMember {

  public PyramusGroupStaffMember(String identifier, String userIdentifier, boolean groupAdvisor, boolean studyAdvisor, 
      boolean specialEducationTeacher, boolean messageReceiver) {
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.groupAdvisor = groupAdvisor;
    this.studyAdvisor = studyAdvisor;
    this.specialEducationTeacher = specialEducationTeacher;
    this.messageReceiver = messageReceiver;
  }
  
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getUserSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public boolean isGroupAdvisor() {
    return groupAdvisor;
  }

  public void setGroupAdvisor(boolean groupAdvisor) {
    this.groupAdvisor = groupAdvisor;
  }

  @Override
  public boolean isStudyAdvisor() {
    return studyAdvisor;
  }

  public void setStudyAdvisor(boolean studyAdvisor) {
    this.studyAdvisor = studyAdvisor;
  }

  @Override
  public boolean isMessageReceiver() {
    return messageReceiver;
  }

  public void setMessageReceiver(boolean messageReceiver) {
    this.messageReceiver = messageReceiver;
  }

  @Override
  public boolean isSpecialEducationTeacher() {
    return specialEducationTeacher;
  }

  public void setSpecialEducationTeacher(boolean specialEducationTeacher) {
    this.specialEducationTeacher = specialEducationTeacher;
  }

  private String identifier;
  private String userIdentifier;
  private boolean groupAdvisor;
  private boolean studyAdvisor;
  private boolean specialEducationTeacher;
  private boolean messageReceiver;
}

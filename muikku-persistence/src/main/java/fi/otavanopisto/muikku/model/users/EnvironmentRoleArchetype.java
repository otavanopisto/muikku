package fi.otavanopisto.muikku.model.users;

public enum EnvironmentRoleArchetype {

  STUDENT,
  
  TEACHER,
  
  ADMINISTRATOR,
  
  MANAGER,
  
  STUDY_PROGRAMME_LEADER,
  
  STUDY_GUIDER,
  
  STUDENT_PARENT,
  
  CUSTOM;
  
  public static final EnvironmentRoleArchetype[] STAFF_ROLES = { TEACHER, ADMINISTRATOR, MANAGER, STUDY_PROGRAMME_LEADER, STUDY_GUIDER };
  
}

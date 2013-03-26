package fi.muikku.model.courses;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.users.UserRole;
import fi.muikku.model.users.UserRoleType;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseUserRole extends UserRole {

  @Override
  public UserRoleType getType() {
    return UserRoleType.COURSE;
  }

}

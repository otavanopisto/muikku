package fi.muikku.model.courses;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserRoleType;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseUserRole extends RoleEntity {

  @Override
  public UserRoleType getType() {
    return UserRoleType.COURSE;
  }

}

package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentGroupPermission extends GroupPermission {

}

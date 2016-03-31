package fi.otavanopisto.muikku.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.enterprise.util.Nonbinding;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface DefaultWorkspacePermissionRoles {
  @Nonbinding WorkspaceRoleArchetype[] value();
}

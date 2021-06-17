package fi.otavanopisto.muikku.plugins.worklist;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public class WorklistController {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private PluginSettingsController pluginSettingsController;

  public boolean isWorklistActive() {
    if (sessionController.isLoggedIn()) {
      
      // Worklist functionality is always active for admins, never for students
      
      EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
      if (roleEntity != null && roleEntity.getArchetype() == EnvironmentRoleArchetype.ADMINISTRATOR) {
        return true;
      }
      if (roleEntity != null && roleEntity.getArchetype() == EnvironmentRoleArchetype.STUDENT) {
        return false;
      }
      
      // Plugin setting worklist.enabledOrganizations (if not defined, worklist functionality is not active)
      
      String enabledOrganizationsStr = pluginSettingsController.getPluginSetting("worklist", "enabledOrganizations");
      if (StringUtils.isNotBlank(enabledOrganizationsStr)) {
        Set<SchoolDataIdentifier> organizationIdentifiers = Arrays.stream(StringUtils.split(enabledOrganizationsStr, ','))
            .map(identifier -> SchoolDataIdentifier.fromId(identifier))
            .collect(Collectors.toSet());

        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
        if (userSchoolDataIdentifier != null) {
          OrganizationEntity organization = userSchoolDataIdentifier.getOrganization();
          if (organization != null) {
            SchoolDataIdentifier userOrganizationIdentifier = organization.schoolDataIdentifier();
            return organizationIdentifiers.contains(userOrganizationIdentifier);
          }
        }
      }
    }
    return false;
  }

}

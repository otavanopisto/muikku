package fi.otavanopisto.muikku.plugins.worklist;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
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

  public boolean isWorklistAvailable() {
    if (sessionController.isLoggedIn()) {
      
      // Worklist functionality is always available for admins, never for students
      
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
      if (userSchoolDataIdentifier == null || userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        return false;
      }
      if (userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
        return true;
      }
      
      // Plugin setting worklist.enabledOrganizations (if not defined, worklist functionality is not available)
      
      String enabledOrganizationsStr = pluginSettingsController.getPluginSetting("worklist", "enabledOrganizations");
      if (StringUtils.isNotBlank(enabledOrganizationsStr)) {
        Set<SchoolDataIdentifier> organizationIdentifiers = Arrays.stream(StringUtils.split(enabledOrganizationsStr, ','))
            .map(identifier -> SchoolDataIdentifier.fromId(identifier))
            .collect(Collectors.toSet());

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

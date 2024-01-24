package fi.otavanopisto.muikku.plugins.user.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.chat.ChatController;
import fi.otavanopisto.muikku.plugins.me.GuidanceCounselorRestModel;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/user")
@Stateful
@Produces("application/json")
public class StudentGuidanceCouncelorsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 4949507182845855451L;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;

  @Inject
  private ChatController chatController;
  
  @Inject
  private SessionController sessionController;

  @GET
  @Path("/students/{IDENTIFIER}/guidanceCounselors")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listGuidanceCounselors(
      @PathParam("IDENTIFIER") String studentIdentifierStr,
      @QueryParam("onlyChatEnabled") @DefaultValue("false") boolean onlyChatEnabled,
      @QueryParam("properties") String properties) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    UserSchoolDataIdentifier loggedUser = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(studentIdentifier);
    if (loggedUser == null || !loggedUser.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUser().equals(studentIdentifier) && !userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Boolean onlyMessageReceivers = false;
    List<UserEntity> guidanceCouncelors = userGroupGuidanceController.getGuidanceCounselors(studentIdentifier, onlyMessageReceivers);
    
    List<fi.otavanopisto.muikku.rest.model.StaffMember> staffMembers = new ArrayList<>();
    
    for (UserEntity userEntity : guidanceCouncelors) {
      boolean chatEnabled = chatController.isChatEnabled(userEntity);

      if (onlyChatEnabled && !chatEnabled) {
        continue;
      }
      
      boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);
      SchoolDataIdentifier schoolDataIdentifier = userEntity.defaultSchoolDataIdentifier();
      UserEntityName userEntityName = userEntityController.getName(userEntity, true);
      String email = userEmailEntityController.getUserDefaultEmailAddress(schoolDataIdentifier, false);

      UserSchoolDataIdentifier usdi = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(schoolDataIdentifier);
      OrganizationEntity organizationEntity = usdi.getOrganization();
      OrganizationRESTModel organizationRESTModel = null;
      if (organizationEntity != null) {
        organizationRESTModel = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
      }

      String[] propertyArray = StringUtils.isEmpty(properties) ? new String[0] : properties.split(",");

      Map<String, String> propertyMap = new HashMap<String, String>();
      if (userEntity != null) {
        for (int i = 0; i < propertyArray.length; i++) {
          UserEntityProperty userEntityProperty = userEntityController.getUserEntityPropertyByKey(userEntity, propertyArray[i]);
          propertyMap.put(propertyArray[i], userEntityProperty == null ? null : userEntityProperty.getValue());
        }
      }

      Set<String> roles = new HashSet<>();
      if (usdi.getRoles() != null) {
        roles = usdi.getRoles().stream()
            .map(roleEntity -> roleEntity.getArchetype().name())
            .collect(Collectors.toSet());
      }
      
      staffMembers.add(new GuidanceCounselorRestModel(
          userEntity.defaultSchoolDataIdentifier().toId(),
          userEntity.getId(),
          userEntityName.getFirstName(),
          userEntityName.getLastName(),
          email,
          propertyMap,
          organizationRESTModel,
          roles,
          hasImage,
          chatEnabled));
    }
    
    return Response.ok(staffMembers).build();
  }
  
}

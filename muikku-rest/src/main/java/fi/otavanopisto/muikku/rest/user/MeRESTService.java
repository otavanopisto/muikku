package fi.otavanopisto.muikku.rest.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/me")
@Produces("application/json")
@Consumes("application/json")
@RestCatchSchoolDataExceptions
public class MeRESTService {

  @Inject
  private SessionController sessionController;
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;
  
  /**
   * Sets the server side locale for current user.
   * 
   * Payload:
   * {
   *    lang: "en"
   * }
   * 
   * Available languages en/fi
   * 
   * @param selection
   * @return
   */
  @POST
  @Path("/locale")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response setLocale(LanguageSelectionRestModel selection) {
    Locale locale = LocaleUtils.toLocale(selection.getLang());
    localSessionController.setLocale(locale);
    
    if (localSessionController.isLoggedIn()) {
      userEntityController.updateLocale(localSessionController.getLoggedUserEntity(), locale);
    }
    
    return Response.noContent().build();
  }
  
  @GET
  @Path("/guidanceCounselors")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listGuidanceCounselors(@QueryParam("properties") String properties) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    UserSchoolDataIdentifier loggedUser = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    if (loggedUser == null || loggedUser.getRole() == null || loggedUser.getRole().getArchetype() != EnvironmentRoleArchetype.STUDENT) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    Boolean onlyMessageReceivers = false;
    List<UserEntity> guidanceCouncelors = userGroupGuidanceController.getGuidanceCounselors(sessionController.getLoggedUser(), onlyMessageReceivers);
    
    List<fi.otavanopisto.muikku.rest.model.StaffMember> staffMembers = new ArrayList<>();
    
    for (UserEntity userEntity : guidanceCouncelors) {
      boolean hasImage = userEntityFileController.hasProfilePicture(userEntity);
      SchoolDataIdentifier schoolDataIdentifier = userEntity.defaultSchoolDataIdentifier();
      UserEntityName userEntityName = userEntityController.getName(userEntity);
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

      staffMembers.add(new fi.otavanopisto.muikku.rest.model.StaffMember(
          userEntity.defaultSchoolDataIdentifier().toId(),
          userEntity.getId(),
          userEntityName.getFirstName(),
          userEntityName.getLastName(),
          email,
          propertyMap,
          organizationRESTModel,
          usdi.getRole() != null && usdi.getRole().getArchetype() != null ? usdi.getRole().getArchetype().name() : null,
          hasImage));
    }
    
    return Response.ok(staffMembers).build();
  }
  
}

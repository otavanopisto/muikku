package fi.otavanopisto.muikku.plugins.me;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependentWorkspace;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  /**
   * Returns the server side locale for current user or default if not logged in.
   *
   * Returns:
   * {
   *    lang: "en"
   * }
   */
  @GET
  @Path("/locale")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response getLocale() {
    Locale locale = localSessionController.getLocale();
    String lang = (locale == null || locale.getLanguage() == null) ? "fi" : locale.getLanguage().toLowerCase();

    return Response.ok(new LanguageSelectionRestModel(lang)).build();
  }

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
    if (selection == null || StringUtils.isBlank(selection.getLang())) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    Locale locale = LocaleUtils.toLocale(selection.getLang());
    localSessionController.setLocale(locale);

    if (localSessionController.isLoggedIn()) {
      userEntityController.updateLocale(localSessionController.getLoggedUserEntity(), locale);
    }

    return Response.noContent().build();
  }

  @GET
  @Path("/dependents")
  @RESTPermit (MuikkuPermissions.STUDENT_PARENT)
  public Response listGuardiansDependents() {
    List<GuardiansDependent> guardiansDependents = userController.listGuardiansDependents(sessionController.getLoggedUser());

    List<GuardiansDependentRestModel> restModels = new ArrayList<>();
    for (GuardiansDependent guardiansDependent : guardiansDependents) {
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(guardiansDependent.getUserIdentifier());
      boolean hasProfilePicture = userEntityFileController.hasProfilePicture(userEntity);

      restModels.add(new GuardiansDependentRestModel(
          userEntity.getId(),
          guardiansDependent.getUserIdentifier().toId(),
          guardiansDependent.getFirstName(),
          guardiansDependent.getLastName(),
          guardiansDependent.getNickName(),
          guardiansDependent.getStudyProgrammeName(),
          hasProfilePicture,
          guardiansDependent.getEmail(),
          guardiansDependent.getPhoneNumber(),
          guardiansDependent.getAddress(),
          userEntity.getLastLogin()
      ));
    }

    return Response.ok(restModels).build();
  }

  @GET
  @Path("/dependents/{ID}/workspaces/")
  @RESTPermit (MuikkuPermissions.STUDENT_PARENT)
  public Response listGuardiansDependentsWorkspaces(
      @PathParam("ID") String studentIdentifierStr) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentIdentifierStr);

    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    List<GuardiansDependentWorkspaceRestModel> restModels = new ArrayList<>();
    List<GuardiansDependentWorkspace> guardiansDependentsWorkspaces = userController.listGuardiansDependentsWorkspaces(
        sessionController.getLoggedUser(), studentIdentifier);

    for (GuardiansDependentWorkspace workspace : guardiansDependentsWorkspaces) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(workspace.getWorkspaceIdentifier());
      WorkspaceUserEntity workspaceUserEntity = workspaceEntity != null ? workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentIdentifier) : null;

      // List only active workspaces
      if (workspaceUserEntity != null && Boolean.TRUE.equals(workspaceUserEntity.getActive())) {
        restModels.add(new GuardiansDependentWorkspaceRestModel(
            workspace.getWorkspaceName(),
            workspace.getWorkspaceNameExtension(),
            workspace.getEnrolledDate(),
            workspace.getLatestAssessmentRequestDate()
        ));
      }
    }

    return Response.ok(restModels).build();
  }

}
package fi.muikku.plugins.workspace.rest;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/system/workspace")
public class WorkspaceSystemRESTService extends PluginRESTService {

  private static final long serialVersionUID = -9168862600590661002L;

  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private RoleController roleController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @GET
  @Path("/syncworkspacestudents/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response synchronizeWorkspaceStudents(@PathParam("ID") Long workspaceEntityId, @Context Request request) {
    // Admins only
    if (!sessionController.isSuperuser()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    logger.info(String.format("Synchronizing students of workspace entity %d", workspaceEntityId));
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Workspace students in Muikku
    List<WorkspaceUserEntity> muikkuWorkspaceStudents = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
    logger.info(String.format("Before synchronizing, Muikku course has %d active students", muikkuWorkspaceStudents.size()));
    
    // Course students in Pyramus
    List<WorkspaceUser> pyramusCourseStudents = workspaceController.listWorkspaceStudents(workspaceEntity);
    logger.info(String.format("Before synchronizing, Pyramus course has %d active students", pyramusCourseStudents.size()));
    
    // Loop through Pyramus students
    for (WorkspaceUser pyramusCourseStudent : pyramusCourseStudents) {
      
      String pyramusStudentId = pyramusCourseStudent.getUserIdentifier().getIdentifier();
      String pyramusCourseStudentId = pyramusCourseStudent.getIdentifier().getIdentifier();
      
      logger.info(String.format("Processing Pyramus course student %s whose student is %s", pyramusCourseStudentId, pyramusStudentId));

      // Find Muikku student corresponding to Pyramus student
      String muikkuStudentId = null;
      String muikkuWorkspaceStudentId = null;
      WorkspaceUserEntity muikkuWorkspaceStudent = null;
      for (int i = 0; i < muikkuWorkspaceStudents.size(); i++) {
        muikkuStudentId = muikkuWorkspaceStudents.get(i).getUserSchoolDataIdentifier().getIdentifier();
        muikkuWorkspaceStudentId = muikkuWorkspaceStudents.get(i).getIdentifier(); 
        if (StringUtils.equals(muikkuWorkspaceStudentId, pyramusCourseStudentId)) {
          muikkuWorkspaceStudent = muikkuWorkspaceStudents.get(i);
          muikkuWorkspaceStudents.remove(i);
          break;
        }
      }
      
      if (muikkuWorkspaceStudent == null) {
        logger.warning(String.format("Fixing: Muikku workspace student for %s does not yet exist", pyramusCourseStudentId));
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(
            "PYRAMUS",
            pyramusStudentId);
        if (userSchoolDataIdentifier == null) {
          logger.severe(String.format("Unable to fix: UserSchoolDataIdentifier for Pyramus student %s not found", pyramusStudentId));
        }
        else {
          WorkspaceRoleEntity workspaceRole = roleController.findWorkspaceRoleEntityById(getWorkspaceStudentRoleId());
          muikkuWorkspaceStudent = workspaceUserEntityController.createWorkspaceUserEntity(
              userSchoolDataIdentifier,
              workspaceEntity,
              pyramusCourseStudentId,
              workspaceRole);
          logger.info(String.format("Fixed: Muikku workspace student %s created", muikkuWorkspaceStudent.getIdentifier()));
        }
      }
      else {
        // Ensure Muikku workspace student points to the same Pyramus student as the course student in Pyramus
        if (!StringUtils.equals(pyramusStudentId, muikkuStudentId)) {
          logger.warning(String.format("Fixing: Muikku workspace student points to student %s and Pyramus to student %s", muikkuStudentId, pyramusStudentId));
          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(
            "PYRAMUS",
            pyramusStudentId);
          if (userSchoolDataIdentifier == null) {
            logger.severe(String.format("Unable to fix: UserSchoolDataIdentifier for Pyramus student %s not found", pyramusStudentId));
          }
          else if (!userSchoolDataIdentifier.getUserEntity().getId().equals(muikkuWorkspaceStudent.getUserSchoolDataIdentifier().getUserEntity().getId())) {
            logger.severe("Unable to fix: UserSchoolDataIdentifiers in Muikku and Pyramus point to different users");
          }
          else {
            workspaceUserEntityController.updateUserSchoolDataIdentifier(muikkuWorkspaceStudent, userSchoolDataIdentifier);
            logger.info("Fixed: UserSchoolDataIdentifier updated");
          }
        }
      }
    }
    
    // The remaining Muikku students in muikkuWorkspaceStudents were not in Pyramus so archive them from Muikku
    if (!muikkuWorkspaceStudents.isEmpty()) {
      logger.info(String.format("Archiving %d Muikku workspace students that were not present in Pyramus", muikkuWorkspaceStudents.size()));
      for (WorkspaceUserEntity muikkuWorkspaceStudent : muikkuWorkspaceStudents) {
        workspaceUserEntityController.archiveWorkspaceUserEntity(muikkuWorkspaceStudent);
      }
    }

    // Student count in Muikku after synchronizing, which should be the same as in Pyramus before synchronization
    muikkuWorkspaceStudents = workspaceUserEntityController.listWorkspaceUserEntities(workspaceEntity);
    logger.info(String.format("After synchronizing, Muikku course has %d active students", pyramusCourseStudents.size()));

    return null;
  }

  private Long getWorkspaceStudentRoleId() {
    List<WorkspaceRoleEntity> workspaceStudentRoles = roleController.listWorkspaceRoleEntitiesByArchetype(WorkspaceRoleArchetype.STUDENT);
    if (workspaceStudentRoles.size() == 1) {
      return workspaceStudentRoles.get(0).getId();
    } else {
      // TODO: How to choose correct workspace student role?
      throw new RuntimeException("Multiple workspace student roles found.");
    }
  }
  
}

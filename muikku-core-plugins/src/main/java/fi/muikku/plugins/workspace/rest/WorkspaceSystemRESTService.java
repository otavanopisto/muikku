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

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.schooldata.RoleController;
import fi.muikku.schooldata.SchoolDataIdentifier;
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

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @GET
  @Path("/syncworkspaceusers/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response synchronizeWorkspaceUsers(@PathParam("ID") Long workspaceEntityId, @Context Request request) {
    // Admins only
    if (!sessionController.isSuperuser()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    logger.info(String.format("Synchronizing users of workspace entity %d", workspaceEntityId));
    
    // Workspace
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Student role
    WorkspaceRoleEntity workspaceStudentRole = roleController.findWorkspaceRoleEntityById(getWorkspaceStudentRoleId());
    
    // Workspace students in Muikku
    List<WorkspaceUserEntity> muikkuWorkspaceStudents = workspaceUserEntityController.listWorkspaceUserEntitiesByRole(workspaceEntity, workspaceStudentRole);
    logger.info(String.format("Before synchronizing, Muikku course has %d active students", muikkuWorkspaceStudents.size()));
    
    // Course students in Pyramus
    List<WorkspaceUser> pyramusCourseStudents = workspaceController.listWorkspaceStudents(workspaceEntity);
    logger.info(String.format("Before synchronizing, Pyramus course has %d active students", pyramusCourseStudents.size()));
    
    // Loop through Pyramus students
    for (WorkspaceUser pyramusCourseStudent : pyramusCourseStudents) {
      
      String pyramusStudentId = pyramusCourseStudent.getUserIdentifier().getIdentifier();
      String pyramusCourseStudentId = pyramusCourseStudent.getIdentifier().getIdentifier();

      // Find Muikku student corresponding to Pyramus student
      String muikkuWorkspaceStudentId = null;
      WorkspaceUserEntity muikkuWorkspaceStudent = null;
      for (int i = 0; i < muikkuWorkspaceStudents.size(); i++) {
        muikkuWorkspaceStudentId = muikkuWorkspaceStudents.get(i).getIdentifier(); 
        if (StringUtils.equals(muikkuWorkspaceStudentId, pyramusCourseStudentId)) {
          muikkuWorkspaceStudent = muikkuWorkspaceStudents.get(i);
          muikkuWorkspaceStudents.remove(i);
          break;
        }
      }
      
      if (muikkuWorkspaceStudent == null) {
        // Restore an archived workspace student, if possible
        muikkuWorkspaceStudent = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierAndArchived(pyramusCourseStudent.getIdentifier(), Boolean.TRUE);
        if (muikkuWorkspaceStudent != null) {
          workspaceUserEntityController.unarchiveWorkspaceUserEntity(muikkuWorkspaceStudent);
          logger.info(String.format("Unarchived workspace student %s", pyramusCourseStudentId));
          SchoolDataIdentifier muikkuStudentIdentifier = new SchoolDataIdentifier(
              muikkuWorkspaceStudent.getUserSchoolDataIdentifier().getIdentifier(),
              muikkuWorkspaceStudent.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
          ensureCorrectWorkspaceStudent(
              muikkuWorkspaceStudent,
              muikkuStudentIdentifier,
              pyramusCourseStudent.getUserIdentifier());
        }
        else {
          // Workspace student with workspace student identifier still not found, even amongst archived workspace students
          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(
              pyramusCourseStudent.getUserIdentifier());
          if (userSchoolDataIdentifier == null) {
            logger.severe(String.format("Unable to fix missing workspace student: UserSchoolDataIdentifier for Pyramus student %s not found", pyramusStudentId));
          }
          else {
            // Try to find workspace student with workspace + student combo
            muikkuWorkspaceStudent = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(
                workspaceEntity,
                userSchoolDataIdentifier);
            if (muikkuWorkspaceStudent != null) {
              // Found. Might be archived but definitely has the wrong workspace student identifier
              if (muikkuWorkspaceStudent.getArchived()) {
                workspaceUserEntityController.unarchiveWorkspaceUserEntity(muikkuWorkspaceStudent);
              }
              if (!muikkuWorkspaceStudent.getIdentifier().equals(pyramusCourseStudent.getIdentifier().getIdentifier())) {
                workspaceUserEntityController.updateIdentifier(muikkuWorkspaceStudent, pyramusCourseStudent.getIdentifier().getIdentifier());
              }
            }
            else {
              // Not found. Create a new workspace student
              muikkuWorkspaceStudent = workspaceUserEntityController.createWorkspaceUserEntity(
                  userSchoolDataIdentifier,
                  workspaceEntity,
                  pyramusCourseStudentId,
                  workspaceStudentRole);
              logger.info(String.format("Created workspace student %s", muikkuWorkspaceStudent.getIdentifier()));
            }
          }
        }
      }
      else {
        // Workspace student found with workspace student identifier. We still need to ensure that the underlying student is the same as in Pyramus
        SchoolDataIdentifier muikkuStudentIdentifier = new SchoolDataIdentifier(
            muikkuWorkspaceStudent.getUserSchoolDataIdentifier().getIdentifier(),
            muikkuWorkspaceStudent.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
        ensureCorrectWorkspaceStudent(muikkuWorkspaceStudent, muikkuStudentIdentifier, pyramusCourseStudent.getUserIdentifier());
      }
    }
    
    // The remaining Muikku students in muikkuWorkspaceStudents were not in Pyramus so archive them from Muikku
    if (!muikkuWorkspaceStudents.isEmpty()) {
      for (WorkspaceUserEntity muikkuWorkspaceStudent : muikkuWorkspaceStudents) {
        workspaceUserEntityController.archiveWorkspaceUserEntity(muikkuWorkspaceStudent);
      }
      logger.info(String.format("Archived %d Muikku workspace students that were not present in Pyramus", muikkuWorkspaceStudents.size()));
    }

    // Student count in Muikku after synchronizing, which should be the same as in Pyramus before synchronization
    muikkuWorkspaceStudents = workspaceUserEntityController.listWorkspaceUserEntitiesByRole(workspaceEntity, workspaceStudentRole);
    logger.info(String.format("After synchronizing, Muikku course has %d active students", pyramusCourseStudents.size()));

    // Course staff maintenance

    // Teacher role
    WorkspaceRoleEntity workspaceTeacherRole = roleController.findWorkspaceRoleEntityById(getWorkspaceTeacherRoleId());
    
    // Workspace teachers in Muikku
    List<WorkspaceUserEntity> muikkuWorkspaceTeachers = workspaceUserEntityController.listWorkspaceUserEntitiesByRole(workspaceEntity, workspaceTeacherRole);
    logger.info(String.format("Before synchronizing, Muikku course has %d active teachers", muikkuWorkspaceTeachers.size()));

    // Course teachers in Pyramus
    List<WorkspaceUser> pyramusCourseTeachers = workspaceController.listWorkspaceStaffMembers(workspaceEntity);
    logger.info(String.format("Before synchronizing, Pyramus course has %d active teachers", pyramusCourseTeachers.size()));
    
    for (WorkspaceUser pyramusCourseTeacher : pyramusCourseTeachers) {

      String pyramusCourseTeacherId = pyramusCourseTeacher.getIdentifier().getIdentifier();
      String pyramusTeacherId = pyramusCourseTeacher.getUserIdentifier().getIdentifier();
      
      WorkspaceUserEntity muikkuWorkspaceTeacher = null;
      for (int i = 0; i < muikkuWorkspaceTeachers.size(); i++) {
        String muikkuCourseTeacherId = muikkuWorkspaceTeachers.get(i).getIdentifier();
        if (muikkuCourseTeacherId.equals(pyramusCourseTeacherId)) {
          muikkuWorkspaceTeacher = muikkuWorkspaceTeachers.get(i);
          muikkuWorkspaceTeachers.remove(i);
          break;
        }
      }
      if (muikkuWorkspaceTeacher == null) {
        muikkuWorkspaceTeacher = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierAndArchived(
            pyramusCourseTeacher.getIdentifier(),
            Boolean.TRUE);
        if (muikkuWorkspaceTeacher != null) {
          workspaceUserEntityController.unarchiveWorkspaceUserEntity(muikkuWorkspaceTeacher);
          logger.info(String.format("Unarchived workspace teacher %s", pyramusCourseTeacherId));
          if (!muikkuWorkspaceTeacher.getIdentifier().equals(pyramusCourseTeacher.getIdentifier().getIdentifier())) {
            workspaceUserEntityController.updateIdentifier(muikkuWorkspaceTeacher, pyramusCourseTeacher.getIdentifier().getIdentifier());
          }
        }
        else {
          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(
              pyramusCourseTeacher.getUserIdentifier());
          if (userSchoolDataIdentifier == null) {
            logger.severe(String.format("Unable to fix missing workspace teacher: UserSchoolDataIdentifier for Pyramus teacher %s not found", pyramusTeacherId));
          }
          else {
            muikkuWorkspaceTeacher = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserSchoolDataIdentifierIncludeArchived(
                workspaceEntity,
                userSchoolDataIdentifier);
            if (muikkuWorkspaceTeacher != null) {
              if (muikkuWorkspaceTeacher.getArchived()) {
                workspaceUserEntityController.unarchiveWorkspaceUserEntity(muikkuWorkspaceTeacher);
              }
              if (!muikkuWorkspaceTeacher.getIdentifier().equals(pyramusCourseTeacher.getIdentifier().getIdentifier())) {
                workspaceUserEntityController.updateIdentifier(muikkuWorkspaceTeacher, pyramusCourseTeacher.getIdentifier().getIdentifier());
              }
            }
            else {
              muikkuWorkspaceTeacher = workspaceUserEntityController.createWorkspaceUserEntity(
                  userSchoolDataIdentifier,
                  workspaceEntity,
                  pyramusCourseTeacherId,
                  workspaceTeacherRole);
              logger.info(String.format("Created workspace teacher %", muikkuWorkspaceTeacher.getIdentifier()));
            }
          }
        }
      }
    }
    
    // The remaining Muikku teachers in muikkuWorkspaceTeachers were not in Pyramus so archive them from Muikku
    if (!muikkuWorkspaceTeachers.isEmpty()) {
      for (WorkspaceUserEntity muikkuWorkspaceTeacher : muikkuWorkspaceTeachers) {
        workspaceUserEntityController.archiveWorkspaceUserEntity(muikkuWorkspaceTeacher);
      }
      logger.info(String.format("Archived %d Muikku workspace teachers that were not present in Pyramus", muikkuWorkspaceTeachers.size()));
    }

    return null;
  }
  
  private void ensureCorrectWorkspaceStudent(WorkspaceUserEntity muikkuWorkspaceStudent, SchoolDataIdentifier muikkuStudentIdentifier, SchoolDataIdentifier pyramusStudentIdentifier) {
    if (!pyramusStudentIdentifier.equals(muikkuStudentIdentifier)) {
      logger.warning(String.format("Muikku workspace student points to student %s and Pyramus to student %s", muikkuStudentIdentifier, pyramusStudentIdentifier));
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(pyramusStudentIdentifier);
      if (userSchoolDataIdentifier == null) {
        logger.severe(String.format("Unable to fix: UserSchoolDataIdentifier for Pyramus student %s not found", pyramusStudentIdentifier));
      }
      else if (!userSchoolDataIdentifier.getUserEntity().getId().equals(muikkuWorkspaceStudent.getUserSchoolDataIdentifier().getUserEntity().getId())) {
        logger.severe("Unable to fix: UserSchoolDataIdentifiers in Muikku and Pyramus point to different users");
      }
      else {
        // Muikku and Pyramus students are not the same. Let's see if we can find a workspace student with workspace + student combo
        WorkspaceUserEntity existingStudent = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifierIncludeArchived(
            muikkuWorkspaceStudent.getWorkspaceEntity(),
            pyramusStudentIdentifier);
        if (existingStudent != null && !existingStudent.getId().equals(muikkuWorkspaceStudent.getId())) {
          // We can, so delete the workspace student we had and use the one we found instead, unarchiving it if needed 
          if (existingStudent.getArchived()) {
            workspaceUserEntityController.unarchiveWorkspaceUserEntity(existingStudent);
          }
          workspaceUserEntityController.updateIdentifier(existingStudent, muikkuWorkspaceStudent.getIdentifier());
          workspaceUserEntityController.deleteWorkspaceUserEntity(muikkuWorkspaceStudent);
          muikkuWorkspaceStudent = existingStudent;
        }
        // Set workspace student to point at the same student as in Pyramus
        workspaceUserEntityController.updateUserSchoolDataIdentifier(muikkuWorkspaceStudent, userSchoolDataIdentifier);
        logger.info("Muikku workspace student UserSchoolDataIdentifier updated");
      }
    }
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
  
  private Long getWorkspaceTeacherRoleId() {
    String teacherRoleSetting = pluginSettingsController.getPluginSetting("school-data-pyramus", "roles.workspace.TEACHER");
    if (StringUtils.isNumeric(teacherRoleSetting)) {
      return Long.parseLong(teacherRoleSetting);
    }
    else {
      throw new RuntimeException("school-data-pyramus/roles.workspace.TEACHER not set");
    }
  }
  
}

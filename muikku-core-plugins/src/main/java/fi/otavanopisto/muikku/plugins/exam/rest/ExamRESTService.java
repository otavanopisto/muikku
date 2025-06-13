package fi.otavanopisto.muikku.plugins.exam.rest;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.exam.ExamController;
import fi.otavanopisto.muikku.plugins.exam.model.ExamAttendance;
import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspace/exam")
@RestCatchSchoolDataExceptions
public class ExamRESTService {
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private ExamController examController;
  
  @Path("/start/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response startExam(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    ExamSettingsRestModel settingsJson = examController.getSettingsJson(workspaceFolderId);
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    
    // Various access checks
    
    if (!settingsJson.getOpenForAll() && attendance == null) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (attendance != null && attendance.getEnded() != null && !settingsJson.getAllowMultipleAttempts()) {
      return Response.status(Status.BAD_REQUEST).entity("Exam already done").build();
    }
    if (attendance != null && attendance.getStarted() != null && attendance.getEnded() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Exam already started").build();
    }
    
    // Let's go! Godspeed!
    
    examController.startExam(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    
    // Return attendance info with exam contents and everything
    
    return Response.ok().entity(getAttendance(workspaceFolderId)).build();
  }

  @Path("/end/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response endExam(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());

    // Various access checks
    
    if (attendance == null) {
      return Response.status(Status.BAD_REQUEST).entity("Attendance not found").build();
    }
    
    // Only end an exam if it hasn't been ended yet. Not an error as the backend might already have done so
    
    if (attendance != null && attendance.getEnded() == null) {
      examController.endExam(workspaceFolderId, sessionController.getLoggedUserEntity().getId(), new Date());
    }

    // Return attendance info with exam contents and everything
    
    return Response.ok().entity(getAttendance(workspaceFolderId)).build();
  }

  @Path("/attendance/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listContents(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    return Response.ok().entity(getAttendance(workspaceFolderId)).build();
  }

  @Path("/attendees/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAttendees(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    // TODO Staff endpoint for listing attendees of a limited exam
    return Response.noContent().build();
  }
  
  private ExamAttendanceRestModel getAttendance(Long workspaceFolderId) {
    ExamSettingsRestModel settingsJson = examController.getSettingsJson(workspaceFolderId);
    ExamAttendanceRestModel attendance = new ExamAttendanceRestModel();
    attendance.setContents(Collections.emptyList());
    ExamAttendance attendanceEntity = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    if (attendanceEntity != null) {
      if (attendanceEntity.getStarted() != null) {
        attendance.setStarted(toOffsetDateTime(attendanceEntity.getStarted()));
      }
      if (attendanceEntity.getEnded() != null) {
        attendance.setEnded(toOffsetDateTime(attendanceEntity.getEnded()));
        attendance.setAllowRestart(settingsJson.getAllowMultipleAttempts());
      }
      // Exam is either ongoing or has been done, so list its contents
      if (attendance.getStarted() != null || attendance.getEnded() != null) {
        WorkspaceFolder folder = workspaceMaterialController.findWorkspaceFolderById(workspaceFolderId);
        List<WorkspaceNode> nodes = workspaceMaterialController.listVisibleWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(folder, WorkspaceFolderType.DEFAULT);
        List<ContentNode> contentNodes = new ArrayList<>();
        // See if assignment randomization is used
        boolean randomInPlay = settingsJson.getRandom() != ExamSettingsRandom.NONE && !StringUtils.isEmpty(attendanceEntity.getWorkspaceMaterialIds());
        Set<Long> randomAssignmentIds = null;
        if (randomInPlay) {
          randomAssignmentIds = Stream.of(attendanceEntity.getWorkspaceMaterialIds().split(",")).map(Long::parseLong).collect(Collectors.toSet());
        }
        for (WorkspaceNode node : nodes) {
          // Skip assignments that were not randomly selected for the student 
          if (randomInPlay && node instanceof WorkspaceMaterial && ((WorkspaceMaterial) node).isAssignment() && !randomAssignmentIds.contains(node.getId())) {
            continue;
          }
          contentNodes.add(workspaceMaterialController.createContentNode(node, null));
        }
        // Since we probably skipped quite a few assignments, adjust content node sibling ids manually
        for (int i = 1; i < contentNodes.size(); i++) {
          contentNodes.get(i).setNextSiblingId(contentNodes.get(i - 1).getMaterialId());
        }
        attendance.setContents(contentNodes);
      }
    }
    return attendance;
  }
  
  private OffsetDateTime toOffsetDateTime(Date date) {
    Instant instant = date.toInstant();
    ZoneId systemId = ZoneId.systemDefault();
    ZoneOffset offset = systemId.getRules().getOffset(instant);
    return date.toInstant().atOffset(offset);
  }

}

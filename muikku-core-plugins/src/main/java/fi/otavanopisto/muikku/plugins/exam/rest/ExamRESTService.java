package fi.otavanopisto.muikku.plugins.exam.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.exam.ExamController;
import fi.otavanopisto.muikku.plugins.exam.model.ExamAttendance;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceCompositeReply;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceCompositeReplyLock;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private UserEntityController userEntityController;
  
  @Inject
  private ExamController examController;
  
  @Inject
  private EvaluationController evaluationController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Path("/compositeReplies/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getCompositeReplies(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    List<WorkspaceCompositeReply> result = new ArrayList<>();
    ExamAttendance attendanceEntity = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    if (attendanceEntity != null) {
      Set<Long> chosenAssignmentIds = new HashSet<>();
      String assignmentIdStr = attendanceEntity.getWorkspaceMaterialIds();
      if (!StringUtils.isEmpty(assignmentIdStr)) {
        chosenAssignmentIds = Stream.of(assignmentIdStr.split(",")).map(Long::parseLong).collect(Collectors.toSet());
      }
      for (Long id : chosenAssignmentIds) {
        WorkspaceMaterial material = workspaceMaterialController.findWorkspaceMaterialById(id);
        WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(material, sessionController.getLoggedUserEntity());
        List<WorkspaceMaterialFieldAnswer> answers = new ArrayList<>();
        List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(reply.getWorkspaceMaterial());
        for (WorkspaceMaterialField field : fields) {
          try {
            String value = workspaceMaterialFieldController.retrieveFieldValue(field, reply);
            WorkspaceMaterialFieldAnswer answer = new WorkspaceMaterialFieldAnswer(reply.getWorkspaceMaterial().getId(), material.getId(), field.getEmbedId(), field.getQueryField().getName(), value);
            answers.add(answer);
          }
          catch (WorkspaceFieldIOException e) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Error retrieving field answers: %s", e.getMessage())).build();
          }
        }

        WorkspaceCompositeReply compositeReply = new WorkspaceCompositeReply(
            reply.getWorkspaceMaterial().getId(),
            reply.getId(),
            reply.getState(),
            reply.getSubmitted(),
            answers,
            WorkspaceCompositeReplyLock.NONE);

        // Evaluation info for evaluable materials

        if (reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED ||
            reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.EXERCISE ||
            reply.getWorkspaceMaterial().getAssignmentType() == WorkspaceMaterialAssignmentType.INTERIM_EVALUATION) {
          compositeReply.setEvaluationInfo(evaluationController.getEvaluationInfo(sessionController.getLoggedUserEntity().getId(), reply.getWorkspaceMaterial().getId()));
        }

        result.add(compositeReply);
      }
    }
    return Response.ok(result).build();
  }

  @Path("/settings/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getSettings(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    return Response.ok().entity(examController.getSettingsJson(workspaceFolderId)).build();
  }

  @Path("/allSettings/{WORKSPACEENTITYID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAllSettings(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<ExamSettingsRestModel> settings = new ArrayList<>();
    List<Long> examIds = examController.listExamIds(workspaceEntityId);
    for (Long examId : examIds) {
      settings.add(examController.getSettingsJson(examId));
    }
    return Response.ok().entity(settings).build();
  }

  @Path("/settings/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateSettings(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId, ExamSettingsRestModel settings) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    examController.createOrUpdateSettings(workspaceFolderId, settings);
    return Response.ok().entity(settings).build();
  }
  
  @Path("/start/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response startExam(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    
    // Access check
    
    WorkspaceNode node = workspaceMaterialController.findWorkspaceNodeById(workspaceFolderId);
    WorkspaceEntity workspaceEntity = workspaceMaterialController.findWorkspaceEntityByNode(node);
    WorkspaceUserEntity user = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    if (user == null) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Well, let's check overdue here as well :(
    
    endOverdueExam(workspaceFolderId);
    
    ExamSettingsRestModel settingsJson = examController.getSettingsJson(workspaceFolderId);
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    
    // Let's assume this endpoint will actually do what it is told
    
    boolean actuallyStartTheExam = true;
    if (!settingsJson.getOpenForAll() && attendance == null) {
      // You're trying to start an exam you're not part of
      return Response.status(Status.FORBIDDEN).build();
    }
    else if (attendance != null && attendance.getEnded() != null && !settingsJson.getAllowMultipleAttempts()) {
      // You're trying to start an exam that has already ended and no restarts are allowed
      actuallyStartTheExam = false;
    }
    if (attendance != null && attendance.getStarted() != null && attendance.getEnded() == null) {
      // You're trying to start an exam that has already been started
      actuallyStartTheExam = false;
    }
    
    // Potentially let's go! Godspeed!
    
    if (actuallyStartTheExam) {
      examController.startExam(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    }
    
    // Return attendance info with exam contents and everything
    
    return Response.ok().entity(examController.toRestModel(workspaceFolderId, sessionController.getLoggedUserEntity().getId(), false, true)).build();
  }

  @Path("/end/{WORKSPACEFOLDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response endExam(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {

    // Access check
    
    WorkspaceNode node = workspaceMaterialController.findWorkspaceNodeById(workspaceFolderId);
    WorkspaceEntity workspaceEntity = workspaceMaterialController.findWorkspaceEntityByNode(node);
    WorkspaceUserEntity user = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    if (user == null) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
    if (attendance == null) {
      return Response.status(Status.BAD_REQUEST).entity("Attendance not found").build();
    }
    
    // Only end an exam if it hasn't been ended yet. Not an error as the backend might already have done so
    
    if (attendance != null && attendance.getEnded() == null) {
      examController.endExam(workspaceFolderId, sessionController.getLoggedUserEntity().getId(), new Date());
    }

    // Return attendance info with exam contents and everything
    
    return Response.ok().entity(examController.toRestModel(workspaceFolderId, sessionController.getLoggedUserEntity().getId(), false, true)).build();
  }

  @Path("/attendance/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAttendance(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    // This is as good a place as any to determine if an attendee has gone over the exam time limit.
    // Front-end should enforce this as well but if the student, for example, leaves during the exam,
    // this ensures that an overdue exam is marked as ended
    endOverdueExam(workspaceFolderId);
    return Response.ok().entity(examController.toRestModel(workspaceFolderId, sessionController.getLoggedUserEntity().getId(), false, true)).build();
  }

  @Path("/attendances/{WORKSPACEENTITYID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getAttendances(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    List<ExamAttendanceRestModel> attendances = new ArrayList<>();
    List<Long> examIds = examController.listExamIds(workspaceEntityId, sessionController.getLoggedUserEntity().getId());
    for (Long examId : examIds) {
      endOverdueExam(examId);
      attendances.add(examController.toRestModel(examId, sessionController.getLoggedUserEntity().getId(), false, true));
    }
    return Response.ok().entity(attendances).build();
  }

  @Path("/attendees/{WORKSPACEFOLDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAttendees(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<ExamAttendeeRestModel> attendees = new ArrayList<>();
    List<ExamAttendance> attendances = examController.listAttendees(workspaceFolderId);
    for (ExamAttendance attendance : attendances) {
      attendees.add(examController.toRestModel(attendance));
    }
    attendees.sort(Comparator.comparing(ExamAttendeeRestModel::getLastName).thenComparing(ExamAttendeeRestModel::getFirstName));
    return Response.ok().entity(attendees).build();
  }

  @Path("/attendees/{WORKSPACEFOLDERID}/user/{USERENTITYID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response addAttendee(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId, @PathParam("USERENTITYID") Long userEntityId) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, userEntityId);
    if (attendance == null) {
      attendance = examController.createAttendance(workspaceFolderId, userEntityId, true);
    }
    return Response.ok().entity(examController.toRestModel(attendance)).build();
  }

  @Path("/attendees/{WORKSPACEFOLDERID}/user/{USERENTITYID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateAttendee(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId, @PathParam("USERENTITYID") Long userEntityId, ExamAttendeeRestModel payload) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, userEntityId);
    if (attendance == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    attendance = examController.updateExtraMinutes(attendance, payload.getExtraMinutes());
    return Response.ok().entity(examController.toRestModel(attendance)).build();
  }

  @Path("/attendees/{WORKSPACEFOLDERID}/user/{USERENTITYID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response removeAttendee(@PathParam("WORKSPACEFOLDERID") Long workspaceFolderId, @PathParam("USERENTITYID") Long userEntityId) {
    if (userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    ExamAttendance attendance = examController.findAttendance(workspaceFolderId, userEntityId);
    if (attendance != null) {
      examController.removeAttendance(attendance);
    }
    return Response.noContent().build();
  }
  
  private void endOverdueExam(Long workspaceFolderId) {
    ExamSettingsRestModel settingsJson = examController.getSettingsJson(workspaceFolderId);
    if (settingsJson.getMinutes() > 0) {
      ExamAttendance attendance = examController.findAttendance(workspaceFolderId, sessionController.getLoggedUserEntity().getId());
      if (attendance != null && attendance.getStarted() != null && attendance.getEnded() == null) {
        // User is an attendee who has started the exam but not yet finished it
        Calendar c = Calendar.getInstance();
        c.setTime(attendance.getStarted());
        c.add(Calendar.MINUTE, settingsJson.getMinutes());
        if (System.currentTimeMillis() > c.getTimeInMillis()) {
          examController.endExam(workspaceFolderId, sessionController.getLoggedUserEntity().getId(), c.getTime());
        }
      }
    }
  }

}

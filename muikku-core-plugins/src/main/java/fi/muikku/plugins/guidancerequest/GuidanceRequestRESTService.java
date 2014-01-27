package fi.muikku.plugins.guidancerequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import edu.emory.mathcs.backport.java.util.Collections;
import fi.muikku.controller.TagController;
import fi.muikku.model.base.Tag;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.plugins.communicator.model.InboxCommunicatorMessage;
import fi.muikku.plugins.forum.ForumController;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.AuthorizationException;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelEntity;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.TranquilizingContext;
import fi.tranquil.instructions.PropertyInjectInstruction.ValueGetter;
import fi.tranquil.instructions.SuperClassInstructionSelector;

@Path("/guidancerequest")
@RequestScoped
@Stateful
@Produces ("application/json")
public class GuidanceRequestRESTService extends PluginRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private GuidanceRequestController guidanceRequestController;
  
  @POST
  @Path ("/createGuidanceRequest")
  public Response createGuidanceRequest(
      @FormParam ("message") String message
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    
    GuidanceRequest guidanceRequest = guidanceRequestController.createGuidanceRequest(
        userEntity, new Date(), message);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(guidanceRequest)
    ).build();
  }

  @POST
  @Path ("/createWorkspaceGuidanceRequest")
  public Response createWorkspaceGuidanceRequest(
      @FormParam ("workspaceId") Long workspaceId,
      @FormParam ("message") String message
   ) throws AuthorizationException {
    UserEntity userEntity = sessionController.getUser();
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
    
    GuidanceRequest guidanceRequest = guidanceRequestController.createWorkspaceGuidanceRequest(
        workspaceEntity, userEntity, new Date(), message);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
      
    return Response.ok(
      tranquility.entity(guidanceRequest)
    ).build();
  }
  
}

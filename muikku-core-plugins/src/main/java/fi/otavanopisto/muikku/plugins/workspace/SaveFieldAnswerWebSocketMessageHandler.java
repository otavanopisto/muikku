package fi.otavanopisto.muikku.plugins.workspace;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.QueryFieldController;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;
import fi.otavanopisto.muikku.plugins.websocket.MuikkuWebSocketEvent;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessage;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessageEvent;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.users.UserEntityController;

public class SaveFieldAnswerWebSocketMessageHandler {
  
  @Inject
  private Logger logger;

  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private MaterialController materialController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private QueryFieldController queryFieldController;
  
  public void handleError(String error, String embedId, Long materialId, String fieldName, Long workspaceMaterialId, Long workspaceEntityId, String ticket){
    ObjectMapper mapper = new ObjectMapper();
    SaveFieldErrorWebSocketMessage message = new SaveFieldErrorWebSocketMessage(error, embedId, materialId, fieldName, workspaceMaterialId, workspaceEntityId);

    try {
      String data = mapper.writeValueAsString(message);
      webSocketMessenger.sendMessage("workspace:field-answer-error", data, ticket);
    } catch (IOException e) {
        logger.log(Level.SEVERE, "Failed to send error message");
    }    
  }
  
  public void handleMessage(@Observes @MuikkuWebSocketEvent("workspace:field-answer-save") WebSocketMessageEvent event) {
    // TODO: Localize error messages
    
    WebSocketMessage webSocketMessage = event.getMessage();
    
    ObjectMapper mapper = new ObjectMapper();

    try {
      SaveFieldAnswerWebSocketMessage message = mapper.readValue((String) webSocketMessage.getData(), SaveFieldAnswerWebSocketMessage.class);
      
      Date now = new Date();
      
      if (message.getMaterialId() == null) {
        logger.log(Level.SEVERE, "Missing material id");
        handleError("Missing material id", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      if (message.getWorkspaceMaterialId() == null) {
        logger.log(Level.SEVERE, "Missing workspace material id");
        handleError("Missing workspace material id", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      if (message.getUserEntityId() == null) {
        logger.log(Level.SEVERE, String.format("Missing user entity id for ticket %s (field %s in workspace material %d)", event.getTicket(), message.getFieldName(), message.getWorkspaceMaterialId()));
        handleError("Missing user entity id", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      Material material = materialController.findMaterialById(message.getMaterialId());
      if (material == null) {
        logger.log(Level.SEVERE, "Could not find material");
        handleError("Could not find material", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      UserEntity userEntity = userEntityController.findUserEntityById(message.getUserEntityId());
      if (userEntity == null) {
        logger.log(Level.SEVERE, "Could not find user");
        handleError("Could not find user", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(message.getWorkspaceMaterialId());
      if (workspaceMaterial == null) {
        logger.log(Level.SEVERE, "Could not find workspace material");
        handleError("Could not find workspace material", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }

      if (!workspaceMaterial.getMaterialId().equals(material.getId())) {
        logger.log(Level.SEVERE, "Invalid materialId or workspaceMaterialId");
        handleError("Invalid materialId or workspaceMaterialId", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(material, message.getFieldName());
      if (queryField == null) {
        logger.log(Level.SEVERE, "Could not find query field");
        handleError("Could not find query field", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }

      WorkspaceMaterialField materialField = workspaceMaterialFieldController.findWorkspaceMaterialFieldByWorkspaceMaterialAndQueryFieldAndEmbedId(workspaceMaterial, queryField, message.getEmbedId());
      if (materialField == null) {
        materialField = workspaceMaterialFieldController.createWorkspaceMaterialField(workspaceMaterial, queryField, message.getEmbedId());
      }
      
      fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
      if (reply == null) {
        reply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, WorkspaceMaterialReplyState.ANSWERED, userEntity, 1l, now, now);
      } else {
        workspaceMaterialReplyController.incWorkspaceMaterialReplyTries(reply);
      }
      
      if (workspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED) {
        switch (reply.getState()) {
          case PASSED:
          case FAILED:
          case SUBMITTED:
            handleError("Assignment is already submitted thus can not be modified", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
            return;
          default:
          break;
        }
      }
      
      try {
        workspaceMaterialFieldController.storeFieldValue(materialField, reply, message.getAnswer());
      } catch (WorkspaceFieldIOException e) {
        logger.log(Level.SEVERE, "Could not store field value", e);
        handleError("Could not store field value", message.getEmbedId(), message.getMaterialId(), message.getFieldName(), message.getWorkspaceMaterialId(), message.getWorkspaceEntityId(), event.getTicket());
        return;
      }
      
      message.setOriginTicket(event.getTicket());
      String data = mapper.writeValueAsString(message);
      webSocketMessenger.sendMessage("workspace:field-answer-saved", data, Arrays.asList(userEntity));
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to unmarshal SaveFieldAnswerWebSocketMessage", e);
    }

  }

}

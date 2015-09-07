package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.QueryFieldController;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.websocket.MuikkuWebSocketEvent;
import fi.muikku.plugins.websocket.WebSocketMessage;
import fi.muikku.plugins.websocket.WebSocketMessageEvent;
import fi.muikku.plugins.websocket.WebSocketMessenger;
import fi.muikku.plugins.workspace.fieldio.WorkspaceFieldIOException;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.users.UserEntityController;

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
  
  public void handleMessage(@Observes @MuikkuWebSocketEvent("workspace:field-answer-save") WebSocketMessageEvent event) {
    WebSocketMessage webSocketMessage = event.getMessage();
    
    ObjectMapper mapper = new ObjectMapper();

    try {
      SaveFieldAnswerWebSocketMessage message = mapper.readValue((String) webSocketMessage.getData(), SaveFieldAnswerWebSocketMessage.class);
      
      Date now = new Date();
      
      Material material = materialController.findMaterialById(message.getMaterialId());
      if (material == null) {
        logger.log(Level.SEVERE, "Could not find material");
        // TODO SEND ERROR MESSAGE
        return;
      }
      
      UserEntity userEntity = userEntityController.findUserEntityById(event.getUserEntityId());
      if (userEntity == null) {
        logger.log(Level.SEVERE, "Could not find user");
        // TODO SEND ERROR MESSAGE
        return;
      }
      
      WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(message.getWorkspaceMaterialId());
      if (workspaceMaterial == null) {
        logger.log(Level.SEVERE, "Could not find workspace material");
        // TODO SEND ERROR MESSAGE
        return;
      }

      if (!workspaceMaterial.getMaterialId().equals(material.getId())) {
        logger.log(Level.SEVERE, "Invalid materialId or workspaceMaterialId");
        // TODO SEND ERROR MESSAGE
        return;
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(material, message.getFieldName());
      if (queryField == null) {
        logger.log(Level.SEVERE, "Could not find query field");
        // TODO SEND ERROR MESSAGE
        return;
      }

      WorkspaceMaterialField materialField = workspaceMaterialFieldController.findWorkspaceMaterialFieldByWorkspaceMaterialAndQueryFieldAndEmbedId(workspaceMaterial, queryField, message.getEmbedId());
      if (materialField == null) {
        materialField = workspaceMaterialFieldController.createWorkspaceMaterialField(workspaceMaterial, queryField, message.getEmbedId());
      }
      
      fi.muikku.plugins.workspace.model.WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
      if (reply == null) {
        reply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, userEntity, 1l, now, now);
      } else {
        workspaceMaterialReplyController.incWorkspaceMaterialReplyTries(reply);
      }
      
      try {
        workspaceMaterialFieldController.storeFieldValue(materialField, reply, message.getAnswer());
      } catch (WorkspaceFieldIOException e) {
        logger.log(Level.SEVERE, "Could not store field value");
        // TODO SEND ERROR MESSAGE
        return;
      }
      
      message.setOriginTicket(event.getTicket());
      String data = mapper.writeValueAsString(message);
      webSocketMessenger.sendMessage("workspace:field-answer-saved", data, Arrays.asList(userEntity.getId()));
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to unmarshal SaveFieldAnswerWebSocketMessage", e);
    }

  }

}

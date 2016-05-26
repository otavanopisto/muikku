package fi.otavanopisto.muikku.plugins.material.coops.websocket;

import java.io.IOException;
import java.io.Reader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.lang3.math.NumberUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.foyt.coops.CoOpsApi;
import fi.foyt.coops.CoOpsConflictException;
import fi.foyt.coops.CoOpsForbiddenException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.foyt.coops.CoOpsNotFoundException;
import fi.foyt.coops.CoOpsUsageException;
import fi.foyt.coops.extensions.websocket.ErrorMessage;
import fi.foyt.coops.extensions.websocket.PatchMessage;
import fi.foyt.coops.extensions.websocket.UpdateMessage;
import fi.foyt.coops.model.Patch;
import fi.otavanopisto.muikku.plugins.material.coops.CoOpsSessionController;
import fi.otavanopisto.muikku.plugins.material.coops.event.CoOpsPatchEvent;
import fi.otavanopisto.muikku.plugins.material.coops.model.CoOpsSession;
import fi.otavanopisto.muikku.plugins.material.coops.model.CoOpsSessionType;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

@ServerEndpoint("/ws/coops/{HTMLMATERIALID}/{SESSIONID}")
@Transactional
public class CoOpsDocumentWebSocket {

  private static final Map<String, Map<String, Session>> fileClients = new HashMap<String, Map<String, Session>>();
  
  @Inject
  private CoOpsSessionController coOpsSessionController;

  @Inject
  private CoOpsApi coOpsApi;

  @OnOpen
  public void onOpen(final Session client, EndpointConfig endpointConfig,
      @PathParam("HTMLMATERIALID") String htmlMaterialId, @PathParam("SESSIONID") String sessionId) throws IOException {
    synchronized (this) {
//      
//  TODO: RequestScope is not available on the websockets, switch to ticket system
//      
//      if (!sessionController.isLoggedIn()) {
//        client.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Permission denied"));
//      }
//      
//      UserEntity userEntity = sessionController.getLoggedUserEntity();
//      
//      EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
//      
//      if (environmentUser.getRole() == null || environmentUser.getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT) {
//        client.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Permission denied"));
//      }

      CoOpsSession session = coOpsSessionController.findSessionBySessionId(sessionId);
      if (session == null) {
        client.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Not Found"));
        return;
      }

      if (!session.getHtmlMaterial().getId().equals(NumberUtils.createLong(htmlMaterialId))) {
        client.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY,
            "Session is associated with another fileId"));
        return;
      }

      Map<String, Session> sessions = fileClients.get(htmlMaterialId);
      if (sessions == null) {
        fileClients.put(htmlMaterialId, new HashMap<String, Session>());
      }

      fileClients.get(htmlMaterialId).put(client.getId(), client);

      coOpsSessionController.updateSessionType(session, CoOpsSessionType.WS);
      HtmlMaterial htmlMaterial = session.getHtmlMaterial();
      Long currentRevisionNumber = htmlMaterial.getRevisionNumber();

      if (session.getJoinRevision() < currentRevisionNumber) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Patch> patches;
        try {
          patches = coOpsApi.fileUpdate(session.getHtmlMaterial().getId().toString(), session.getSessionId(),
              session.getJoinRevision());
          for (Patch patch : patches) {
            sendPatch(client, patch);
          }
        } catch (CoOpsInternalErrorException e) {
          client.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, "Internal Error"));
        } catch (CoOpsUsageException e) {
          client.getAsyncRemote().sendText(
              objectMapper.writeValueAsString(new ErrorMessage("patchError", 400, e.getMessage())));
        } catch (CoOpsNotFoundException e) {
          client.getAsyncRemote().sendText(
              objectMapper.writeValueAsString(new ErrorMessage("patchError", 404, e.getMessage())));
        } catch (CoOpsForbiddenException e) {
          client.getAsyncRemote().sendText(
              objectMapper.writeValueAsString(new ErrorMessage("patchError", 500, e.getMessage())));
        }
      }
    }
  }

  @OnClose
  public void onClose(final Session session, CloseReason closeReason, @PathParam("HTMLMATERIALID") String fileId,
      @PathParam("SESSIONID") String sessionId) {
    synchronized (this) {
      fileClients.get(fileId).remove(session.getId());

      CoOpsSession coOpsSession = coOpsSessionController.findSessionBySessionId(sessionId);
      if (coOpsSession != null) {
        closeSession(coOpsSession);
      }
    }
  }

  @OnMessage
  public void onMessage(Reader messageReader, Session client, @PathParam("HTMLMATERIALID") String fileId,
      @PathParam("SESSIONID") String sessionId) throws IOException {
    CoOpsSession session = coOpsSessionController.findSessionBySessionId(sessionId);
    if (session == null) {
      client.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Not Found"));
      return;
    }

    if (!session.getHtmlMaterial().getId().equals(NumberUtils.createLong(fileId))) {
      client
          .close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Session is associated with another fileId"));
      return;
    }

    ObjectMapper objectMapper = new ObjectMapper();

    try {
      PatchMessage patchMessage;

      try {
        patchMessage = objectMapper.readValue(messageReader, PatchMessage.class);
      } catch (IOException e) {
        throw new CoOpsInternalErrorException(e);
      }

      if (patchMessage == null) {
        throw new CoOpsInternalErrorException("Could not parse message");
      }

      if (!patchMessage.getType().equals("patch")) {
        throw new CoOpsInternalErrorException("Unknown message type: " + patchMessage.getType());
      }

      Patch patch = patchMessage.getData();

      coOpsApi.filePatch(fileId, patch.getSessionId(), patch.getRevisionNumber(), patch.getPatch(),
          patch.getProperties(), patch.getExtensions());
    } catch (CoOpsInternalErrorException e) {
      client.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, "Internal Error"));
    } catch (CoOpsUsageException e) {
      client.getAsyncRemote().sendText(
          objectMapper.writeValueAsString(new ErrorMessage("patchError", 400, e.getMessage())));
    } catch (CoOpsNotFoundException e) {
      client.getAsyncRemote().sendText(
          objectMapper.writeValueAsString(new ErrorMessage("patchError", 404, e.getMessage())));
    } catch (CoOpsConflictException e) {
      client.getAsyncRemote().sendText(
          objectMapper.writeValueAsString(new ErrorMessage("patchRejected", 409, "Conflict")));
    } catch (CoOpsForbiddenException e) {
      client.getAsyncRemote().sendText(
          objectMapper.writeValueAsString(new ErrorMessage("patchError", 500, e.getMessage())));
    }
  }

  public void onCoOpsPatch(@Observes CoOpsPatchEvent event) throws JsonGenerationException, JsonMappingException,
      IOException {
    synchronized (this) {
      Map<String, Session> clients = fileClients.get(event.getHtmlMaterialId());
      if (clients != null) {
        for (Session client : clients.values()) {
          sendPatch(client, event.getPatch());
        }
      }
    }
  }

  private void sendPatch(Session client, Patch patch) throws JsonGenerationException, JsonMappingException, IOException {
    UpdateMessage updateMessage = new UpdateMessage(patch);
    String message = (new ObjectMapper()).writeValueAsString(updateMessage);
    client.getAsyncRemote().sendText(message);
  }

  private void closeSession(CoOpsSession session) {
    coOpsSessionController.closeSession(session);
  }

}
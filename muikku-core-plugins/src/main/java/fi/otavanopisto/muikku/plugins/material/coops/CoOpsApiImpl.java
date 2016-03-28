package fi.otavanopisto.muikku.plugins.material.coops;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.codehaus.jackson.map.ObjectMapper;

import fi.foyt.coops.CoOpsConflictException;
import fi.foyt.coops.CoOpsForbiddenException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.foyt.coops.CoOpsNotFoundException;
import fi.foyt.coops.CoOpsNotImplementedException;
import fi.foyt.coops.CoOpsUsageException;
import fi.foyt.coops.model.File;
import fi.foyt.coops.model.Join;
import fi.foyt.coops.model.Patch;
import fi.otavanopisto.muikku.environment.HttpPort;
import fi.otavanopisto.muikku.environment.HttpsPort;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.coops.event.CoOpsPatchEvent;
import fi.otavanopisto.muikku.plugins.material.coops.model.CoOpsSession;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionExtensionProperty;
import fi.otavanopisto.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.session.SessionController;

@Dependent
@Stateless
public class CoOpsApiImpl implements fi.foyt.coops.CoOpsApi {

  private final static String COOPS_PROTOCOL_VERSION = "1.0.0";
  
  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private CoOpsSessionController coOpsSessionController;
  
  @Inject
  private CoOpsSessionEventsController coOpsSessionEventsController;
  
  @Inject
  private Event<CoOpsPatchEvent> patchEvent;

  @Inject
  private HttpServletRequest httpRequest;

  @Inject
  private SessionController sessionController;

  @Inject
  @HttpPort
  private Integer httpPort;
  
  @Inject
  @HttpsPort
  private Integer httpsPort;
  
  public File fileGet(String fileId, Long revisionNumber) throws CoOpsNotImplementedException, CoOpsNotFoundException, CoOpsUsageException, CoOpsInternalErrorException, CoOpsForbiddenException {
    HtmlMaterial htmlMaterial = findFile(fileId);
    
    if (htmlMaterial == null) {
      throw new CoOpsNotFoundException();
    }

    if (revisionNumber != null) {
      String data = htmlMaterialController.getRevisionHtml(htmlMaterial, revisionNumber);
      Map<String, String> properties = htmlMaterialController.getRevisionProperties(htmlMaterial, revisionNumber);
      return new File(revisionNumber, data, htmlMaterial.getContentType(), properties);
    } else {
      Long maxRevisionNumber = htmlMaterialController.lastHtmlMaterialRevision(htmlMaterial);
      String data = htmlMaterialController.getRevisionHtml(htmlMaterial, maxRevisionNumber);
      Map<String, String> properties = htmlMaterialController.getRevisionProperties(htmlMaterial, maxRevisionNumber);
      return new File(maxRevisionNumber, data, htmlMaterial.getContentType(), properties);
    }
  }

  public List<Patch> fileUpdate(String fileId, String sessionId, Long revisionNumber) throws CoOpsNotFoundException, CoOpsInternalErrorException, CoOpsUsageException, CoOpsForbiddenException {
    CoOpsSession session = coOpsSessionController.findSessionBySessionId(sessionId);
    if (session == null) {
      throw new CoOpsUsageException("Invalid session id"); 
    }
    
    if (revisionNumber == null) {
      throw new CoOpsUsageException("revisionNumber parameter is missing");
    }
    
    HtmlMaterial htmlMaterial = findFile(fileId);
    
    if (htmlMaterial == null) {
      throw new CoOpsNotFoundException();
    }

    List<Patch> updateResults = new ArrayList<>();

    List<HtmlMaterialRevision> htmlMaterialRevisions = htmlMaterialController.listRevisionsAfter(htmlMaterial, revisionNumber);

    if (!htmlMaterialRevisions.isEmpty()) {
      for (HtmlMaterialRevision htmlMaterialRevision : htmlMaterialRevisions) {
        String patch = htmlMaterialRevision.getData();
        
        Map<String, String> properties = null;
        Map<String, Object> extensions = null;
        
        List<HtmlMaterialRevisionProperty> revisionProperties = htmlMaterialController.listRevisionProperties(htmlMaterialRevision);
        if (revisionProperties.size() > 0) {
          properties = new HashMap<>();
          for (HtmlMaterialRevisionProperty revisionProperty : revisionProperties) {
            properties.put(revisionProperty.getKey(), revisionProperty.getValue());
          }
        }
        
        List<HtmlMaterialRevisionExtensionProperty> revisionExtensionProperties = htmlMaterialController.listRevisionExtensionProperties(htmlMaterialRevision);
        if (revisionExtensionProperties.size() > 0) {
          extensions = new HashMap<>();
          for (HtmlMaterialRevisionExtensionProperty revisionExtensionProperty : revisionExtensionProperties) {
            extensions.put(revisionExtensionProperty.getKey(), revisionExtensionProperty.getValue());
          }
        }
        
        if (patch != null) {
          updateResults.add(new Patch(htmlMaterialRevision.getSessionId(), htmlMaterialRevision.getRevision(), htmlMaterialRevision.getChecksum(), patch, properties, extensions));
        } else {
          updateResults.add(new Patch(htmlMaterialRevision.getSessionId(), htmlMaterialRevision.getRevision(), null, null, properties, extensions));
        }
      }    
    }

    return updateResults;
  }

  public void filePatch(String fileId, String sessionId, Long revisionNumber, String patch, Map<String, String> properties, Map<String, Object> extensions) throws CoOpsInternalErrorException, CoOpsUsageException, CoOpsNotFoundException, CoOpsConflictException, CoOpsForbiddenException {
    CoOpsSession session = coOpsSessionController.findSessionBySessionId(sessionId);
    if (session == null) {
      throw new CoOpsUsageException("Invalid session id"); 
    }
    
    CoOpsDiffAlgorithm algorithm = htmlMaterialController.findAlgorithm(session.getAlgorithm());
    if (algorithm == null) {
      throw new CoOpsUsageException("Algorithm is not supported by this server");
    }
 
    HtmlMaterial htmlMaterial = findFile(fileId);
    
    Long maxRevision = htmlMaterialController.lastHtmlMaterialRevision(htmlMaterial);
    if (maxRevision == null) {
      maxRevision = 0l;
    }

    if (!maxRevision.equals(revisionNumber)) {
      throw new CoOpsConflictException();
    }
    
    ObjectMapper objectMapper = new ObjectMapper();
    
    String checksum = null;
    
    if (StringUtils.isNotBlank(patch)) {
      String data = htmlMaterialController.getRevisionHtml(htmlMaterial, maxRevision);
      if (data == null) {
        data = "";
      }
      String patched = algorithm.patch(data, patch);
      checksum = DigestUtils.md5Hex(patched);
    } 
    
    Long patchRevisionNumber = maxRevision + 1;
    HtmlMaterialRevision htmlMaterialRevision = htmlMaterialController.createRevision(htmlMaterial, sessionId, patchRevisionNumber, new Date(), patch, checksum);
    
    if (properties != null) {
      for (String key : properties.keySet()) {
        String value = properties.get(key);
        htmlMaterialController.createRevisionProperty(htmlMaterialRevision, key, value);
      }
    }
    
    if (extensions != null) {
      for (String key : extensions.keySet()) {
        String value;
        
        try {
          value = objectMapper.writeValueAsString(extensions.get(key));
        } catch (IOException e) {
          throw new CoOpsInternalErrorException(e);
        }
        
        htmlMaterialController.createRevisionExtensionProperty(htmlMaterialRevision, key, value);
      }
    }
    
    patchEvent.fire(new CoOpsPatchEvent(fileId,
                                        new Patch(sessionId,
                                                  patchRevisionNumber,
                                                  checksum,
                                                  patch,
                                                  properties,
                                                  extensions)));
  }

  public Join fileJoin(String fileId, List<String> algorithms, String protocolVersion) throws CoOpsNotFoundException, CoOpsNotImplementedException, CoOpsInternalErrorException, CoOpsForbiddenException, CoOpsUsageException {
    HtmlMaterial htmlMaterial = findFile(fileId);
    
    if (!COOPS_PROTOCOL_VERSION.equals(protocolVersion)) {
      throw new CoOpsNotImplementedException("Protocol version mismatch. Client is using " + protocolVersion + " and server " + COOPS_PROTOCOL_VERSION);
    }
    
    if (algorithms == null || algorithms.isEmpty()) {
      throw new CoOpsInternalErrorException("Invalid request");
    }
    
    CoOpsDiffAlgorithm algorithm = htmlMaterialController.findAlgorithm(algorithms);
    if (algorithm == null) {
      throw new CoOpsNotImplementedException("Server and client do not have a commonly supported algorithm.");
    }

    Long currentRevision = htmlMaterialController.lastHtmlMaterialRevision(htmlMaterial);
    String data = htmlMaterialController.getRevisionHtml(htmlMaterial, currentRevision);
    if (data == null) {
      data = "";
    }

    Map<String, String> properties = htmlMaterialController.getRevisionProperties(htmlMaterial, currentRevision);
    // TODO: Extension properties...
    Map<String, Object> extensions = new HashMap<>();
    String sessionId = UUID.randomUUID().toString();
    
    CoOpsSession coOpsSession = coOpsSessionController.createSession(htmlMaterial, sessionController.getLoggedUserEntity(), sessionId, currentRevision, algorithm.getName());
    
    addSessionEventsExtension(htmlMaterial, extensions);
    addWebSocketExtension(htmlMaterial, extensions, coOpsSession);

    return new Join(coOpsSession.getSessionId(), coOpsSession.getAlgorithm(), coOpsSession.getJoinRevision(), data, htmlMaterial.getContentType(), properties, extensions);
  }
  
  private void addWebSocketExtension(HtmlMaterial htmlMaterial, Map<String, Object> extensions, CoOpsSession coOpsSession) {
    String wsUrl = String.format("ws://%s:%s%s/ws/coops/%d/%s", 
      httpRequest.getServerName(), 
      httpPort, 
      httpRequest.getContextPath(), 
      htmlMaterial.getId(), 
      coOpsSession.getSessionId());
    
    String wssUrl = String.format("wss://%s:%s%s/ws/coops/%d/%s", 
        httpRequest.getServerName(), 
        httpsPort, 
        httpRequest.getContextPath(), 
        htmlMaterial.getId(), 
        coOpsSession.getSessionId());
    
    Map<String, Object> webSocketExtension = new HashMap<>();
    webSocketExtension.put("ws", wsUrl);
    webSocketExtension.put("wss", wssUrl);
    
    extensions.put("webSocket", webSocketExtension);
  }

  private void addSessionEventsExtension(HtmlMaterial htmlMaterial, Map<String, Object> extensions) {
    List<CoOpsSession> openSessions = coOpsSessionController.listSessionsByHtmlMaterialAndClosed(htmlMaterial, Boolean.FALSE);
    extensions.put("sessionEvents", coOpsSessionEventsController.createSessionEvents(openSessions, "OPEN"));
  }

  private HtmlMaterial findFile(String fileId) throws CoOpsUsageException, CoOpsNotFoundException {
    if (!StringUtils.isNumeric(fileId)) {
      throw new CoOpsUsageException("fileId must be a number");
    }
    
    Long id = NumberUtils.createLong(fileId);
    if (id == null) {
      throw new CoOpsUsageException("fileId must be a number");
    }
    
    HtmlMaterial file = htmlMaterialController.findHtmlMaterialById(id);
    if (file == null) {
      throw new CoOpsNotFoundException();
    }
    
    return file;
  }
}

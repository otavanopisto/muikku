package fi.muikku.plugins.material.coops;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
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
import fi.muikku.plugins.material.coops.dao.CoOpsSessionDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialExtensionPropertyDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialPropertyDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionExtensionPropertyDAO;
import fi.muikku.plugins.material.coops.dao.HtmlMaterialRevisionPropertyDAO;
import fi.muikku.plugins.material.coops.event.CoOpsPatchEvent;
import fi.muikku.plugins.material.coops.model.CoOpsSession;
import fi.muikku.plugins.material.coops.model.CoOpsSessionType;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.coops.model.HtmlMaterialExtensionProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevision;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevisionExtensionProperty;
import fi.muikku.plugins.material.coops.model.HtmlMaterialRevisionProperty;
import fi.muikku.plugins.material.dao.HtmlMaterialDAO;

@Dependent
@Stateless
public class CoOpsApiImpl implements fi.foyt.coops.CoOpsApi {

  private final static String COOPS_PROTOCOL_VERSION = "1.0.0";
  
  @Inject
  @Any
  private Instance<CoOpsDiffAlgorithm> algorithms;

  @Inject
  private HtmlMaterialDAO htmlMaterialDAO;

  @Inject
  private HtmlMaterialPropertyDAO htmlMaterialPropertyDAO;

  @Inject
  private HtmlMaterialExtensionPropertyDAO htmlMaterialExtensionPropertyDAO;

  @Inject
  private HtmlMaterialRevisionDAO htmlMaterialRevisionDAO;

  @Inject
  private HtmlMaterialRevisionPropertyDAO htmlMaterialRevisionPropertyDAO;

  @Inject
  private HtmlMaterialRevisionExtensionPropertyDAO htmlMaterialRevisionExtensionPropertyDAO;

  @Inject
  private CoOpsSessionController coOpsSessionController;
  
  @Inject
  private CoOpsSessionEventsController coOpsSessionEventsController;
  
  @Inject
  private Event<CoOpsPatchEvent> patchEvent;

  @Inject
  private HttpServletRequest httpRequest;
  
  public File fileGet(String fileId, Long revisionNumber) throws CoOpsNotImplementedException, CoOpsNotFoundException, CoOpsUsageException, CoOpsInternalErrorException, CoOpsForbiddenException {
    HtmlMaterial htmlMaterial = findFile(fileId);
    
    if (htmlMaterial == null) {
      throw new CoOpsNotFoundException();
    }

    if (revisionNumber != null) {
      // TODO: Implement
      throw new CoOpsNotImplementedException();
    } else {
      Long currentRevisionNumber = htmlMaterial.getRevisionNumber();
      String data = htmlMaterial.getHtml();
      List<HtmlMaterialProperty> fileProperties = htmlMaterialPropertyDAO.listByHtmlMaterial(htmlMaterial);
      Map<String, String> properties = new HashMap<String, String>();
      
      for (HtmlMaterialProperty fileProperty : fileProperties) {
        properties.put(fileProperty.getKey(),fileProperty.getValue());
      }
      
      return new File(currentRevisionNumber, data, htmlMaterial.getContentType(), properties);
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
    
    HtmlMaterial file = findFile(fileId);
    
    if (file == null) {
      throw new CoOpsNotFoundException();
    }

    List<Patch> updateResults = new ArrayList<>();

    List<HtmlMaterialRevision> htmlMaterialRevisions = htmlMaterialRevisionDAO.listByFileAndRevisionGreaterThan(file, revisionNumber);

    if (!htmlMaterialRevisions.isEmpty()) {
      for (HtmlMaterialRevision htmlMaterialRevision : htmlMaterialRevisions) {
        String patch = htmlMaterialRevision.getData();
        
        Map<String, String> properties = null;
        Map<String, Object> extensions = null;
        
        List<HtmlMaterialRevisionProperty> revisionProperties = htmlMaterialRevisionPropertyDAO.listByHtmlMaterialRevision(htmlMaterialRevision);
        if (revisionProperties.size() > 0) {
          properties = new HashMap<>();
          for (HtmlMaterialRevisionProperty revisionProperty : revisionProperties) {
            properties.put(revisionProperty.getKey(), revisionProperty.getValue());
          }
        }
        
        List<HtmlMaterialRevisionExtensionProperty> revisionExtensionProperties = htmlMaterialRevisionExtensionPropertyDAO.listByHtmlMaterialRevision(htmlMaterialRevision);
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
    
    CoOpsDiffAlgorithm algorithm = findAlgorithm(session.getAlgorithm());
    if (algorithm == null) {
      throw new CoOpsUsageException("Algorithm is not supported by this server");
    }
 
    HtmlMaterial htmlMaterial = findFile(fileId);
    
    Long currentRevision = htmlMaterial.getRevisionNumber();
    if (!currentRevision.equals(revisionNumber)) {
      throw new CoOpsConflictException();
    }
    
    ObjectMapper objectMapper = new ObjectMapper();
    
    String checksum = null;
    String patched = null;
    
    if (StringUtils.isNotBlank(patch)) {
      String data = htmlMaterial.getHtml();
      if (data == null) {
        data = "";
      }
      
      patched = algorithm.patch(data, patch);
      checksum = DigestUtils.md5Hex(patched);
      htmlMaterialDAO.updateData(htmlMaterial, patched);
    } 
    
    Long patchRevisionNumber = currentRevision + 1;
    HtmlMaterialRevision htmlMaterialRevision = htmlMaterialRevisionDAO.create(htmlMaterial, sessionId, patchRevisionNumber, new Date(), patch, checksum);
    htmlMaterialDAO.updateRevisionNumber(htmlMaterial, patchRevisionNumber);

    if (properties != null) {
      for (String key : properties.keySet()) {
        String value = properties.get(key);
        
        HtmlMaterialProperty fileProperty = htmlMaterialPropertyDAO.findByHtmlMaterialAndKey(htmlMaterial, key);
        if (fileProperty == null) {
          htmlMaterialPropertyDAO.create(htmlMaterial, key, value);
        } else {
          htmlMaterialPropertyDAO.updateValue(fileProperty, value);
        }
        
        htmlMaterialRevisionPropertyDAO.create(htmlMaterialRevision, key, value);
        
        if ("title".equals(key)) {
          htmlMaterialDAO.updateTitle(htmlMaterial, value);
        }
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
        
        HtmlMaterialExtensionProperty htmlMaterialExtensionProperty = htmlMaterialExtensionPropertyDAO.findByFileAndKey(htmlMaterial, key);
        if (htmlMaterialExtensionProperty == null) {
          htmlMaterialExtensionPropertyDAO.create(htmlMaterial, key, value);
        } else {
          htmlMaterialExtensionPropertyDAO.updateValue(htmlMaterialExtensionProperty, value);
        }
        
        htmlMaterialRevisionExtensionPropertyDAO.create(htmlMaterialRevision, key, value);
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
    HtmlMaterial file = findFile(fileId);
    
    if (!COOPS_PROTOCOL_VERSION.equals(protocolVersion)) {
      throw new CoOpsNotImplementedException("Protocol version mismatch. Client is using " + protocolVersion + " and server " + COOPS_PROTOCOL_VERSION);
    }
    
    if (algorithms == null || algorithms.isEmpty()) {
      throw new CoOpsInternalErrorException("Invalid request");
    }
    
    CoOpsDiffAlgorithm algorithm = findAlgorithm(algorithms);
    if (algorithm == null) {
      throw new CoOpsNotImplementedException("Server and client do not have a commonly supported algorithm.");
    }

    Long currentRevision = file.getRevisionNumber();
    String data = file.getHtml();
    if (data == null) {
      data = "";
    }

    List<CoOpsSession> openSessions = coOpsSessionController.listSessionsByHtmlMaterialAndClosed(file, Boolean.FALSE);
    Map<String, String> properties = new HashMap<>();
    
    List<HtmlMaterialProperty> fileProperties = htmlMaterialPropertyDAO.listByHtmlMaterial(file);
    for (HtmlMaterialProperty fileProperty : fileProperties) {
      properties.put(fileProperty.getKey(), fileProperty.getValue());
    }
    
    Map<String, Object> extensions = new HashMap<>();
    String sessionId = UUID.randomUUID().toString();
    
    CoOpsSession coOpsSession = coOpsSessionController.createSession(file, sessionId, currentRevision, algorithm.getName());
    
    addSessionEventsExtension(file, extensions);
    addWebSocketExtension(file, extensions, coOpsSession);

    return new Join(coOpsSession.getSessionId(), coOpsSession.getAlgorithm(), coOpsSession.getJoinRevision(), data, file.getContentType(), properties, extensions);
  }
  
  private void addWebSocketExtension(HtmlMaterial htmlMaterial, Map<String, Object> extensions, CoOpsSession coOpsSession) {
    String wsUrl = String.format("ws://%s:%s%s/ws/coops/%d/%s", 
      httpRequest.getServerName(), 
      httpRequest.getServerPort(), 
      httpRequest.getContextPath(), 
      htmlMaterial.getId(), 
      coOpsSession.getSessionId());
    
    String wssUrl = String.format("wss://%s:%s%s/ws/coops/%d/%s", 
        httpRequest.getServerName(), 
        httpRequest.getServerPort(), 
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
  
  private CoOpsDiffAlgorithm findAlgorithm(String algorithmName) {
    return findAlgorithm(Arrays.asList(algorithmName)); 
  }
  
  private CoOpsDiffAlgorithm findAlgorithm(List<String> algorithmNames) {
    Map<String, CoOpsDiffAlgorithm> algorithmMap = getAlgorithmMap();
    for (String algorithmName : algorithmNames) {
      if (algorithmMap.containsKey(algorithmName)) {
        return algorithmMap.get(algorithmName);
      }
    }
    
    return null;
  }
  
  private Map<String, CoOpsDiffAlgorithm> getAlgorithmMap() {
    Map<String, CoOpsDiffAlgorithm> result = new HashMap<>();
    
    Iterator<CoOpsDiffAlgorithm> iterator = this.algorithms.iterator();
    while (iterator.hasNext()) {
      CoOpsDiffAlgorithm algorithm = iterator.next();
      result.put(algorithm.getName(), algorithm);
    }
    
    return result;
  }

  private HtmlMaterial findFile(String fileId) throws CoOpsUsageException, CoOpsNotFoundException {
    if (!StringUtils.isNumeric(fileId)) {
      throw new CoOpsUsageException("fileId must be a number");
    }
    
    Long id = NumberUtils.createLong(fileId);
    if (id == null) {
      throw new CoOpsUsageException("fileId must be a number");
    }
    
    HtmlMaterial file = htmlMaterialDAO.findById(id);
    if (file == null) {
      throw new CoOpsNotFoundException();
    }
    
    return file;
  }
}

package fi.otavanopisto.muikku.plugins.smowl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class SmowlController {

  public static final String SMOWL_BASE_URL = "https://results-api.smowltech.net/index.php/v2";
  
  @Inject
  private SystemSettingsController systemSettingsController; 
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  public void addActivity(Long workspaceFolderId) {
    if (workspaceFolderId == null) {
      throw new IllegalArgumentException("workspaceFolderId not set.");
    }
    
    String smowlUrl = SMOWL_BASE_URL + "/configs/activeServices/addActivity";

    final String entityName = systemSettingsController.getSetting("smowl.entityName");
    final String apiKey = systemSettingsController.getSetting("smowl.apiKey");

    if (StringUtils.isAnyBlank(entityName, apiKey)) {
      throw new IllegalStateException("Smowl credentials are not set.");
    }

    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeById(workspaceFolderId);
    WorkspaceEntity workspaceEntity = workspaceNode != null ? workspaceMaterialController.findWorkspaceEntityByNode(workspaceNode) : null;
    
    if (workspaceEntity == null) {
      throw new IllegalArgumentException("Smowl credentials are not set.");
    }
    
    // Date stuff
    
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    LocalDateTime startDateTime = LocalDate.now().atStartOfDay();
    LocalDateTime endDateTime = LocalDate.now().plusDays(7).atTime(LocalTime.MAX);
    
    // Payload
    
    Map<String, Object> payload = new HashMap<>();
    
    payload.put("activityType", "exam");
    payload.put("activityId", workspaceFolderId);
    payload.put("courseId", workspaceEntity.getId());
    payload.put("numberUsers", 999);
    payload.put("startDate", formatter.format(startDateTime));
    payload.put("endDate", formatter.format(endDateTime));
    payload.put("displayName", workspaceNode.getTitle());

    // Credentials
    
    String authString;
    try {
      final String credentials = String.format("%s:%s", entityName, apiKey);
      authString = Base64.getEncoder().encodeToString(credentials.getBytes("UTF-8"));
    } catch (Exception e) {
      throw new RuntimeException("Failed to set Smowl authentication.");
    }
    
    // Request
    
    Client client = ClientBuilder.newClient();
    
    Response smowlResponse = client.target(smowlUrl)
        .request(MediaType.APPLICATION_JSON_TYPE)
        .header(HttpHeaders.AUTHORIZATION, "Basic " + authString)
        .post(Entity.entity(payload, MediaType.APPLICATION_FORM_URLENCODED_TYPE));
    
    if (smowlResponse.getStatus() != 200) {
      throw new RuntimeException("Failed to set Smowl activity type.");
    }
  }
  
}

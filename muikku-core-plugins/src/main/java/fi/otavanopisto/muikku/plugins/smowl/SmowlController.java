package fi.otavanopisto.muikku.plugins.smowl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class SmowlController {

  public static final String SMOWL_BASE_URL = "https://results-api.smowltech.net/index.php/v2";
  private static final String ACTIVITY_TYPE = "exam";
  
  @Inject
  private SystemSettingsController systemSettingsController; 
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  public void setActivity(Long examId, boolean enabled) {
    // Name for this exam folder in Smowl
    final String examIdentifier = String.format("%s%d", systemSettingsController.getSetting("sys.env"), examId);
    final String fieldName = ACTIVITY_TYPE + examIdentifier;

    // Get the activity to get the state in Smowl
    JsonNode activity = getActivity(examIdentifier);
    boolean examExistsInSmowl = activity != null && activity.has(fieldName);

    if (!examExistsInSmowl) {
      // If exam doesn't exist in smowl but it should be enabled, do so
      if (enabled) {
        addActivity(workspaceMaterialController.findWorkspaceNodeById(examId));
      }
    }
    else {
      // Exam exists in smowl, make sure it matches the requested state
      
      JsonNode examRecord = activity.get(fieldName);
      boolean enabledInSmowl = examRecord.get("enabled").booleanValue();
      
      if (enabled != enabledInSmowl) {
        modifyActivity(examIdentifier, enabled);
      }
    }
  }

  private JsonNode getActivity(String examIdentifier) {
    String smowlUrl = SMOWL_BASE_URL + "/configs/activeServices/get";

    final String entityName = systemSettingsController.getSetting("smowl.entityName");
    final String apiKey = systemSettingsController.getSetting("smowl.apiKey");

    if (StringUtils.isAnyBlank(entityName, apiKey)) {
      throw new IllegalStateException("Smowl credentials are not set.");
    }
    
    // Payload
    
    Form payload = new Form();
    
    payload.param("activityType", ACTIVITY_TYPE);
    payload.param("activityId", examIdentifier);
        
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
    
    if (smowlResponse.getStatus() == 400 || smowlResponse.getStatus() == 404) {
      // Return null when not found - apparently 400 also can mean not found
      return null;
    }
    else if (smowlResponse.getStatus() != 200) {
      throw new RuntimeException("Failed to set Smowl activity type.");
    }
    else {
      return smowlResponse.readEntity(JsonNode.class);
    }
  }
  
  private void addActivity(WorkspaceNode exam) {
    String smowlUrl = SMOWL_BASE_URL + "/configs/activeServices/addActivity";

    final String entityName = systemSettingsController.getSetting("smowl.entityName");
    final String apiKey = systemSettingsController.getSetting("smowl.apiKey");
    final String sysEnv = systemSettingsController.getSetting("sys.env");

    if (StringUtils.isAnyBlank(entityName, apiKey, sysEnv)) {
      throw new IllegalStateException("Smowl credentials or system environment not set");
    }
    
    WorkspaceEntity workspaceEntity = exam != null ? workspaceMaterialController.findWorkspaceEntityByNode(exam) : null;
    if (workspaceEntity == null) {
      throw new IllegalArgumentException("Exam not set.");
    }
    
    // Date stuff
    
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    LocalDateTime startDateTime = LocalDate.now().atStartOfDay();
    LocalDateTime endDateTime = LocalDate.now().plusDays(7).atTime(LocalTime.MAX);
    
    // Payload
    
    Form payload = new Form();
    
    payload.param("activityType", ACTIVITY_TYPE);
    payload.param("activityId", String.format("%s%d", sysEnv, exam.getId()));
    payload.param("courseId", String.format("%s%d", sysEnv, workspaceEntity.getId()));
    payload.param("numberUsers", "999");
    payload.param("startDate", formatter.format(startDateTime));
    payload.param("endDate", formatter.format(endDateTime));
    payload.param("displayName", exam.getTitle());
    
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

  private void modifyActivity(String examIdentifier, boolean enabled) {
    String smowlUrl = SMOWL_BASE_URL + "/configs/activeServices/modifyActivity";

    final String entityName = systemSettingsController.getSetting("smowl.entityName");
    final String apiKey = systemSettingsController.getSetting("smowl.apiKey");

    if (StringUtils.isAnyBlank(entityName, apiKey)) {
      throw new IllegalStateException("Smowl credentials are not set.");
    }

    // Payload
    
    Form payload = new Form();
    
    payload.param("activityType", ACTIVITY_TYPE);
    payload.param("activityId", examIdentifier);
    payload.param("enable", enabled ? "true" : "false");
    
    if (enabled) {
      // If the activity is re-enabled, we set new dates
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
      LocalDateTime startDateTime = LocalDate.now().atStartOfDay();
      LocalDateTime endDateTime = LocalDate.now().plusDays(7).atTime(LocalTime.MAX);

      payload.param("startDate", formatter.format(startDateTime));
      payload.param("endDate", formatter.format(endDateTime));
    }
    
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

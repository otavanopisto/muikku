package fi.muikku.plugins.schooldatapyramus.webhook;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.pyramus.webhooks.data.WebhookCourseData;
import fi.pyramus.webhooks.data.WebhookCourseStaffMemberData;
import fi.pyramus.webhooks.data.WebhookCourseStudentData;
import fi.pyramus.webhooks.data.WebhookStaffMemberData;
import fi.pyramus.webhooks.data.WebhookStudentData;

@WebServlet (urlPatterns = "/pyramus/webhook")
@Transactional
public class PyramusWebhookServlet extends HttpServlet {
  
  private static final long serialVersionUID = 6706786035217090492L;
  
  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String requestSignature = req.getHeader("X-Pyramus-Signature");
    if (StringUtils.isBlank(requestSignature)) {
      logger.log(Level.WARNING, "Invalid webhook requrest (no X-Pyramus-Signature header found)");
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    String webhookSecret = pluginSettingsController.getPluginSetting("school-data-pyramus", "webhook.secret");
    if (StringUtils.isBlank(webhookSecret)) {
      logger.log(Level.WARNING, "Webhook secret is not configured");
      resp.sendError(HttpServletResponse.SC_FORBIDDEN);
      return;
    }
    
    String expectedSignature = DigestUtils.md5Hex(webhookSecret);
    
    if (!StringUtils.equals(requestSignature, expectedSignature)) {
      logger.log(Level.WARNING, "Could not authorize webhook (expected signature does not match request signature)");
      resp.sendError(HttpServletResponse.SC_FORBIDDEN);
      return;
    }
    
    ObjectMapper objectMapper = new ObjectMapper();
    PyramusWebhookPayload payload = objectMapper.readValue(req.getInputStream(), PyramusWebhookPayload.class);
    if (payload.getType() == null) {
      logger.log(Level.WARNING, "Invalid webhook payload (type is missing or is invalid)");
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    if (StringUtils.isBlank(payload.getData())) {
      logger.log(Level.WARNING, "Invalid webhook payload (data is missing)");
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    switch (payload.getType()) {
      case COURSE_CREATE:
        WebhookCourseData courseCreateData = unmarshalData(resp, payload, WebhookCourseData.class);
        if (courseCreateData == null) {
          return;  
        }
        
        handleCourseCreate(courseCreateData);
      break;
      case COURSE_ARCHIVE:
        WebhookCourseData courseArchiveData = unmarshalData(resp, payload, WebhookCourseData.class);
        if (courseArchiveData == null) {
          return;  
        }
        
        handleCourseArchive(courseArchiveData);
      break;
      case COURSE_STAFF_MEMBER_CREATE:
        WebhookCourseStaffMemberData courseStaffMemberCreateData = unmarshalData(resp, payload, WebhookCourseStaffMemberData.class);
        if (courseStaffMemberCreateData == null) {
          return;  
        }
        
        handleCourseStaffMemberCreate(courseStaffMemberCreateData);
      break;
      case COURSE_STAFF_MEMBER_DELETE:
        WebhookCourseStaffMemberData courseStaffMemberDeleteData = unmarshalData(resp, payload, WebhookCourseStaffMemberData.class);
        if (courseStaffMemberDeleteData == null) {
          return;  
        }
        
        handleCourseStaffMemberDelete(courseStaffMemberDeleteData);
      case STAFF_MEMBER_CREATE:
        WebhookStaffMemberData staffMemberCreateData = unmarshalData(resp, payload, WebhookStaffMemberData.class);
        if (staffMemberCreateData == null) {
          return;  
        }
        
        handleStaffMemberCreate(staffMemberCreateData);
      break;
      case STAFF_MEMBER_DELETE:
        WebhookStaffMemberData staffMemberDeleteData = unmarshalData(resp, payload, WebhookStaffMemberData.class);
        if (staffMemberDeleteData == null) {
          return;  
        }
        
        handleStaffMemberCreate(staffMemberDeleteData);
      break;
      case STUDENT_CREATE:
        WebhookStudentData studentCreateData = unmarshalData(resp, payload, WebhookStudentData.class);
        if (studentCreateData == null) {
          return;  
        }
        
        handleStudentCreate(studentCreateData);
      break;      
      case STUDENT_ARCHIVE:
        WebhookStudentData studentArchiveData = unmarshalData(resp, payload, WebhookStudentData.class);
        if (studentArchiveData == null) {
          return;  
        }
        
        handleStudentArchive(studentArchiveData);
      break;      
      case COURSE_STUDENT_CREATE:
        WebhookCourseStudentData courseStudentCreateData = unmarshalData(resp, payload, WebhookCourseStudentData.class);
        if (courseStudentCreateData == null) {
          return;  
        }
        
        handleCourseStudentCreate(courseStudentCreateData);
      break;      
      case COURSE_STUDENT_ARCHIVE:
        WebhookCourseStudentData courseStudentArchiveData = unmarshalData(resp, payload, WebhookCourseStudentData.class);
        if (courseStudentArchiveData == null) {
          return;  
        }
        
        handleCourseStudentArchive(courseStudentArchiveData);
      break;      
      default:
        logger.log(Level.WARNING, "Unknown webhook type " + payload.getType());
        resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED);
        return;
    }
  }

  private void handleCourseStudentArchive(WebhookCourseStudentData courseStudentArchiveData) {
    // TODO Implement
  }

  private void handleCourseStudentCreate(WebhookCourseStudentData courseStudentCreateData) {
    pyramusUpdater.updateCourseStudent(courseStudentCreateData.getCourseStudentId(), courseStudentCreateData.getCourseId(), courseStudentCreateData.getStudentId());
  }

  private void handleStudentArchive(WebhookStudentData studentArchiveData) {
    pyramusUpdater.updateStudent(studentArchiveData.getStudentId());
  }

  private void handleStudentCreate(WebhookStudentData studentCreateData) {
    pyramusUpdater.updateStudent(studentCreateData.getStudentId());
  }

  private void handleStaffMemberCreate(WebhookStaffMemberData staffMemberCreateData) {
    pyramusUpdater.updateStaffMember(staffMemberCreateData.getStaffMemberId());
  }

  private void handleCourseStaffMemberDelete(WebhookCourseStaffMemberData courseStaffMemberDeleteData) {
    pyramusUpdater.updateStaffMember(courseStaffMemberDeleteData.getStaffMemberId());
  }

  private void handleCourseStaffMemberCreate(WebhookCourseStaffMemberData courseStaffMemberCreateData) {
    pyramusUpdater.updateCourseStaffMember(courseStaffMemberCreateData.getCourseStaffMemberId(), courseStaffMemberCreateData.getCourseId(), courseStaffMemberCreateData.getStaffMemberId());
  }

  private void handleCourseArchive(WebhookCourseData courseArchiveData) {
    // TODO Implement
  }

  private void handleCourseCreate(WebhookCourseData courseCreateData) {
    pyramusUpdater.updateCourse(courseCreateData.getCourseId());
  }

  private <T> T unmarshalData(HttpServletResponse resp, PyramusWebhookPayload payload, Class<? extends T> type) throws IOException, JsonParseException, JsonMappingException {
    T data = new ObjectMapper().readValue(payload.getData(), type);
    
    if (data == null) {
      logger.log(Level.WARNING, "Invalid webhook payload (could not unmarshal data)");
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
    }
    
    return data;
  }
  
}

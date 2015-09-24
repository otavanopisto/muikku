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
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.pyramus.webhooks.data.WebhookCourseData;
import fi.pyramus.webhooks.data.WebhookCourseStaffMemberData;
import fi.pyramus.webhooks.data.WebhookCourseStudentData;
import fi.pyramus.webhooks.data.WebhookPersonData;
import fi.pyramus.webhooks.data.WebhookStaffMemberData;
import fi.pyramus.webhooks.data.WebhookStudentData;
import fi.pyramus.webhooks.data.WebhookStudentGroupData;
import fi.pyramus.webhooks.data.WebhookStudentGroupStaffMemberData;
import fi.pyramus.webhooks.data.WebhookStudentGroupStudentData;

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
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
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
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    if (StringUtils.isBlank(payload.getData())) {
      logger.log(Level.WARNING, "Invalid webhook payload (data is missing)");
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      logger.log(Level.INFO, String.format("Received a webhook notification of type %s", payload.getType().toString()));
      
      switch (payload.getType()) {
        case COURSE_CREATE:
        case COURSE_UPDATE:
        case COURSE_ARCHIVE:
          WebhookCourseData courseData = unmarshalData(resp, payload, WebhookCourseData.class);
          if (courseData == null) {
            return;  
          }

          pyramusUpdater.updateCourse(courseData.getCourseId());
        break;
        case COURSE_STAFF_MEMBER_CREATE:
        case COURSE_STAFF_MEMBER_UPDATE:
        case COURSE_STAFF_MEMBER_DELETE:
          WebhookCourseStaffMemberData courseStaffMemberData = unmarshalData(resp, payload, WebhookCourseStaffMemberData.class);
          if (courseStaffMemberData == null) {
            return;  
          }
          
          pyramusUpdater.updateCourseStaffMember(courseStaffMemberData.getCourseStaffMemberId(), courseStaffMemberData.getCourseId(), courseStaffMemberData.getStaffMemberId());
        case STAFF_MEMBER_CREATE:
        case STAFF_MEMBER_UPDATE:
        case STAFF_MEMBER_DELETE:
          WebhookStaffMemberData staffMemberData = unmarshalData(resp, payload, WebhookStaffMemberData.class);
          if (staffMemberData == null) {
            return;  
          }
          
          pyramusUpdater.updateStaffMember(staffMemberData.getStaffMemberId());
        break;
        case STUDENT_CREATE:
        case STUDENT_UPDATE:
        case STUDENT_ARCHIVE:
          WebhookStudentData studentData = unmarshalData(resp, payload, WebhookStudentData.class);
          if (studentData == null) {
            return;  
          }
          pyramusUpdater.updateStudent(studentData.getStudentId());
        break;      
        case COURSE_STUDENT_CREATE:
        case COURSE_STUDENT_UPDATE:
        case COURSE_STUDENT_ARCHIVE:
          WebhookCourseStudentData courseStudentData = unmarshalData(resp, payload, WebhookCourseStudentData.class);
          if (courseStudentData == null) {
            return;  
          }
          
          pyramusUpdater.updateCourseStudent(courseStudentData.getCourseStudentId(), courseStudentData.getCourseId(), courseStudentData.getStudentId());
        break;
        case PERSON_ARCHIVE:
        case PERSON_CREATE:
        case PERSON_UPDATE:
          WebhookPersonData personData = unmarshalData(resp, payload, WebhookPersonData.class);
          if (personData == null) {
            return;  
          }
          
          pyramusUpdater.updatePerson(personData.getPersonId());
        break;
        
        case STUDENTGROUP_ARCHIVE:
        case STUDENTGROUP_CREATE:
        case STUDENTGROUP_UPDATE:
          WebhookStudentGroupData groupData = unmarshalData(resp, payload, WebhookStudentGroupData.class);
          if (groupData == null) {
            return;  
          }
          
          pyramusUpdater.updateStudentGroup(groupData.getStudentGroupId());
        break;
        
        case STUDENTGROUP_STAFFMEMBER_CREATE:
        case STUDENTGROUP_STAFFMEMBER_REMOVE:
        case STUDENTGROUP_STAFFMEMBER_UPDATE:
          WebhookStudentGroupStaffMemberData studentGroupStaffMemberData = unmarshalData(resp, payload, WebhookStudentGroupStaffMemberData.class);
          if (studentGroupStaffMemberData == null) {
            return;  
          }
          
          pyramusUpdater.updateStudentGroupStaffMember(studentGroupStaffMemberData.getStudentGroupId(), studentGroupStaffMemberData.getStudentGroupUserId());
        break;
        
        case STUDENTGROUP_STUDENT_CREATE:
        case STUDENTGROUP_STUDENT_REMOVE:
        case STUDENTGROUP_STUDENT_UPDATE:
          WebhookStudentGroupStudentData studentGroupStudentData = unmarshalData(resp, payload, WebhookStudentGroupStudentData.class);
          if (studentGroupStudentData == null) {
            return;  
          }
          
          pyramusUpdater.updateStudentGroupStudent(studentGroupStudentData.getStudentGroupId(), studentGroupStudentData.getStudentGroupUserId());
        break;
        
        default:
          logger.log(Level.WARNING, "Unknown webhook type " + payload.getType());
          resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED);
          return;
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
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

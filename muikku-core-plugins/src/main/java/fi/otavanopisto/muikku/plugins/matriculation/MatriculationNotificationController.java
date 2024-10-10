package fi.otavanopisto.muikku.plugins.matriculation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.neuland.jade4j.JadeConfiguration;
import fi.otavanopisto.muikku.jade.JadeController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.plugins.matriculation.restmodel.MatriculationExamEnrollment;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.UserEmailEntityController;

/**
 * Controller for matriculation plugin notifications
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 */
@ApplicationScoped
public class MatriculationNotificationController {
  
  @Inject
  private JadeController jadeController;

  @Inject
  private MatriculationJadeTemplateLoader matriculationJadeTemplateLoader;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private Mailer mailer;
  
  /**
   * Sends an email notification about matriculation enrollment
   * 
   * @param enrollment enrollment
   * @param studentIdentifier the enrollee
   * @throws IOException thrown when some resources failed to load
   */
  public void sendEnrollmentNotification(MatriculationExamEnrollment enrollment, SchoolDataIdentifier studentIdentifier) throws IOException {
    Map<String, Object> templateModel = new HashMap<>();
    templateModel.put("enrollment", enrollment);
    templateModel.put("subjects", readSubjectMap());
    String content = renderJadeTemplate("enrollment-notification", templateModel);
    
    String email = userEmailEntityController.getUserDefaultEmailAddress(studentIdentifier, false);
    
    if (StringUtils.isNotBlank(email)) {
      List<String> to = Arrays.asList(email);
      List<String> cc = new ArrayList<>();
      List<String> bcc = Arrays.asList("yo-ilmoittautumiset@otavia.fi");
      mailer.sendMail(MailType.HTML, to, cc, bcc, "Ilmoittautuminen ylioppilaskirjoituksiin", content);
    }
  }
  
  /**
   * Reads subject map from JSON file
   * 
   * @return subject map
   * @throws IOException thrown when file opening fails
   */
  private Map<String, String> readSubjectMap() throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.readValue(getClass().getClassLoader().getResourceAsStream("/subjects.json"), new TypeReference<Map<String, String>>(){ });
  }

  /**
   * Renders Jade template
   * 
   * @param templateName template name
   * @param templateModel template model
   * @return rendered template
   * @throws IOException thrown when template rendering fails 
   */
  private String renderJadeTemplate(String templateName, Map<String, Object> templateModel) throws IOException {
    JadeConfiguration jadeConfiguration = new JadeConfiguration();
    jadeConfiguration.setTemplateLoader(matriculationJadeTemplateLoader);
    return jadeController.renderTemplate(jadeConfiguration, templateName, templateModel);
  }
  
}

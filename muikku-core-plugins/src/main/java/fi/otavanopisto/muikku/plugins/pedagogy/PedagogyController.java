package fi.otavanopisto.muikku.plugins.pedagogy;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormHistoryDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormImplementedActionsDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistoryType;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormImplementedActions;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;

public class PedagogyController {

  @Inject
  private Mailer mailer;

  @Inject
  private HttpServletRequest httpRequest;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private PedagogyFormDAO pedagogyFormDAO;

  @Inject
  private PedagogyFormHistoryDAO pedagogyFormHistoryDAO;
  
  @Inject
  private PedagogyFormImplementedActionsDAO pedagogyFormImplementedActionsDAO;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;


  public PedagogyForm createForm(Long userEntityId, String formData) {

    // Default values for a new form

    Long creator = sessionController.getLoggedUserEntity().getId();
    String visibility = null;

    // Create form and a history entry about that having happened (doubles as the creator and creation date of the form)

    PedagogyForm form = pedagogyFormDAO.create(userEntityId, formData, visibility);
    pedagogyFormHistoryDAO.create(form, "Asiakirja luotiin", creator, PedagogyFormHistoryType.EDIT);

    return form;
  }
  
  public PedagogyFormImplementedActions createFormForImplementedActions(Long userEntityId, String formData) {

    // Create form and a history entry about that having happened (doubles as the creator and creation date of the form)

    return pedagogyFormImplementedActionsDAO.create(userEntityId, formData);
  }
  
  public PedagogyFormImplementedActions updateFormDataImplementedActions(PedagogyFormImplementedActions form, String formData) {

    // Form data update

    return pedagogyFormImplementedActionsDAO.updateFormData(form, formData);
  }
  
  public PedagogyFormImplementedActions findFormImplementedActionsByUserEntityId(Long userEntityId) {
    return pedagogyFormImplementedActionsDAO.findByUserEntityId(userEntityId);
  }
  
  public PedagogyForm updateFormData(PedagogyForm form, String formData, List<String> modifiedFields, String details, Long modifierId) {

    // Form data update

    pedagogyFormDAO.updateFormData(form, formData);

    // History entry about modify

    String fieldStr = modifiedFields == null || modifiedFields.isEmpty() ? null
        : String.join(",", modifiedFields.stream().map(Object::toString).collect(Collectors.toList()));
    pedagogyFormHistoryDAO.create(form, StringUtils.isEmpty(details) ? "Suunnitelmaa muokattiin" : details, modifierId, fieldStr, PedagogyFormHistoryType.EDIT);

    return form;
  }
  
  public PedagogyForm updatePublished(PedagogyForm form, Long modifierId) {

    // Student
    
    UserEntity studentEntity = userEntityController.findUserEntityById(form.getUserEntityId());

    // PublishDate determines whether the form is published. If PublishDate has already been set previously, we need to change it to null so that the form can be set as unpublished.
    boolean published = form.getPublished() != null;
    Date date = null;
    
    if (published == false) {
      date = new Date();
    }

    // Form data update
    pedagogyFormDAO.updatePublished(form, date);

    String details;
    SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
    
    if (published == Boolean.TRUE) {
      details = "Asiakirja julkaistu " + df.format(date);

      // Notification to counselors about published form
      UserEntityName loggedUserEntityName = userEntityController.getName(sessionController.getLoggedUser(), true);
      UserEntityName userEntityName = userEntityController.getName(studentEntity.defaultSchoolDataIdentifier(), true);

      List<SpecEdTeacher> specEdTeachers = userSchoolDataController
          .listStudentSpecEdTeachers(studentEntity.defaultSchoolDataIdentifier(), true, true);
      if (!specEdTeachers.isEmpty()) {

        StringBuffer url = new StringBuffer();
        url.append(httpRequest.getScheme());
        url.append("://");
        url.append(httpRequest.getServerName());
        url.append("/guider#?c=");
        url.append(studentEntity.defaultSchoolDataIdentifier().toId());

        String subject = localeController.getText(sessionController.getLocale(),
            "plugin.pedagogy.published.counselor.subject", new String[] { userEntityName.getDisplayNameWithLine() });

        String content = localeController.getText(sessionController.getLocale(),
            "plugin.pedagogy.published.counselor.content",
            new String[] { userEntityName.getDisplayNameWithLine(), url.toString() });

        for (SpecEdTeacher specEdTeacher : specEdTeachers) {
          String email = userEmailEntityController.getUserDefaultEmailAddress(specEdTeacher.getIdentifier(), false);
          mailer.sendMail(MailType.HTML, Arrays.asList(email), subject, content);
        }
      }
      
      // Notification to student
      
        StringBuffer url = new StringBuffer();
        url.append(httpRequest.getScheme());
        url.append("://");
        url.append(httpRequest.getServerName());
        url.append("/records#pedagogy-form");
        url.append(studentEntity.defaultSchoolDataIdentifier().toId());

        String subject = localeController.getText(sessionController.getLocale(),
            "plugin.pedagogy.published.student.subject", new String[] { loggedUserEntityName.getDisplayNameWithLine() });

        String content = localeController.getText(sessionController.getLocale(),
            "plugin.pedagogy.published.student.content",
            new String[] { loggedUserEntityName.getDisplayNameWithLine(), url.toString() });

          String email = userEmailEntityController.getUserDefaultEmailAddress(studentEntity, false);
          mailer.sendMail(MailType.HTML, Arrays.asList(email), subject, content);
        
      
    }
    else {
      details = "Asiakirja asetettu ei-julkaistu-tilaan " + df.format(date);
    }
    
    // History entry about modify
    pedagogyFormHistoryDAO.create(form, details, modifierId, null, PedagogyFormHistoryType.EDIT);

    return form;
  }
  
  public PedagogyForm findFormByUserEntityId(Long userEntityId) {
    return pedagogyFormDAO.findByUserEntityId(userEntityId);
  }

  public PedagogyForm findFormByUserEntityIdAndPublished(Long userEntityId) {
    return pedagogyFormDAO.findByUserEntityIdAndPublished(userEntityId);
  }

  public void createViewHistory(PedagogyForm form, Long modifierId) {
    List<PedagogyFormHistory> historyList = pedagogyFormHistoryDAO.listByFormAndCreatorAndType(form, modifierId, PedagogyFormHistoryType.VIEW);

    if (!historyList.isEmpty()) {
      PedagogyFormHistory latestHistoryItem = historyList.get(0);

      Date lastCreated = latestHistoryItem.getCreated();
      Instant now = new Date().toInstant();

      // Skip creation if latest history item (with same creator + form) is less than 3 hours old
      if (!lastCreated.toInstant().isBefore(now.minus(3, ChronoUnit.HOURS))) {
        return;
      }
    }

    pedagogyFormHistoryDAO.create(form, "Suunnitelmaa katsottiin", modifierId, PedagogyFormHistoryType.VIEW);

  }

  public List<PedagogyFormHistory> listHistory(PedagogyForm form) {
    List<PedagogyFormHistory> history = pedagogyFormHistoryDAO.listByForm(form);
    history.sort(Comparator.comparing(PedagogyFormHistory::getCreated).reversed());
    return history;
  }

  public boolean isPublished(Long userEntityId) {
    return findFormByUserEntityIdAndPublished(userEntityId) != null;
  }
}

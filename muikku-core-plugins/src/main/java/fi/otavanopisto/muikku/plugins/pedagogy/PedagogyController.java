package fi.otavanopisto.muikku.plugins.pedagogy;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormHistoryDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistoryType;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormVisibility;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
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
  private LocaleController localeController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private PedagogyFormDAO pedagogyFormDAO;

  @Inject
  private PedagogyFormHistoryDAO pedagogyFormHistoryDAO;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  public PedagogyForm createForm(String studentIdentifier, String formData) {

    // Default values for a new form

    PedagogyFormState state = PedagogyFormState.ACTIVE;
    Long creator = sessionController.getLoggedUserEntity().getId();
    String visibility = null;

    // Create form and a history entry about that having happened (doubles as the creator and creation date of the form)

    PedagogyForm form = pedagogyFormDAO.create(studentIdentifier, formData, state, visibility);
    pedagogyFormHistoryDAO.create(form, "Asiakirja luotiin", creator, PedagogyFormHistoryType.EDIT);

    return form;
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

  public PedagogyForm updateState(PedagogyForm form, PedagogyFormState state, Long modifierId) {

    // State update

    form = pedagogyFormDAO.updateState(form, state);

    // History entry
    
    String details = null;
    switch (state) {
    case PENDING:
      details = "Suunnitelma odottaa opiskelijan hyväksyntää";
      break;
    case APPROVED:
      details = "Opiskelija hyväksyi suunnitelman";
      break;
     default:
       break;
    }
    pedagogyFormHistoryDAO.create(form, details, modifierId, PedagogyFormHistoryType.EDIT);
    
    // Notification about student accepting the form
    
    if (state == PedagogyFormState.APPROVED) {
      UserEntityName userEntityName = userEntityController.getName(sessionController.getLoggedUser(), true);

      boolean visibleToGuidanceCouncelors = false;
      if (!StringUtils.isEmpty(form.getVisibility())) {
        String[] visibilities = form.getVisibility().split(",");
        for (String s : visibilities) {
          if (PedagogyFormVisibility.valueOf(s) == PedagogyFormVisibility.TEACHERS) {
            visibleToGuidanceCouncelors = true;
            break;
          }
        }
      }

      List<SpecEdTeacher> specEdTeachers = userSchoolDataController.listStudentSpecEdTeachers(sessionController.getLoggedUser(), visibleToGuidanceCouncelors, true);
      if (!specEdTeachers.isEmpty()) {

        StringBuffer url = new StringBuffer();
        url.append(httpRequest.getScheme());
        url.append("://");
        url.append(httpRequest.getServerName());
        url.append("/guider#?c=");
        url.append(sessionController.getLoggedUser().toId());

        String subject = localeController.getText(
            sessionController.getLocale(),
            "plugin.pedagogy.approval.subject",
            new String[] {userEntityName.getDisplayNameWithLine()});

        String content = localeController.getText(
            sessionController.getLocale(),
            "plugin.pedagogy.approval.content",
            new String[] {userEntityName.getDisplayNameWithLine(), url.toString()});

        for (SpecEdTeacher specEdTeacher : specEdTeachers) {
          String email = userEmailEntityController.getUserDefaultEmailAddress(specEdTeacher.getIdentifier(), false); 
          mailer.sendMail(MailType.HTML,
              Arrays.asList(email),
              subject,
              content);
        }
      }
        
    }
    
    // Notification about pending form
    
    else if (state == PedagogyFormState.PENDING) {
      UserEntityName staffName = userEntityController.getName(sessionController.getLoggedUser(), true);
      String staffMail = userEmailEntityController.getUserDefaultEmailAddress(sessionController.getLoggedUser(), false);
      SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(form.getStudentIdentifier());
      UserEntityName studentName = userEntityController.getName(studentIdentifier, true);
      String studentMail = userEmailEntityController.getUserDefaultEmailAddress(studentIdentifier, false);

      StringBuffer url = new StringBuffer();
      url.append(httpRequest.getScheme());
      url.append("://");
      url.append(httpRequest.getServerName());
      url.append("/records#pedagogy-form");

      String subject = localeController.getText(
          sessionController.getLocale(),
          "plugin.pedagogy.pending.subject",
          new String[] {});

      String content = localeController.getText(
          sessionController.getLocale(),
          "plugin.pedagogy.pending.content",
          new String[] {studentName.getDisplayNameWithLine(), staffName.getDisplayName(), url.toString(), staffMail});

      mailer.sendMail(MailType.HTML,
          Arrays.asList(studentMail),
          subject,
          content);
      
    }

    return form;
  }

  public PedagogyForm updateVisibility(PedagogyForm form, List<PedagogyFormVisibility> visibility, Long modifierId) {

    // Visibility update

    String visibilityStr = visibility == null || visibility.isEmpty() ? null
        : String.join(",", visibility.stream().map(Object::toString).collect(Collectors.toList()));
    form = pedagogyFormDAO.updateVisibility(form, visibilityStr);

    // History entry

    pedagogyFormHistoryDAO.create(form, "Suunnitelman jako-oikeuksia muutettiin", modifierId, PedagogyFormHistoryType.EDIT);
    
    // Notification if the visibility was changed after the form has been approved by the student
    
    if (form.getState() == PedagogyFormState.APPROVED) {
      UserEntityName userEntityName = userEntityController.getName(sessionController.getLoggedUser(), true);
      boolean visibleToGuidanceCouncelors = visibility != null && visibility.contains(PedagogyFormVisibility.TEACHERS);
      List<SpecEdTeacher> specEdTeachers = userSchoolDataController.listStudentSpecEdTeachers(sessionController.getLoggedUser(), true, true);
      if (!specEdTeachers.isEmpty()) {
        StringBuffer url = new StringBuffer();
        url.append(httpRequest.getScheme());
        url.append("://");
        url.append(httpRequest.getServerName());
        url.append("/guider#?c=");
        url.append(sessionController.getLoggedUser().toId());

        String subject = localeController.getText(
            sessionController.getLocale(),
            "plugin.pedagogy.visibility.subject",
            new String[] {userEntityName.getDisplayNameWithLine()});

        for (SpecEdTeacher specEdTeacher : specEdTeachers) {
          String content = !specEdTeacher.isGuidanceCouncelor() || visibleToGuidanceCouncelors
              ? localeController.getText(sessionController.getLocale(), "plugin.pedagogy.visibility.content.access",
                  new String[] {userEntityName.getDisplayNameWithLine(), url.toString()})
                  : localeController.getText(sessionController.getLocale(), "plugin.pedagogy.visibility.content.noAccess",
                      new String[] {userEntityName.getDisplayNameWithLine()});
          String email = userEmailEntityController.getUserDefaultEmailAddress(specEdTeacher.getIdentifier(), false);
          mailer.sendMail(MailType.HTML,
              Arrays.asList(email),
              subject,
              content);
        }
      }
    }

    return form;
  }

  public PedagogyForm findFormByStudentIdentifier(String studentIdentifier) {
    return pedagogyFormDAO.findByStudentIdentifier(studentIdentifier);
  }
  
  public void createViewHistory(PedagogyForm form, Long modifierId) {
    pedagogyFormHistoryDAO.create(form, "Suunnitelmaa katsottiin", modifierId, PedagogyFormHistoryType.VIEW);
  }


  public List<PedagogyFormHistory> listHistory(PedagogyForm form) {
    List<PedagogyFormHistory> history = pedagogyFormHistoryDAO.listByForm(form);
    history.sort(Comparator.comparing(PedagogyFormHistory::getCreated).reversed());
    return history;
  }

}

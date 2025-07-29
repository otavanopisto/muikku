package fi.otavanopisto.muikku.plugins.pedagogy;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormHistoryDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormImplementedActionsDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistoryType;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormImplementedActions;
import fi.otavanopisto.muikku.session.SessionController;

public class PedagogyController {

  @Inject
  private SessionController sessionController;

  @Inject
  private PedagogyFormDAO pedagogyFormDAO;

  @Inject
  private PedagogyFormHistoryDAO pedagogyFormHistoryDAO;
  
  @Inject
  private PedagogyFormImplementedActionsDAO pedagogyFormImplementedActionsDAO;


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

    PedagogyFormImplementedActions form = pedagogyFormImplementedActionsDAO.create(userEntityId, formData);

    return form;
  }
  
  public PedagogyFormImplementedActions updateFormDataImplementedActions(PedagogyFormImplementedActions form, String formData) {

    // Form data update

    pedagogyFormImplementedActionsDAO.updateFormData(form, formData);

    return form;
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
  
  public PedagogyForm updatePublished(PedagogyForm form, boolean published, List<String> modifiedFields, String details, Long modifierId) {

    // Form data update

    pedagogyFormDAO.updatePublished(form, published, new Date());

    // History entry about modify

    String fieldStr = modifiedFields == null || modifiedFields.isEmpty() ? null
        : String.join(",", modifiedFields.stream().map(Object::toString).collect(Collectors.toList()));
    pedagogyFormHistoryDAO.create(form, StringUtils.isEmpty(details) ? "Suunnitelman näkyvyyttä muokattiin" : details, modifierId, fieldStr, PedagogyFormHistoryType.EDIT);

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
  
  public boolean hasPedagogyForm(Long userEntityId) {
    return findFormByUserEntityId(userEntityId) != null;
  }

  public boolean isPublished(Long userEntityId) {
    return findFormByUserEntityIdAndPublished(userEntityId) != null;
  }
}

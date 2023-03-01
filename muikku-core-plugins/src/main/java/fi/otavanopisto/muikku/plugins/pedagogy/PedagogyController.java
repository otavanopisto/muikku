package fi.otavanopisto.muikku.plugins.pedagogy;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.dao.PedagogyFormHistoryDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormHistory;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormVisibility;
import fi.otavanopisto.muikku.session.SessionController;

public class PedagogyController {

  @Inject
  private SessionController sessionController;

  @Inject
  private PedagogyFormDAO pedagogyFormDAO;

  @Inject
  private PedagogyFormHistoryDAO pedagogyFormHistoryDAO;

  public PedagogyForm createForm(String studentIdentifier, String formData) {

    // Default values for a new form

    PedagogyFormState state = PedagogyFormState.ACTIVE;
    Long ownerId = sessionController.getLoggedUserEntity().getId();
    String visibility = null;

    // Create form and a history entry about that having happened (doubles as the
    // creation date of the form)

    PedagogyForm form = pedagogyFormDAO.create(studentIdentifier, formData, ownerId, state, visibility);
    pedagogyFormHistoryDAO.create(form, "Lomake luotu", ownerId);

    return form;
  }

  public PedagogyForm updateFormData(PedagogyForm form, String formData, List<String> modifiedFields, String details, Long modifierId) {

    // Form data update

    pedagogyFormDAO.updateFormData(form, formData);

    // History entry

    String fieldStr = modifiedFields == null || modifiedFields.isEmpty() ? null
        : String.join(",", modifiedFields.stream().map(Object::toString).collect(Collectors.toList()));
    pedagogyFormHistoryDAO.create(form, StringUtils.isEmpty(details) ? "Lomaketta muokattu" : details, modifierId, fieldStr);

    return form;
  }

  public PedagogyForm updateState(PedagogyForm form, PedagogyFormState state, Long modifierId) {

    // State update

    form = pedagogyFormDAO.updateState(form, state);

    // History entry

    pedagogyFormHistoryDAO.create(form, "Lomakkeen tilaa muutettu", modifierId);

    return form;
  }

  public PedagogyForm updateVisibility(PedagogyForm form, List<PedagogyFormVisibility> visibility, Long modifierId) {

    // Visibility update

    String visibilityStr = visibility == null || visibility.isEmpty() ? null
        : String.join(",", visibility.stream().map(Object::toString).collect(Collectors.toList()));
    form = pedagogyFormDAO.updateVisibility(form, visibilityStr);
    form = pedagogyFormDAO.updateState(form, PedagogyFormState.APPROVED);

    // History entry

    pedagogyFormHistoryDAO.create(form, "Lomakkeen näkyvyyttä muutettu", modifierId);

    return form;
  }

  public PedagogyForm findFormByStudentIdentifier(String studentIdentifier) {
    return pedagogyFormDAO.findByStudentIdentifier(studentIdentifier);
  }

  public List<PedagogyFormHistory> listHistory(PedagogyForm form) {
    List<PedagogyFormHistory> history = pedagogyFormHistoryDAO.listByForm(form);
    history.sort(Comparator.comparing(PedagogyFormHistory::getCreated).reversed());
    return history;
  }

}

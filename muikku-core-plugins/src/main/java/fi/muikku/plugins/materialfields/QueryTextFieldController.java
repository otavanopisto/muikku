package fi.muikku.plugins.materialfields;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.materialfields.dao.QueryTextFieldDAO;
import fi.muikku.plugins.materialfields.model.QueryTextField;

@Stateless
@Dependent
public class QueryTextFieldController {

  @Inject
  QueryTextFieldDAO queryTextFieldDAO;

  public QueryTextField createQueryTextField(String name, String help, String hint, boolean mandatory, String text) {
    return queryTextFieldDAO.create(name, help, hint, mandatory, text);
  }

  public QueryTextField findQueryTextFieldbyId(Long id) {
    return queryTextFieldDAO.findById(id);
  }

}

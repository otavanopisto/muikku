package fi.muikku.plugins.material;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.materialfields.dao.QueryConnectFieldCounterpartDAO;
import fi.muikku.plugins.materialfields.dao.QueryConnectFieldDAO;
import fi.muikku.plugins.materialfields.dao.QueryConnectFieldTermDAO;
import fi.muikku.plugins.materialfields.model.QueryConnectField;
import fi.muikku.plugins.materialfields.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.materialfields.model.QueryConnectFieldTerm;

@Stateless
@Dependent
public class QueryConnectFieldController {

  @Inject
  private QueryConnectFieldDAO queryConnectFieldDAO;

  @Inject
  private QueryConnectFieldTermDAO queryConnectFieldTermDAO;

  @Inject
  private QueryConnectFieldCounterpartDAO queryConnectFieldCounterpartDAO;

  /* Connect Field */
  
  public QueryConnectField createQueryConnectField(Material material, String name, Boolean mandatory) {
    return queryConnectFieldDAO.create(material, name, mandatory);
  }

  public QueryConnectField findQueryConnectFieldbyId(Long id) {
    return queryConnectFieldDAO.findById(id);
  }

  /* Connect Field Terms */
  
  public QueryConnectFieldTerm createConnectFieldTerm(QueryConnectField connectField, String name, String text, QueryConnectFieldCounterpart counterpart) {
    return queryConnectFieldTermDAO.create(connectField, name, text, counterpart);
  }

  /* Connect Field Counterparts */
  
  public QueryConnectFieldCounterpart createConnectFieldCounterpart(QueryConnectField connectField, String name, String text) {
    return queryConnectFieldCounterpartDAO.create(connectField, name, text);
  }

}

package fi.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.material.dao.QueryConnectFieldCounterpartDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldDAO;
import fi.muikku.plugins.material.dao.QueryConnectFieldTermDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;

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
  
  public QueryConnectField createQueryConnectField(Material material, String name) {
    return queryConnectFieldDAO.create(material, name);
  }

  public QueryConnectField findQueryConnectFieldbyId(Long id) {
    return queryConnectFieldDAO.findById(id);
  }

  /* Connect Field Terms */
  
  public QueryConnectFieldTerm createConnectFieldTerm(QueryConnectField connectField, String name, String text, QueryConnectFieldCounterpart counterpart) {
    return queryConnectFieldTermDAO.create(connectField, name, text, counterpart);
  }

  public QueryConnectFieldTerm findQueryConnectFieldTermByFieldAndName(QueryConnectField connectField, String name) {
    return queryConnectFieldTermDAO.findByFieldAndName(connectField, name);
  }

  public List<QueryConnectFieldTerm> listConnectFieldTermsByField(QueryConnectField field) {
    return queryConnectFieldTermDAO.listByField(field);
  }

  /* Connect Field Counterparts */
  
  public QueryConnectFieldCounterpart createConnectFieldCounterpart(QueryConnectField connectField, String name, String text) {
    return queryConnectFieldCounterpartDAO.create(connectField, name, text);
  }

  public QueryConnectFieldCounterpart findQueryConnectFieldCounterpartByFieldAndName(QueryConnectField connectField, String name) {
    return queryConnectFieldCounterpartDAO.findByFieldAndName(connectField, name);
  }

}

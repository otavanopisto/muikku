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

  public QueryConnectField findQueryConnectFieldById(Long id) {
    return queryConnectFieldDAO.findById(id);
  }

  public QueryConnectField findQueryConnectFieldByMaterialAndName(Material material, String name) {
    return queryConnectFieldDAO.findByMaterialAndName(material, name);
  }

  /* Connect Field Terms */
  
  public QueryConnectFieldTerm createConnectFieldTerm(QueryConnectField field, String name, String text, QueryConnectFieldCounterpart counterpart) {
    return queryConnectFieldTermDAO.create(field, name, text, counterpart);
  }

  public QueryConnectFieldTerm findQueryConnectFieldTermByFieldAndName(QueryConnectField field, String name) {
    return queryConnectFieldTermDAO.findByFieldAndName(field, name);
  }

  public List<QueryConnectFieldTerm> listConnectFieldTermsByField(QueryConnectField field) {
    return queryConnectFieldTermDAO.listByField(field);
  }

  public QueryConnectFieldTerm updateConnectFieldTermText(QueryConnectFieldTerm queryConnectFieldTerm, String text) {
    return queryConnectFieldTermDAO.updateText(queryConnectFieldTerm, text);
  }

  public QueryConnectFieldTerm updateConnectFieldTermCounterpart(QueryConnectFieldTerm queryConnectFieldTerm, QueryConnectFieldCounterpart counterpart) {
    return queryConnectFieldTermDAO.updateCounterpart(queryConnectFieldTerm, counterpart);
  }

  /* Connect Field Counterparts */
  
  public QueryConnectFieldCounterpart createConnectFieldCounterpart(QueryConnectField field, String name, String text) {
    return queryConnectFieldCounterpartDAO.create(field, name, text);
  }

  public QueryConnectFieldCounterpart findQueryConnectFieldCounterpartByFieldAndName(QueryConnectField field, String name) {
    return queryConnectFieldCounterpartDAO.findByFieldAndName(field, name);
  }

  public QueryConnectFieldCounterpart updateConnectFieldCounterpartText(QueryConnectFieldCounterpart connectFieldCounterpart, String text) {
    return queryConnectFieldCounterpartDAO.updateText(connectFieldCounterpart, text);
  }

}

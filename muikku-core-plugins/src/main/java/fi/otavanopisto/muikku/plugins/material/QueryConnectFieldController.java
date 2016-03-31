package fi.otavanopisto.muikku.plugins.material;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldCounterpartDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldTermDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;

@Stateless
@Dependent
public class QueryConnectFieldController {

  @Inject
  private QueryConnectFieldDAO queryConnectFieldDAO;

  @Inject
  private QueryConnectFieldTermDAO queryConnectFieldTermDAO;

  @Inject
  private QueryConnectFieldCounterpartDAO queryConnectFieldCounterpartDAO;
  
  @Inject
  private Event<QueryFieldDeleteEvent> queryFieldDeleteEvent;

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

  public void deleteQueryConnectField(QueryConnectField queryField, boolean removeAnswers) {
    queryFieldDeleteEvent.fire(new QueryFieldDeleteEvent(queryField, removeAnswers));
    
    for (QueryConnectFieldTerm term : listConnectFieldTermsByField(queryField)) {
      queryConnectFieldTermDAO.delete(term);
    }
    
    for (QueryConnectFieldCounterpart counterpart : listQueryConnectFieldCounterpartByField(queryField)) {
      queryConnectFieldCounterpartDAO.delete(counterpart);
    }
    
    queryConnectFieldDAO.delete(queryField);
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

  public List<QueryConnectFieldCounterpart> listQueryConnectFieldCounterpartByField(QueryConnectField field) {
    return queryConnectFieldCounterpartDAO.listByField(field);
  }

  public QueryConnectFieldCounterpart updateConnectFieldCounterpartText(QueryConnectFieldCounterpart connectFieldCounterpart, String text) {
    return queryConnectFieldCounterpartDAO.updateText(connectFieldCounterpart, text);
  }
  
}

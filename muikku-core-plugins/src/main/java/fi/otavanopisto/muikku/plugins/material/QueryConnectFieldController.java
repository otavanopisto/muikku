package fi.otavanopisto.muikku.plugins.material;

import java.io.IOException;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldCounterpartDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldTermDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;

@Dependent
public class QueryConnectFieldController {

  @Inject
  private QueryConnectFieldDAO queryConnectFieldDAO;

  @Inject
  private QueryConnectFieldTermDAO queryConnectFieldTermDAO;

  @Inject
  private QueryConnectFieldCounterpartDAO queryConnectFieldCounterpartDAO;

  @Inject
  private Event<QueryFieldUpdateEvent> queryFieldUpdateEvent;

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

  public QueryConnectField updateQueryConnectField(Material material, MaterialField field, boolean removeAnswers) throws MaterialFieldMetaParsingExeption {
    ObjectMapper objectMapper = new ObjectMapper();
    ConnectFieldMeta connectFieldMeta;
    try {
      connectFieldMeta = objectMapper.readValue(field.getContent(), ConnectFieldMeta.class);
    }
    catch (IOException e) {
      throw new MaterialFieldMetaParsingExeption("Could not parse connect field meta", e);
    }
    QueryConnectField queryField = queryConnectFieldDAO.findByMaterialAndName(material, connectFieldMeta.getName());
    // -> fi.otavanopisto.muikku.plugins.workspace.QueryFieldChangeListener
    queryFieldUpdateEvent.fire(new QueryFieldUpdateEvent(queryField, field, removeAnswers));
    return queryField;
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

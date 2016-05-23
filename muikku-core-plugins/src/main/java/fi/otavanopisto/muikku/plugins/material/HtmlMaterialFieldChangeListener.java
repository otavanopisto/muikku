package fi.otavanopisto.muikku.plugins.material;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldCreateEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.HtmlMaterialFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldConnectionMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.FileFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.MemoFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.MultiSelectFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.MultiSelectFieldOptionMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.OrganizerFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.TextFieldMeta;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMemoField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectField;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectField;

public class HtmlMaterialFieldChangeListener {
  
  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private QueryTextFieldController queryTextFieldController;

  @Inject
  private QueryOrganizerFieldController queryOrganizerFieldController;
  
  @Inject
  private QueryMemoFieldController queryMemoFieldController;
  
  @Inject
  private QuerySelectFieldController querySelectFieldController;

  @Inject
  private QueryMultiSelectFieldController queryMultiSelectFieldController;

  @Inject
  private QueryFileFieldController queryFileFieldController;
  
  @Inject
  private QueryConnectFieldController queryConnectFieldController;
  
  // Create

  // Text field
  public void onHtmlMaterialTextFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.text")) {
      ObjectMapper objectMapper = new ObjectMapper();
      TextFieldMeta textFieldMeta;
      try {
        textFieldMeta = objectMapper.readValue(event.getField().getContent(), TextFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse text field meta", e);
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), textFieldMeta.getName());
      if (queryField == null) {
        queryTextFieldController.createQueryTextField(event.getMaterial(), textFieldMeta.getName());
      } else {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }
    }
  }
  
  // Organizer field
  public void onHtmlMaterialOrganizerFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.organizer")) {
      ObjectMapper objectMapper = new ObjectMapper();
      OrganizerFieldMeta organizerFieldMeta;
      try {
        organizerFieldMeta = objectMapper.readValue(event.getField().getContent(), OrganizerFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse organizer field meta", e);
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), organizerFieldMeta.getName());
      if (queryField == null) {
        queryOrganizerFieldController.createQueryOrganizerField(event.getMaterial(), organizerFieldMeta.getName());
      } else {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }
    }
  }
  
  // Memo field
  public void onHtmlMaterialMemoFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.memo")) {
      ObjectMapper objectMapper = new ObjectMapper();
      MemoFieldMeta memoFieldMeta;
      try {
        memoFieldMeta = objectMapper.readValue(event.getField().getContent(), MemoFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse memo field meta", e);
      }
      
      QueryMemoField queryMemoField = queryMemoFieldController.findQueryMemoFieldByMaterialAndName(event.getMaterial(), memoFieldMeta.getName());
      if (queryMemoField == null) {
        queryMemoFieldController.createQueryMemoField(event.getMaterial(), memoFieldMeta.getName());
      } else {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }
    }
  }
  
  // Select field
  public void onHtmlMaterialSelectFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.select")) {
      ObjectMapper objectMapper = new ObjectMapper();
      
      SelectFieldMeta selectFieldMeta;
      try {
        selectFieldMeta = objectMapper.readValue(event.getField().getContent(), SelectFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse select field meta", e);
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), selectFieldMeta.getName());
      if (queryField != null) {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }

      QuerySelectField querySelectField = querySelectFieldController.createQuerySelectField(event.getMaterial(), selectFieldMeta.getName());
      for (SelectFieldOptionMeta selectFieldOptionMeta : selectFieldMeta.getOptions()) {
        querySelectFieldController.createQuerySelectFieldOption(querySelectField, selectFieldOptionMeta.getName(), selectFieldOptionMeta.getText());
      }
    }
  }

  // Multi-select field
  public void onHtmlMaterialMultiSelectFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.multiselect")) {
      ObjectMapper objectMapper = new ObjectMapper();
      
      MultiSelectFieldMeta multiSelectFieldMeta;
      try {
        multiSelectFieldMeta = objectMapper.readValue(event.getField().getContent(), MultiSelectFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse select field meta", e);
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), multiSelectFieldMeta.getName());
      if (queryField != null) {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }

      QueryMultiSelectField queryMultiSelectField = queryMultiSelectFieldController.createQueryMultiSelectField(event.getMaterial(), multiSelectFieldMeta.getName());
      for (MultiSelectFieldOptionMeta multiSelectFieldOptionMeta : multiSelectFieldMeta.getOptions()) {
        queryMultiSelectFieldController.createQueryMultiSelectFieldOption(queryMultiSelectField, multiSelectFieldOptionMeta.getName(), multiSelectFieldOptionMeta.getText());
      }
    }
  }
  
  // File field
  public void onHtmlMaterialFileFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.file")) {
      ObjectMapper objectMapper = new ObjectMapper();
      FileFieldMeta fileFieldMeta;
      try {
        fileFieldMeta = objectMapper.readValue(event.getField().getContent(), FileFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse file field meta", e);
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), fileFieldMeta.getName());
      if (queryField != null) {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }
      
      queryFileFieldController.createQueryFileField(event.getMaterial(), fileFieldMeta.getName());
    }
  }
  
  // Connect field
  public void onHtmlMaterialConnectFieldCreated(@Observes HtmlMaterialFieldCreateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.connect")) {
      ObjectMapper objectMapper = new ObjectMapper();
      ConnectFieldMeta connectFieldMeta;
      try {
        connectFieldMeta = objectMapper.readValue(event.getField().getContent(), ConnectFieldMeta.class);
      } catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse connect field meta", e);
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), connectFieldMeta.getName());
      if (queryField != null) {
        throw new MaterialQueryIntegrityExeption("Field with same name already exists in the database");
      }
      
      QueryConnectField field = queryConnectFieldController.createQueryConnectField(event.getMaterial(), connectFieldMeta.getName());
      Map<String, QueryConnectFieldTerm> terms = new HashMap<String, QueryConnectFieldTerm>();
      Map<String, QueryConnectFieldCounterpart> counterparts = new HashMap<String, QueryConnectFieldCounterpart>();
      for (ConnectFieldOptionMeta option : connectFieldMeta.getFields()) {
        terms.put(option.getName(), queryConnectFieldController.createConnectFieldTerm(field, option.getName(), option.getText(), null));
      }
      for (ConnectFieldOptionMeta option : connectFieldMeta.getCounterparts()) {
        counterparts.put(option.getName(), queryConnectFieldController.createConnectFieldCounterpart(field, option.getName(), option.getText()));
      }
      for (ConnectFieldConnectionMeta connection : connectFieldMeta.getConnections()) {
        terms.get(connection.getField()).setCounterpart(counterparts.get(connection.getCounterpart()));
      }
    }
  }
  
  // Update
  
  // Organizer field
  public void onHtmlMaterialOrganizerFieldUpdated(@Observes HtmlMaterialFieldUpdateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.organizer")) {
      queryOrganizerFieldController.updateQueryOrganizerField(event.getMaterial(), event.getField(), event.getRemoveAnswers());
    }
  }
  // Select field
  public void onHtmlMaterialSelectFieldUpdated(@Observes HtmlMaterialFieldUpdateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.select")) {
      querySelectFieldController.updateQuerySelectField(event.getMaterial(), event.getField(), event.getRemoveAnswers());
    }
  }

  // Multi-select field
  public void onHtmlMaterialMultiSelectFieldUpdated(@Observes HtmlMaterialFieldUpdateEvent event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
    if (event.getField().getType().equals("application/vnd.muikku.field.multiselect")) {
      queryMultiSelectFieldController.updateQueryMultiSelectField(event.getMaterial(), event.getField(), event.getRemoveAnswers());
    }
  }
  
  // Delete
  
  public void onHtmlMaterialFieldDeleted(@Observes HtmlMaterialFieldDeleteEvent event) {
    HtmlMaterial material = event.getMaterial();
    QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(material, event.getField().getName());
    if (queryField != null) {
      queryFieldController.deleteQueryField(queryField, event.getRemoveAnswers());
    }
  }
  
}

package fi.muikku.plugins.material;

import java.io.IOException;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.events.HtmlMaterialFieldCreated;
import fi.muikku.plugins.material.events.HtmlMaterialFieldDeleted;
import fi.muikku.plugins.material.fieldmeta.MemoFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.TextFieldMeta;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.QueryField;
import fi.muikku.plugins.material.model.QueryMemoField;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

public class HtmlMaterialFieldChangeListener {
  
  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  @Inject
  private QueryMemoFieldController queryMemoFieldController;
  
  @Inject
  private QuerySelectFieldController querySelectFieldController;

  public void onHtmlMaterialTextFieldCreated(@Observes HtmlMaterialFieldCreated event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
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
  
  public void onHtmlMaterialMemoFieldCreated(@Observes HtmlMaterialFieldCreated event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
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
  
  public void onHtmlMaterialSelectFieldCreated(@Observes HtmlMaterialFieldCreated event) throws MaterialQueryIntegrityExeption, MaterialFieldMetaParsingExeption {
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
        QuerySelectFieldOption querySelectFieldOption = querySelectFieldController.findQuerySelectFieldOptionBySelectFieldAndName(querySelectField, selectFieldOptionMeta.getName());
        if (querySelectFieldOption == null) {
          querySelectFieldController.createQuerySelectFieldOption(querySelectField, selectFieldOptionMeta.getName(), selectFieldOptionMeta.getText());
        } else {
          querySelectFieldController.updateQuerySelectFieldOptionText(querySelectFieldOption, selectFieldOptionMeta.getText());
        }
      }
    }
  }
  
  public void onHtmlMaterialFieldDeleted(@Observes HtmlMaterialFieldDeleted event) {
    HtmlMaterial material = event.getMaterial();
    QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(material, event.getField().getName());
    if (queryField != null) {
      queryFieldController.deleteQueryField(queryField);
    }
  }
  
}

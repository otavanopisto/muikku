package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.field.ConnectField;
import fi.muikku.plugins.material.model.field.ConnectField.Connection;
import fi.muikku.plugins.material.model.field.ConnectField.Field;
import fi.muikku.plugins.materialfields.QueryConnectFieldController;
import fi.muikku.plugins.materialfields.model.QueryConnectField;
import fi.muikku.plugins.materialfields.model.QueryConnectFieldCounterpart;

public class ConnectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryConnectFieldController queryConnectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    ConnectField connectField = objectMapper.readValue(content, ConnectField.class);
    QueryConnectField queryConnectField = queryConnectFieldController.createQueryConnectField(material, connectField.getName(), Boolean.FALSE);
    
    Map<String, QueryConnectFieldCounterpart> counterpartMap = new HashMap<>();
    Map<String, String> connectionMap = new HashMap<>(); 
    for (Connection connection : connectField.getConnections()) {
      connectionMap.put(connection.getCounterpart(), connection.getField()); 
    }
    
    for (Field counterpart : connectField.getCounterparts()) {
      QueryConnectFieldCounterpart connectFieldCounterpart = queryConnectFieldController.createConnectFieldCounterpart(queryConnectField, counterpart.getName(), counterpart.getText()); 
      String termName = connectionMap.get(counterpart.getName());
      counterpartMap.put(termName, connectFieldCounterpart);
    }
    
    for (Field field : connectField.getFields()) {
      QueryConnectFieldCounterpart counterpart = counterpartMap.get(field.getName());
      queryConnectFieldController.createConnectFieldTerm(queryConnectField, field.getName(), field.getText(), counterpart);
    }
    
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.connect";
  }

}

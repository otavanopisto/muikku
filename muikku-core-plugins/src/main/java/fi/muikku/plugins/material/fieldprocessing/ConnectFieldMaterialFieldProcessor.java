package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.QueryConnectFieldController;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.ConnectFieldConnectionMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;

public class ConnectFieldMaterialFieldProcessor {

//  @Inject
//  private QueryConnectFieldController queryConnectFieldController;
//  
//  @Override
//  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
//    ObjectMapper objectMapper = new ObjectMapper();
//    
//    ConnectFieldMeta connectFieldMeta = objectMapper.readValue(content, ConnectFieldMeta.class);
//    
//    QueryConnectField queryConnectField = queryConnectFieldController.findQueryConnectFieldByMaterialAndName(material, connectFieldMeta.getName());
//    if (queryConnectField == null) {
//      queryConnectField = queryConnectFieldController.createQueryConnectField(material, connectFieldMeta.getName());
//    }
//
//    Map<String, QueryConnectFieldCounterpart> counterpartMap = new HashMap<>();
//    Map<String, String> connectionMap = new HashMap<>(); 
//    for (ConnectFieldConnectionMeta connectFieldConnectionMeta : connectFieldMeta.getConnections()) {
//      connectionMap.put(connectFieldConnectionMeta.getCounterpart(), connectFieldConnectionMeta.getField()); 
//    }
//    
//    for (ConnectFieldOptionMeta counterpart : connectFieldMeta.getCounterparts()) {
//      QueryConnectFieldCounterpart connectFieldCounterpart = queryConnectFieldController.findQueryConnectFieldCounterpartByFieldAndName(queryConnectField, counterpart.getName());
//      if (connectFieldCounterpart == null) {
//        connectFieldCounterpart = queryConnectFieldController.createConnectFieldCounterpart(queryConnectField, counterpart.getName(), counterpart.getText()); 
//      } else {
//        queryConnectFieldController.updateConnectFieldCounterpartText(connectFieldCounterpart, counterpart.getText());
//      }
//      
//      String termName = connectionMap.get(counterpart.getName());
//      counterpartMap.put(termName, connectFieldCounterpart);
//    }
//    
//    for (ConnectFieldOptionMeta connectFieldOptionMeta : connectFieldMeta.getFields()) {
//      QueryConnectFieldCounterpart counterpart = counterpartMap.get(connectFieldOptionMeta.getName());
//      QueryConnectFieldTerm queryConnectFieldTerm = queryConnectFieldController.findQueryConnectFieldTermByFieldAndName(queryConnectField, connectFieldOptionMeta.getName());
//      if (queryConnectFieldTerm == null) {
//        queryConnectFieldTerm = queryConnectFieldController.createConnectFieldTerm(queryConnectField, connectFieldOptionMeta.getName(), connectFieldOptionMeta.getText(), counterpart);
//      } else {
//        queryConnectFieldController.updateConnectFieldTermText(queryConnectFieldTerm, connectFieldOptionMeta.getText());
//        queryConnectFieldController.updateConnectFieldTermCounterpart(queryConnectFieldTerm, counterpart);
//      }
//    }
//    
//  }
//
//  @Override
//  public String getType() {
//    return "application/vnd.muikku.field.connect";
//  }

}

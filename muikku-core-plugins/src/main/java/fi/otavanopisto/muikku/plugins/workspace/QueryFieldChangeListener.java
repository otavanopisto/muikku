package fi.otavanopisto.muikku.plugins.workspace;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.plugins.material.MaterialFieldMetaParsingExeption;
import fi.otavanopisto.muikku.plugins.material.QueryConnectFieldController;
import fi.otavanopisto.muikku.plugins.material.dao.MaterialDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldCounterpartDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldDAO;
import fi.otavanopisto.muikku.plugins.material.dao.QueryConnectFieldTermDAO;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldDeleteEvent;
import fi.otavanopisto.muikku.plugins.material.events.QueryFieldUpdateEvent;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldConnectionMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldMeta;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.ConnectFieldOptionMeta;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.otavanopisto.muikku.plugins.material.model.QueryField;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialConnectFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;

public class QueryFieldChangeListener {
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;
  
  @Inject
  private MaterialDeleteController materialDeleteController;

  @Inject
  private MaterialDAO materialDAO;

  @Inject
  private QueryConnectFieldController queryConnectFieldController;

  @Inject
  private QueryConnectFieldDAO queryConnectFieldDAO;

  @Inject
  private QueryConnectFieldTermDAO queryConnectFieldTermDAO;

  @Inject
  private QueryConnectFieldCounterpartDAO queryConnectFieldCounterpartDAO;

  @Inject
  private WorkspaceMaterialFieldDAO workspaceMaterialFieldDAO; 

  @Inject
  private WorkspaceMaterialFieldAnswerDAO workspaceMaterialFieldAnswerDAO; 

  @Inject
  private WorkspaceMaterialConnectFieldAnswerDAO workspaceMaterialConnectFieldAnswerDAO; 
  
  public void onQueryConnectFieldUpdate(@Observes QueryFieldUpdateEvent event)  throws MaterialFieldMetaParsingExeption, WorkspaceMaterialContainsAnswersExeption {
    
    // Unlike other fields that are updated via WorkspaceMaterialFieldController, connect fields
    // are updated here since their basic structure is saved in QueryField and thanks to #5277,
    // that structure might have become corrupted on database level
    
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.connect")) {
      QueryField queryField = event.getQueryField();
      
      // Read the field's new metadata
      
      ObjectMapper objectMapper = new ObjectMapper();
      ConnectFieldMeta connectFieldMeta;
      try {
        connectFieldMeta = objectMapper.readValue(event.getMaterialField().getContent(), ConnectFieldMeta.class);
      }
      catch (IOException e) {
        throw new MaterialFieldMetaParsingExeption("Could not parse connect field meta", e);
      }
      
      // Terms and counterparts in database
      
      Material material = materialDAO.findById(queryField.getMaterial().getId());
      QueryConnectField field = queryConnectFieldDAO.findByMaterialAndName(material, event.getMaterialField().getName());
      List<QueryConnectFieldTerm> dbTerms = queryConnectFieldTermDAO.listByField(field);      
      List<QueryConnectFieldCounterpart> dbCounterparts = queryConnectFieldCounterpartDAO.listByField(field);
      
      // Recreate connect field if the term count differs between UI and database
      
      if (connectFieldMeta.getFields().size() != dbTerms.size()) {
        
        // Connect field structure has changed noticeably, so possible answers have become corrupt and need to be removed 
        
        List<WorkspaceMaterialConnectFieldAnswer> answers = new ArrayList<>();
        List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldDAO.listByQueryField(queryField);
        for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
          answers.addAll(workspaceMaterialConnectFieldAnswerDAO.listByWorkspaceMaterialField(workspaceMaterialField));
          
          // Immediately exit if any answers exist but we have no permission to remove them
          
          if (!answers.isEmpty() && !event.getRemoveAnswers()) {
            throw new WorkspaceMaterialContainsAnswersExeption("Could not update connect field because it contains answers");
          }
        }
        for (WorkspaceMaterialConnectFieldAnswer answer : answers) {
          workspaceMaterialFieldAnswerDAO.delete(answer);
        }
        
        // Recreate the terms and counterparts according to the new meta

        for (QueryConnectFieldTerm term : dbTerms) {
          queryConnectFieldTermDAO.delete(term);
        }
        for (QueryConnectFieldCounterpart counterpart : dbCounterparts) {
          queryConnectFieldCounterpartDAO.delete(counterpart);
        }
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
    // If term count is the same in meta and database, we could go through each term and counterpart here, just
    // to ensure that their texts would be up-to-date in database. This hasn't been done since the database
    // texts aren't even used; the UI uses the always up-to-date texts in field metadata
  }

  public void onQueryOrganizerFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.organizer")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }

  public void onQuerySorterFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.sorter")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }

  public void onQuerySelectFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.select")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }

  public void onQueryMultiSelectFieldUpdate(@Observes QueryFieldUpdateEvent event) {
    if (event.getMaterialField().getType().equals("application/vnd.muikku.field.multiselect")) {
      QueryField queryField = event.getQueryField();
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        workspaceMaterialFieldController.updateWorkspaceMaterialField(workspaceMaterialField, event.getMaterialField(), event.getRemoveAnswers());
      }
    }
  }
  
  public void onQueryFieldDelete(@Observes QueryFieldDeleteEvent event) throws WorkspaceMaterialContainsAnswersExeption {
    // TODO Eventually move this to MaterialDeleteController as well
    QueryField queryField = event.getQueryField();
    List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByQueryField(queryField);
    for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
      materialDeleteController.deleteWorkspaceMaterialField(workspaceMaterialField, event.getRemoveAnswers());
    }
  }
  
}

package fi.muikku.plugins.workspace;

import java.util.Map;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.materialfields.QueryFieldController;
import fi.muikku.plugins.materialfields.model.QuerySelectField;
import fi.muikku.plugins.materialfields.model.SelectFieldOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;

@Dependent
@Stateless
public class WorkspaceMaterialSelectFieldAnswerPersistenceHandler implements WorkspaceMaterialFieldAnswerPersistenceHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Inject
  private QueryFieldController queryFieldController;
  
  @Override
  public String getFieldType() {
    return "select";
  }

  @Override
  public void persistField(String fieldPrefix, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap) throws MaterialQueryIntegrityExeption {
    String parameterName = fieldPrefix + workspaceMaterialField.getName();
    String value = requestParameterMap.get(parameterName);
    QuerySelectField queryField = (QuerySelectField) workspaceMaterialField.getQueryField();
    SelectFieldOption option = null;
    if (StringUtils.isNotBlank(value)) {
      option = queryFieldController.findQuerySelectFieldOptionByFieldAndName(queryField, value);
      if (option == null) {
        throw new MaterialQueryIntegrityExeption("SelectFieldOption #" + queryField.getId() + " does not contain option '" + value + "'");
      }
    }
    
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByQueryFieldAndReply(queryField, reply);
    if (option != null) {
      if (fieldAnswer != null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSelectFieldAnswerValue(fieldAnswer, option);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSelectFieldAnswer(queryField, reply, option);
      }
    } else {
      if (fieldAnswer != null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSelectFieldAnswer(queryField, reply, null);
      }
    }
  }

  @Override
  public void loadField(String fieldPrefix, Document document, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField) throws MaterialQueryIntegrityExeption {
    String parameterName = fieldPrefix + workspaceMaterialField.getName();
    QuerySelectField queryField = (QuerySelectField) workspaceMaterialField.getQueryField();
    WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByQueryFieldAndReply(queryField, reply);
    if ((fieldAnswer != null) && (fieldAnswer.getValue() != null)) {
      String optionName = fieldAnswer.getValue().getName();
      
      try {
        Element optionElement = (Element) XPathFactory.newInstance().newXPath().evaluate("//SELECT[@name=\"" + parameterName + "\"]/OPTION[@value=\"" + optionName + "\"]", document, XPathConstants.NODE);
        if (optionElement != null) {
          optionElement.setAttribute("selected", "selected");
        } else {
          throw new MaterialQueryIntegrityExeption("Could not find select / option for field '" + queryField.getName() + "/" + optionName + "'");
        }
      } catch (XPathExpressionException e) {
        throw new MaterialQueryIntegrityExeption("Could not find select / option for field '" + queryField.getName() + "/" + optionName + "'");
      }
    }
  }

}

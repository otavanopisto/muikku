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
import fi.muikku.plugins.materialfields.model.QueryTextField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

@Dependent
@Stateless
public class WorkspaceMaterialTextFieldAnswerPersistenceHandler implements WorkspaceMaterialFieldAnswerPersistenceHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  
  @Override
  public String getFieldType() {
    return "text";
  }

  @Override
  public void persistField(String fieldPrefix, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap) throws MaterialQueryIntegrityExeption {
    String parameterName = fieldPrefix + workspaceMaterialField.getName();
    String value = requestParameterMap.get(parameterName);
    QueryTextField queryField = (QueryTextField) workspaceMaterialField.getQueryField();
    
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(queryField, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(queryField, reply, value);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, value);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, null);
      }
    }
  }

  @Override
  public void loadField(String fieldPrefix, Document document, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField) throws MaterialQueryIntegrityExeption {
    String parameterName = fieldPrefix + workspaceMaterialField.getName();
    
    QueryTextField queryField = (QueryTextField) workspaceMaterialField.getQueryField();
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(queryField, reply);
    if ((fieldAnswer != null) && StringUtils.isNotBlank(fieldAnswer.getValue())) {
      try {
        Element inputElement = (Element) XPathFactory.newInstance().newXPath().evaluate("//INPUT[@name=\"" + parameterName + "\"]|//TEXTAREA[@name=\"" + parameterName + "\"]", document, XPathConstants.NODE);
        if (inputElement != null) {
          if ("TEXTAREA".equals(inputElement.getTagName())) {
            inputElement.setTextContent(fieldAnswer.getValue());
          } else {
            inputElement.setAttribute("value", fieldAnswer.getValue());
          }
        } else {
          throw new MaterialQueryIntegrityExeption("Could not find input element for field '" + queryField.getName() + "'");
        }
      } catch (XPathExpressionException e) {
        throw new MaterialQueryIntegrityExeption("Could not find input element for field '" + queryField.getName() + "'");
      }
    }
  }
  

}

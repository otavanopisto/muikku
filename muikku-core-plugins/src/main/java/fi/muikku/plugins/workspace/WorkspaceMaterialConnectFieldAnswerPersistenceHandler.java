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
import org.w3c.dom.NodeList;

import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.model.QueryConnectField;
import fi.muikku.plugins.material.model.QueryTextField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

@Dependent
@Stateless
public class WorkspaceMaterialConnectFieldAnswerPersistenceHandler implements WorkspaceMaterialFieldAnswerPersistenceHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
  
  
  @Override
  public String getFieldType() {
    return "connect";
  }

  @Override
  public void persistField(String fieldPrefix, WorkspaceMaterialReply reply, WorkspaceMaterialField workspaceMaterialField, Map<String, String> requestParameterMap) throws MaterialQueryIntegrityExeption {
    String parameterName = fieldPrefix + workspaceMaterialField.getName();
    String value = requestParameterMap.get(parameterName);

    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(workspaceMaterialField, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(workspaceMaterialField, reply, value);
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
    
    QueryConnectField queryField = (QueryConnectField) workspaceMaterialField.getQueryField();
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(workspaceMaterialField, reply);
    if ((fieldAnswer != null) && StringUtils.isNotBlank(fieldAnswer.getValue())) {
      try {
        Element inputElement = (Element) XPathFactory.newInstance().newXPath().evaluate("//INPUT[@name=\"" + parameterName + "\"]|//TEXTAREA[@name=\"" + parameterName + "\"]", document, XPathConstants.NODE);
        if (inputElement != null) {
            inputElement.setAttribute("value", fieldAnswer.getValue());
        } else {
          throw new MaterialQueryIntegrityExeption("Could not find input element for field '" + queryField.getName() + "'");
        }
      } catch (XPathExpressionException e) {
        throw new MaterialQueryIntegrityExeption("Could not find input element for field '" + queryField.getName() + "'");
      }
    }
  }
  

}

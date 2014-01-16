package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPathExpressionException;

import org.apache.commons.lang3.StringUtils;
import org.xml.sax.SAXException;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLQueryParameter;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.materialfields.QueryFieldController;
import fi.muikku.plugins.materialfields.QueryTextFieldController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.LoggedIn;
import fi.muikku.session.SessionController;

@SuppressWarnings("el-syntax")
@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
  @URLMapping(
	  id = "workspace-html-material", 
  	pattern = "/workspace/#{workspaceHtmlMaterialBackingBean.workspaceUrlName}/materials.html/#{ /[a-zA-Z0-9_\\/\\.\\\\-][a-zA-Z0-9_\\/\\.\\\\-]*/ workspaceHtmlMaterialBackingBean.workspaceMaterialPath}", 
  	viewId = "/workspaces/workspace-html-material.jsf"
  )}
)
public class WorkspaceHtmlMaterialBackingBean {
	
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;
	
	@Inject
  private MaterialController materialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private QueryTextFieldController queryTextFieldController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;
  
  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;
	
	@URLAction 
	public void init() throws IOException, XPathExpressionException, SAXException, TransformerException {
	  // TODO: Proper error handling
	  
	  if (StringUtils.isBlank(getWorkspaceUrlName())) {
			throw new FileNotFoundException();
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(getWorkspaceUrlName());

		if (workspaceEntity == null) {
			throw new FileNotFoundException();
		}
		
		workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, getWorkspaceMaterialPath());
		if (workspaceMaterial == null) {
			throw new FileNotFoundException();
		}

	  if (!(workspaceMaterial.getMaterial() instanceof HtmlMaterial)) {
	  	throw new FileNotFoundException();
	  }
	  
	  
	  if (Boolean.TRUE == getEmbed()) {
	  	FacesContext.getCurrentInstance().getExternalContext().redirect(new StringBuilder()
        .append(FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath())
        .append("/workspace/")
        .append(workspaceEntity.getUrlName())
        .append("/materials/binary/")
        .append(workspaceMaterial.getPath())
        .toString());
	  } else {
	    HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
	    this.html = htmlMaterialController.getSerializedHtmlDocument(workspaceMaterial.getId().toString(), htmlMaterial);
	    
	    if (sessionController.isLoggedIn()) {
	      workspaceMaterialReply = workspaceMaterialReplyController.findMaterialReplyByMaterialAndUserEntity(workspaceMaterial, sessionController.getUser());
	      if (workspaceMaterialReply == null) {
	        workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, sessionController.getUser());
	      }
	    }
	  }
	}
	
	public Boolean getEmbed() {
		return embed;
	}
	
	public void setEmbed(Boolean embed) {
		this.embed = embed;
	}
	
	public String getWorkspaceMaterialPath() {
		return workspaceMaterialPath;
	}
	
	public void setWorkspaceMaterialPath(String workspaceMaterialPath) {
		this.workspaceMaterialPath = workspaceMaterialPath;
	}
	
	public String getWorkspaceUrlName() {
		return workspaceUrlName;
	}

	public void setWorkspaceUrlName(String workspaceUrlName) {
		this.workspaceUrlName = workspaceUrlName;
	}
	
	public String getHtml() {
    return html;
  }
	
  @LoggedIn
  public void save() {
    String queryFieldPrefix = "material-form:queryform:";

    Map<String, String> answers = new HashMap<>();
    Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();

    //TODO: create WorkspaceMaterialFields..
    
    Iterator<String> parameterNames = requestParameterMap.keySet().iterator();
    while (parameterNames.hasNext()) {
      String parameterName = parameterNames.next();
      if (StringUtils.startsWith(parameterName, queryFieldPrefix)) {
        String value = requestParameterMap.get(parameterName);
        answers.put(StringUtils.removeStart(parameterName, queryFieldPrefix), value);
        for(WorkspaceMaterialField field : workspaceMaterialFieldController.findWorkspaceMaterialFieldsByMaterial(workspaceMaterial)){
          if(field.getName().equals(parameterName)){
            workspaceMaterialFieldAnswerController.createWorkspaceMaterialFieldAnswer(workspaceMaterialReply, value, field);
          }
        }
      }

    }
    
  }
	
//	@LoggedIn
//  public void save() throws MaterialQueryIntegrityExeption {
//    String queryFieldPrefix = "material-form:queryform:";
//    
//    Map<String, String> answers = new HashMap<>();
//    Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
//    
//    Iterator<String> parameterNames = requestParameterMap.keySet().iterator();
//    while (parameterNames.hasNext()) {
//      String parameterName = parameterNames.next();
//      if (StringUtils.startsWith(parameterName, queryFieldPrefix)) {
//        String value = requestParameterMap.get(parameterName);
//        answers.put(StringUtils.removeStart(parameterName, queryFieldPrefix), value);
//      }
//    }
//    
//    saveAnswers(answers);
//  }
//
//  private void saveAnswers(Map<String, String> answers) throws MaterialQueryIntegrityExeption {
//    HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
//    
//    for (String name : answers.keySet()) {
//      String[] nameParts = name.split(":");
//      String fieldName = nameParts[nameParts.length - 1];
//      Material fieldMaterial = null;
//          
//      if (nameParts.length > 1) {
//        Long fieldMaterialId = NumberUtils.createLong(nameParts[nameParts.length - 2]);
//        Material material = materialController.findMaterialById(fieldMaterialId);
//        if (material == null) {
//          throw new MaterialQueryIntegrityExeption("Embedded field " + name + " points to non-existing material");
//        } 
//        
//        fieldMaterial = material;
//      } else {
//        fieldMaterial = htmlMaterial;
//      }
//      
//      QueryField queryField = queryFieldController.findQueryTextFieldByMaterialAndName(fieldMaterial, fieldName); 
//      if (queryField == null) {
//        throw new MaterialQueryIntegrityExeption("Material #" + fieldMaterial.getId() + " does not contain field '" + fieldName + "'");
//      }
//      
//      String value = answers.get(name);
//      if (queryField instanceof QueryTextField) {
//        QueryTextField queryTextField = (QueryTextField) queryField;
//        WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByQueryFieldAndReply(queryTextField, workspaceMaterialReply);
//        if (fieldAnswer != null) {
//          // Update answer
//          fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, value);
//        } else {
//          // Create answer
//          fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(queryTextField, workspaceMaterialReply, value);
//        }        
//      } else if (queryField instanceof QuerySelectField) {
//        QuerySelectField selectField = (QuerySelectField) queryField;
//        SelectFieldOption option = null;
//        if (StringUtils.isNotBlank(value)) {
//          option = queryFieldController.findQuerySelectFieldOptionByFieldAndName(selectField, value);
//          if (option == null) {
//            throw new MaterialQueryIntegrityExeption("SelectFieldOption #" + selectField.getId() + " does not contain option '" + value + "'");
//          }
//        }
//        
//        WorkspaceMaterialSelectFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialSelectFieldAnswerByQueryFieldAndReply(selectField, workspaceMaterialReply);
//        if (fieldAnswer != null) {
//          fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialSelectFieldAnswerValue(fieldAnswer, option);
//        } else {
//          fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialSelectFieldAnswer(selectField, workspaceMaterialReply, option);
//        }
//      }
//    }
//  }

	@URLQueryParameter ("embed")
	private Boolean embed;
	
	private String html;
	
	private String workspaceMaterialPath;

	private String workspaceUrlName;
	
	private WorkspaceMaterial workspaceMaterial;
	
	private WorkspaceMaterialReply workspaceMaterialReply;
}
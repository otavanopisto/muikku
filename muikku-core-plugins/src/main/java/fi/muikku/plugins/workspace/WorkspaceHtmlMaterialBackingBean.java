package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import javax.xml.transform.TransformerException;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLQueryParameter;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.MaterialQueryPersistanceExeption;
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
  
  private static final String FORM_ID = "material-form"; 
  private static final String FIELD_PREFIX = FORM_ID + ":queryform:";
  
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
  
  @Any
  @Inject
  private Instance<WorkspaceMaterialFieldAnswerPersistenceHandler> fieldPersistenceHandlers;
	
	@URLAction 
	public void init() throws IOException, XPathExpressionException, SAXException, TransformerException, MaterialQueryPersistanceExeption, MaterialQueryIntegrityExeption {
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
	  
	  // TODO: This should be done when the material is imported, not when it's viewed
	  try {
      workspaceMaterialFieldController.createWorkspaceMaterialFields(workspaceMaterial.getId().toString(), workspaceMaterial);
    } catch (MaterialQueryIntegrityExeption e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
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
	    String fieldPrefix = workspaceMaterial.getId().toString();
	    
      if (sessionController.isLoggedIn()) {
        workspaceMaterialReply = workspaceMaterialReplyController.findMaterialReplyByMaterialAndUserEntity(workspaceMaterial, sessionController.getUser());
        if (workspaceMaterialReply == null) {
          workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, sessionController.getUser());
        }
      }
	    
	    HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
	    Document processedHtmlDocument = htmlMaterialController.getProcessedHtmlDocument(fieldPrefix, htmlMaterial);
	    NodeList formElements = getDocumentFormElements(processedHtmlDocument);
	    
      htmlMaterialController.assignMaterialFieldNames(formElements, fieldPrefix, false);
      htmlMaterialController.attachMaterialFieldToForm(FORM_ID, FIELD_PREFIX, formElements);
      
      List<WorkspaceMaterialField> workspaceMaterialFields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
      for (WorkspaceMaterialField workspaceMaterialField : workspaceMaterialFields) {
        WorkspaceMaterialFieldAnswerPersistenceHandler fieldPersistenceHandler = getFieldPersistenceHandler(workspaceMaterialField);
        if (fieldPersistenceHandler == null) {
          throw new MaterialQueryPersistanceExeption("Field type " + workspaceMaterialField.getQueryField().getType() + " does not have a persistence handler");
        }
        
        fieldPersistenceHandler.loadField(FIELD_PREFIX, processedHtmlDocument, workspaceMaterialReply, workspaceMaterialField);
      }
      
	    this.html = htmlMaterialController.getSerializedHtmlDocument(fieldPrefix, processedHtmlDocument, htmlMaterial);
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
	
	public String getFormId() {
    return FORM_ID;
  }
	
  @LoggedIn
  public String save() throws MaterialQueryPersistanceExeption, MaterialQueryIntegrityExeption {
    Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
    
    List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
    for (WorkspaceMaterialField field : fields) {
      WorkspaceMaterialFieldAnswerPersistenceHandler fieldPersistenceHandler = getFieldPersistenceHandler(field);
      if (fieldPersistenceHandler != null) {
        fieldPersistenceHandler.persistField(FIELD_PREFIX, workspaceMaterialReply, field, requestParameterMap);
      } else {
        throw new MaterialQueryPersistanceExeption("Field type " + field.getQueryField().getType() + " does not have a persistence handler");
      }
    }
    
    return "pretty:workspace-html-material";
  }
	
  private WorkspaceMaterialFieldAnswerPersistenceHandler getFieldPersistenceHandler(WorkspaceMaterialField field) {
    Iterator<WorkspaceMaterialFieldAnswerPersistenceHandler> iterator = fieldPersistenceHandlers.iterator();
    while (iterator.hasNext()) {
      WorkspaceMaterialFieldAnswerPersistenceHandler persistenceHandler = iterator.next();
      if (persistenceHandler.getFieldType().equals(field.getQueryField().getType())) {
        return persistenceHandler;
      }
    }
    
    return null;
  }

  private NodeList getDocumentFormElements(Document document) throws XPathExpressionException {
    return (NodeList) XPathFactory.newInstance().newXPath().evaluate("//INPUT|//TEXTAREA|//SELECT", document, XPathConstants.NODESET);
  }

	@URLQueryParameter ("embed")
	private Boolean embed;
	
	private String html;
	
	private String workspaceMaterialPath;

	private String workspaceUrlName;
	
	private WorkspaceMaterial workspaceMaterial;
	
	private WorkspaceMaterialReply workspaceMaterialReply;
}
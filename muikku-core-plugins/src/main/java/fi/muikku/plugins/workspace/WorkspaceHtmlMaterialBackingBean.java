package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.MaterialQueryIntegrityExeption;
import fi.muikku.plugins.material.MaterialQueryPersistanceExeption;
import fi.muikku.plugins.material.fieldmeta.FieldMeta;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceFieldHandler;
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
@Join (path = "/workspace/{workspaceUrlName}/materials.html/{workspaceMaterialPath}", to = "/workspaces/workspace-html-material.jsf")
public class WorkspaceHtmlMaterialBackingBean {
  
  private static final String FORM_ID = "material-form"; 
  
  @Parameter ("embed")
  private Boolean embed;

  @Parameter
  private String workspaceUrlName;
  
  @Parameter
  @Matches ("[a-zA-Z0-9_\\/\\.\\\\-][a-zA-Z0-9_\\/\\.\\\\-]*")
  private String workspaceMaterialPath;
  
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceMaterialFieldController workspaceMaterialFieldController;
  
  @Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;
  
  @Any
  @Inject
  private Instance<WorkspaceFieldHandler> fieldHandlers;
  
	@RequestAction
	public void init() throws IOException, XPathExpressionException, SAXException, TransformerException, MaterialQueryIntegrityExeption {
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
	  
	  workspaceNavigationBackingBean.setWorkspaceUrlName(getWorkspaceUrlName());
	  
	  if (Boolean.TRUE == getEmbed()) {
	  	FacesContext.getCurrentInstance().getExternalContext().redirect(new StringBuilder()
        .append(FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath())
        .append("/workspace/")
        .append(workspaceEntity.getUrlName())
        .append("/materials/binary/")
        .append(workspaceMaterial.getPath())
        .toString());
	  } else {
      if (sessionController.isLoggedIn()) {
        workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, sessionController.getLoggedUserEntity());
        if (workspaceMaterialReply == null) {
          workspaceMaterialReply = workspaceMaterialReplyController.createWorkspaceMaterialReply(workspaceMaterial, sessionController.getLoggedUserEntity());
        }
      }
	    
	    HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
	    Document processedHtmlDocument = htmlMaterialController.getProcessedHtmlDocument(htmlMaterial);
	    renderDocumentFields(processedHtmlDocument);
      
	    this.html = htmlMaterialController.getSerializedHtmlDocument(processedHtmlDocument, htmlMaterial);
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
    Map<String, String[]> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterValuesMap();
    
    List<WorkspaceMaterialField> fields = workspaceMaterialFieldController.listWorkspaceMaterialFieldsByWorkspaceMaterial(workspaceMaterial);
    for (WorkspaceMaterialField field : fields) {
      WorkspaceFieldHandler fieldHandler = getFieldHandler(field.getQueryField().getType());
      if (fieldHandler != null) {
        fieldHandler.persistField(workspaceMaterialReply, field, requestParameterMap);
      } else {
        throw new MaterialQueryPersistanceExeption("Field type " + field.getQueryField().getType() + " does not have a persistence handler");
      }
    }
    
    return "pretty:workspace-html-material";
  }
  
  private void renderDocumentFields(Document document) throws MaterialQueryIntegrityExeption, XPathExpressionException, JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    List<String> assignedNames = new ArrayList<>();

    NodeList objectNodeList = document.getElementsByTagName("object");
    for (int i = objectNodeList.getLength() - 1; i >= 0; i--) {
      Element objectElement = (Element) objectNodeList.item(i);
      if (objectElement.hasAttribute("type")) {
        String type = objectElement.getAttribute("type");
        String content = (String) XPathFactory.newInstance().newXPath().evaluate("PARAM[@name=\"content\"]/@value", objectElement, XPathConstants.STRING);
        String embedId = objectElement.getAttribute("data-embed-id");
      
        WorkspaceFieldHandler fieldHandler = getFieldHandler(type);
        if (fieldHandler != null) {
          FieldMeta fieldMeta = objectMapper.readValue(content, FieldMeta.class);
          String assignedName = workspaceMaterialFieldController.getAssignedFieldName(workspaceMaterial.getId().toString(), embedId, fieldMeta.getName(), assignedNames);
          assignedNames.add(assignedName);
          String fieldName = DigestUtils.md5Hex(assignedName);
          WorkspaceMaterialField workspaceMaterialField = workspaceMaterialFieldController.findWorkspaceMaterialFieldByWorkspaceMaterialAndName(workspaceMaterial, fieldName);
          if (workspaceMaterialField != null) {
            fieldHandler.renderField(objectElement.getOwnerDocument(), objectElement, content, workspaceMaterialField, workspaceMaterialReply);
          } else {
            throw new MaterialQueryIntegrityExeption(workspaceMaterial.getId() + " does not contain field " + fieldName);
          }
        } 
      }
    }
  }
  
  private WorkspaceFieldHandler getFieldHandler(String type) {
    Iterator<WorkspaceFieldHandler> fieldHandlerIterator = fieldHandlers.iterator();
    while (fieldHandlerIterator.hasNext()) {
      WorkspaceFieldHandler fieldHandler = fieldHandlerIterator.next();
      if (fieldHandler.getType().equals(type)) {
        return fieldHandler;
      }
    }
    
    return null;
  }

	
	private String html;
	
	private WorkspaceMaterial workspaceMaterial;
	
	private WorkspaceMaterialReply workspaceMaterialReply;
}
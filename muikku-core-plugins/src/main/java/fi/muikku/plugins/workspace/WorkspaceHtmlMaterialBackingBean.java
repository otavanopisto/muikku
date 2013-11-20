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
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;

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
  private HtmlMaterialController htmlMaterialController;
	
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
		
		WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, getWorkspaceMaterialPath());
		if (workspaceMaterial == null) {
			throw new FileNotFoundException();
		}

	  Material material = workspaceMaterial.getMaterial();
	  if (!(material instanceof HtmlMaterial)) {
	  	throw new FileNotFoundException();
	  }
	  
	  HtmlMaterial htmlMaterial = (HtmlMaterial) material;
	  
	  if (Boolean.TRUE == getEmbed()) {
	  	FacesContext.getCurrentInstance().getExternalContext().redirect(new StringBuilder()
        .append(FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath())
        .append("/workspace/")
        .append(workspaceEntity.getUrlName())
        .append("/materials/binary/")
        .append(workspaceMaterial.getPath())
        .toString());
	  } else {
	    this.html = htmlMaterialController.getSerializedHtmlDocument(htmlMaterial);
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
	
	public void save() {
	  String queryFieldPrefix = "material-form:queryform:";
	  
	  Map<String, String> values = new HashMap<>();
	  Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
	  
	  Iterator<String> parameterNames = requestParameterMap.keySet().iterator();
	  while (parameterNames.hasNext()) {
	    String parameterName = parameterNames.next();
	    if (StringUtils.startsWith(parameterName, queryFieldPrefix)) {
	      String value = requestParameterMap.get(parameterName);
	      values.put(StringUtils.removeStart(parameterName, queryFieldPrefix), value);
	    }
	  }
	  
	  for (String key : values.keySet()) {
	    String value = values.get(key);
	    
	    System.out.println(key + " == " + value);
	  }
	}

	@URLQueryParameter ("embed")
	private Boolean embed;
	
	private String html;
	
	private String workspaceMaterialPath;

	private String workspaceUrlName;
}
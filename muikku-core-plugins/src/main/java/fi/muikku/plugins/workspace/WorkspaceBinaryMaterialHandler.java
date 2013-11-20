package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.regex.Pattern;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.RequestHandler;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;

@Stateless
public class WorkspaceBinaryMaterialHandler implements RequestHandler {

	@Inject
	private WorkspaceController workspaceController;

	@Inject
	private WorkspaceMaterialController workspaceMaterialController;
	
	public WorkspaceBinaryMaterialHandler() {
		pattern = Pattern.compile("\\/workspace\\/[a-zA-Z0-9\\_\\-\\.\\,]*\\/materials\\.binary\\/[a-zA-Z0-9_\\-\\.\\/]*");
	}

	@Override
	public boolean handleRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO: Security
		// TODO: Cache
		
		String pathInfo = StringUtils.removeStart(request.getRequestURI(), request.getContextPath());
		if (StringUtils.isNotBlank(pathInfo)) {
  		if (!pattern.matcher(pathInfo).matches()) {
  			return false;
  		}
  		
  		String[] pathParts = StringUtils.removeStart(pathInfo, "/workspace/").split("/", 3);
  		if (pathParts.length == 3) {
  			String workspaceUrl = pathParts[0];
  			String materialPath = pathParts[2];
  			
  			WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrl);
  			if (workspaceEntity == null) {
  				response.sendError(HttpServletResponse.SC_NOT_FOUND);
  				return true;
  			}
  			
  			WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, materialPath);
  			if (workspaceMaterial == null) {
  				response.sendError(HttpServletResponse.SC_NOT_FOUND);
  				return true;
  			}
  			
  			if (workspaceMaterial.getMaterial() instanceof BinaryMaterial) {
    			BinaryMaterial binaryMaterial = (BinaryMaterial) workspaceMaterial.getMaterial();
    			
    			response.setContentType(binaryMaterial.getContentType());
    			ServletOutputStream outputStream = response.getOutputStream();
    			try {
    				outputStream.write(binaryMaterial.getContent());
    			} finally {
    				outputStream.flush();
    			}
  			} else if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
  				HtmlMaterial htmlMaterial = (HtmlMaterial) workspaceMaterial.getMaterial();
    			
    			response.setContentType("text/html; charset=UTF-8");
    			ServletOutputStream outputStream = response.getOutputStream();
    			try {
    				outputStream.write(htmlMaterial.getHtml().getBytes("UTF-8"));
    			} finally {
    				outputStream.flush();
    			}
  			}
  			
  		} else {
  			response.sendError(HttpServletResponse.SC_NOT_FOUND);
				return true;
  		}
		}
		
		return false;
	}

	private Pattern pattern;
}

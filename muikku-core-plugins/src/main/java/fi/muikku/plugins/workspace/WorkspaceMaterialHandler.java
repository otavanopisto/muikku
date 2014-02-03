package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.util.regex.Pattern;

import javax.ejb.Stateless;
import javax.inject.Inject;
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
public class WorkspaceMaterialHandler implements RequestHandler {

	@Inject
	private WorkspaceController workspaceController;

	@Inject
	private WorkspaceMaterialController workspaceMaterialController;
	
	public WorkspaceMaterialHandler() {
		pattern = Pattern.compile("\\/workspace\\/[a-zA-Z0-9\\_\\-\\.\\,]*\\/materials\\/[a-zA-Z0-9_\\-\\.\\/]{1,}");
	}

	@Override
	public boolean handleRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
		// TODO: Security
		// TODO: Cache
		
		String pathInfo = StringUtils.removeStart(request.getRequestURI(), request.getContextPath());
		int querySeparatorIndex = pathInfo.indexOf("?");
		String matchedString;
		if (querySeparatorIndex == -1) {
		  matchedString = pathInfo;
		} else {
		  matchedString = pathInfo.substring(querySeparatorIndex);
		}
		
		if (StringUtils.isNotBlank(pathInfo)) {
  		if (!pattern.matcher(matchedString).matches()) {
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
  			  response.sendRedirect(request.getContextPath() + "/workspace/" + workspaceUrl + "/materials.binary/" + materialPath);
          return true;
  			} else if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
          response.sendRedirect(request.getContextPath() + "/workspace/" + workspaceUrl + "/materials.html/" + materialPath);
          return true;
  			} else {
  			  return false;
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

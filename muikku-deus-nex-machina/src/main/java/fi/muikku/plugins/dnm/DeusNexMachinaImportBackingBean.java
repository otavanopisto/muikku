package fi.muikku.plugins.dnm;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLQueryParameter;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.Admin;
import fi.muikku.security.LoggedIn;

@RequestScoped
@Stateful
@Named
@URLMappings (mappings = {
	  @URLMapping (
	    id = "deus-nex-machina-import",
	    pattern = "/deus-nex-machina/import",
	    viewId = "/dnm/import.jsf"
	  )
	})
public class DeusNexMachinaImportBackingBean {

	@Inject
	private WorkspaceController workspaceController;
	
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
	private DeusNexMachinaController deusNexMachinaController;

	@URLAction
	@LoggedIn
	@Admin
	public void load() throws IOException, ZipException, DeusNexException {
		// TODO: Security
		// TODO: Proper error handling
		
	  if (StringUtils.isBlank(targetFolder)) {
	    throw new FileNotFoundException();
	  }
	  
	  String[] targetFolderPath = StringUtils.stripStart(targetFolder, "/").split("/", 2);
	  String workspaceUrl = targetFolderPath[0];
	  String path = targetFolderPath[1];
	  WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrl);
	  if (workspaceEntity == null) {
      throw new FileNotFoundException();
	  }
	  
	  WorkspaceNode parentNode = null;
	  if (StringUtils.isBlank(path)) {
	    parentNode = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
	  } else {
	    String[] pathElements = path.split("/");
	    parentNode = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
	    WorkspaceNode parent = parentNode;
	    
	    for (int i = 0, l = pathElements.length; i < l; i++) {
	      String pathElement = pathElements[i];
	      parentNode = workspaceMaterialController.findWorkspaceNodeByParentAndUrlName(parent, pathElement);
	      if (parentNode == null) {
	        parentNode = workspaceMaterialController.createWorkspaceFolder(parent, pathElement, pathElement);
	      }

	      parent = parentNode;
	    }
	  }
	  
	  if (!((parentNode instanceof WorkspaceRootFolder)||(parentNode instanceof WorkspaceFolder))) {
	    // TODO: Proper exception
	    throw new RuntimeException("Invalid target folder");
	  }
	  
		File xmlFile = new File(getFile() + ".xml");
		if (!xmlFile.exists()) {
			File zipFile = new File(getFile() + ".zip");
			if (!zipFile.exists()) {
				throw new FileNotFoundException();
			} else {
				unzipFile(zipFile, xmlFile);
			}
		}
	
  	if (!xmlFile.exists()) {
  		throw new FileNotFoundException();
  	}
  	
  	InputStream inputStream = new FileInputStream(xmlFile);
  	try {
  	  deusNexMachinaController.importDeusNexDocument(parentNode, inputStream);
  	} finally {
  		inputStream.close();
  	}
	}

	private void unzipFile(File zipFile, File xmlFile) throws ZipException {
		ZipFile zipArchive = new ZipFile(zipFile);
	  zipArchive.setPassword(System.getProperty("muikku-deus-nex-machina-password"));
	  zipArchive.extractFile(xmlFile.getName(), xmlFile.getParent());
	}

	public String getFile() {
		return file;
	}
	
	public void setFile(String file) {
		this.file = file;
	}
	
	public String getTargetFolder() {
    return targetFolder;
  }
	
	public void setTargetFolder(String targetFolder) {
    this.targetFolder = targetFolder;
  }
	
	@URLQueryParameter (value = "file")
	private String file;
	
	@URLQueryParameter (value = "targetFolder")
	private String targetFolder;
}

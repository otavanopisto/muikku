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

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLQueryParameter;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.schooldata.WorkspaceController;

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
	private DeusNexMachinaController deusNexMachinaController;

	@URLAction
	public void load() throws IOException, ZipException, DeusNexException {
		// TODO: Security
		// TODO: Proper error handling
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
		
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
  	  deusNexMachinaController.importDeusNexDocument(workspaceEntity, inputStream);
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
	
	public Long getWorkspaceEntityId() {
		return workspaceEntityId;
	}
	
	public void setWorkspaceEntityId(Long workspaceEntityId) {
		this.workspaceEntityId = workspaceEntityId;
	}
	
	@URLQueryParameter (value = "file")
	private String file;
	
	@URLQueryParameter (value = "workspaceEntityId")
	private Long workspaceEntityId;
}

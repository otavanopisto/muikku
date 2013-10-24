package fi.muikku.plugins.dnm;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

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
	public void load() throws IOException {
		// TODO: Security
		// TODO: Proper error handling
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
		
		URL url = new URL(getScriptUrl());
		URLConnection connection = url.openConnection();
		connection.setDoInput(true);
		connection.setDoOutput(true);

		InputStream inputStream = connection.getInputStream();
		try {
			deusNexMachinaController.importDeusNexDocument(workspaceEntity, inputStream);
		} catch (DeusNexException e) {
			e.printStackTrace();
		} finally {
			inputStream.close();
		}
	}
	
	public String getScriptUrl() {
		return scriptUrl;
	}
	
	public void setScriptUrl(String scriptUrl) {
		this.scriptUrl = scriptUrl;
	}
	
	public Long getWorkspaceEntityId() {
		return workspaceEntityId;
	}
	
	public void setWorkspaceEntityId(Long workspaceEntityId) {
		this.workspaceEntityId = workspaceEntityId;
	}
	
	@URLQueryParameter (value = "file")
	private String scriptUrl;
	
	@URLQueryParameter (value = "workspaceEntityId")
	private Long workspaceEntityId;
}

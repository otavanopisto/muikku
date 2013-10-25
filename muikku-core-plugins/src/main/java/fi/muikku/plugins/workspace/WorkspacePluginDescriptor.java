package fi.muikku.plugins.workspace;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

@ApplicationScoped
@Stateful
public class WorkspacePluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor {

	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "workspace";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
			
			/* Controllers */
				
			WorkspaceMaterialController.class,
		  
			/* Backing beans */ 
				
			WorkspaceViewBackingBean.class,
			WorkspaceMaterialBackingBean.class,
			WorkspaceMaterialsBackingBean.class,
			
			/* Request Handlers */
			
			WorkspaceBinaryMaterialHandler.class,
			
			/* DAOs */
			
			WorkspaceRootFolderDAO.class,
			WorkspaceMaterialDAO.class,
			WorkspaceFolderDAO.class,
			WorkspaceNodeDAO.class
			
		}));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
			WorkspaceNode.class,
			WorkspaceRootFolder.class,
			WorkspaceFolder.class,
			WorkspaceMaterial.class
		};
	}

}

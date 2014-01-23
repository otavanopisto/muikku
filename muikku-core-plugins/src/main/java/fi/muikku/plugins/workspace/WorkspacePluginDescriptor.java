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

import fi.muikku.plugins.workspace.fieldhandler.WorkspaceConnectFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceMemoFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceSelectFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceTextFieldHandler;

import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialConnectFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialSelectFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialTextFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.plugins.workspace.rest.WorkspaceRESTService;

@ApplicationScoped
@Stateful
public class WorkspacePluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {

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
      WorkspaceMaterialReplyController.class,
      WorkspaceMaterialFieldAnswerController.class,
      WorkspaceMaterialFieldController.class,
		  
			/* Backing beans */ 
				
      WorkspaceNavigationBackingBean.class,
			WorkspaceIndexBackingBean.class,
      WorkspaceMembersBackingBean.class,
			WorkspaceHtmlMaterialBackingBean.class,
			WorkspaceMaterialsBackingBean.class,
			
			/* Request Handlers */
			
			WorkspaceBinaryMaterialHandler.class,
			WorkspaceMaterialHandler.class,
			
			/* DAOs */
			
			WorkspaceRootFolderDAO.class,
			WorkspaceMaterialDAO.class,
			WorkspaceFolderDAO.class,
			WorkspaceNodeDAO.class,
			WorkspaceMaterialReplyDAO.class,
      WorkspaceMaterialTextFieldAnswerDAO.class,
      WorkspaceMaterialSelectFieldAnswerDAO.class,
      WorkspaceMaterialConnectFieldAnswerDAO.class,
      WorkspaceMaterialFieldDAO.class,
      
      /* Field Handlers */
      
      WorkspaceTextFieldHandler.class,
      WorkspaceMemoFieldHandler.class,
      WorkspaceSelectFieldHandler.class,
      WorkspaceSelectFieldHandler.class,
      WorkspaceConnectFieldHandler.class,
      
      /* Listeners */
      
      WorkspaceMaterialCreateListener.class
			
		}));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
			WorkspaceNode.class,
			WorkspaceRootFolder.class,
			WorkspaceFolder.class,
			WorkspaceMaterial.class,
			WorkspaceMaterialReply.class,
			WorkspaceMaterialFieldAnswer.class,
			WorkspaceMaterialTextFieldAnswer.class,
			WorkspaceMaterialSelectFieldAnswer.class,
      WorkspaceMaterialConnectFieldAnswer.class,
			WorkspaceMaterialField.class
		};
	}

  @Override
  public Class<?>[] getRESTServices() {
    return new Class<?>[] {
      WorkspaceRESTService.class  
    };
  }

}

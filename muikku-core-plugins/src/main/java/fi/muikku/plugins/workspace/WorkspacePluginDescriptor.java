package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialChecklistFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialChecklistFieldAnswerOptionDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialConnectFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFieldDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialFileFieldAnswerFileDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialSelectFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialTextFieldAnswerDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceChecklistFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceConnectFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceFileFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceMemoFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceSelectFieldHandler;
import fi.muikku.plugins.workspace.fieldhandler.WorkspaceTextFieldHandler;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswerFile;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.plugins.workspace.rest.WorkspaceRESTService;

@ApplicationScoped
@Stateful
public class WorkspacePluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor, LocalizedPluginDescriptor {
	
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
      WorkspaceMaterialChecklistFieldAnswerDAO.class,
      WorkspaceMaterialChecklistFieldAnswerOptionDAO.class,
      WorkspaceMaterialFileFieldAnswerDAO.class,
      WorkspaceMaterialFileFieldAnswerFileDAO.class,
      
      /* Field Handlers */
      
      WorkspaceTextFieldHandler.class,
      WorkspaceMemoFieldHandler.class,
      WorkspaceSelectFieldHandler.class,
      WorkspaceConnectFieldHandler.class,
      WorkspaceChecklistFieldHandler.class,
      WorkspaceFileFieldHandler.class,
      
      /* Listeners */
      
      WorkspaceMaterialCreateListener.class,
      WorkspaceMaterialDeleteListener.class,
      
      /* SchoolDataEntityInitiators */
      
      WorkspaceRootFolderEntityInitiator.class
			
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
			WorkspaceMaterialField.class,
      WorkspaceMaterialChecklistFieldAnswer.class,
      WorkspaceMaterialChecklistFieldAnswerOption.class,
      WorkspaceMaterialFileFieldAnswer.class,
      WorkspaceMaterialFileFieldAnswerFile.class
		};
	}

  @Override
  public Class<?>[] getRESTServices() {
    return new Class<?>[] {
      WorkspaceRESTService.class  
    };
  }
  
  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.workspace.WorkspaceJsPluginMessages", LocaleUtils.toLocale("en"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.workspace.WorkspaceJsPluginMessages", LocaleUtils.toLocale("fi"))));
    return bundles;
  }

}

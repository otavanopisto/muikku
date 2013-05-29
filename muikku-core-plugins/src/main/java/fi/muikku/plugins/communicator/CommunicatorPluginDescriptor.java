package fi.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.Arrays;
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
import fi.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageIdDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageSignatureDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageTemplateDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.muikku.plugins.communicator.rest.CommunicatorRESTService;

@ApplicationScoped
@Stateful
public class CommunicatorPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor, LocalizedPluginDescriptor {
	
	@Override
	public String getName() {
		return "communicator";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
      CommunicatorMessageDAO.class,
      CommunicatorMessageIdDAO.class,
      CommunicatorMessageRecipientDAO.class,
      CommunicatorMessageTemplateDAO.class,
      CommunicatorMessageSignatureDAO.class,
		  
		  /* Controllers */
		  CommunicatorController.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
			CommunicatorMessage.class,
			CommunicatorMessageId.class,
			CommunicatorMessageRecipient.class,
			CommunicatorMessageTemplate.class,
			CommunicatorMessageSignature.class
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
			CommunicatorRESTService.class
		};
	}

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.communicator.CommunicatorJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}

package fi.muikku.plugins.logindetails;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.commonlog.LogProvider;

@ApplicationScoped
@Stateful
public class LoginDetailsPluginDescriptor implements PluginDescriptor {
	
	@Override
	public String getName() {
		return "login-details";
	}
	
	@Override
	public void init() {
	}

	@Override
	public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        LoginListener.class,
        LoginDetailController.class
    ));
	}

}

package fi.muikku.plugins.schooldatalocal;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.schooldatalocal.model.LocalUserImage;
import fi.muikku.plugins.schooldatalocal.model.LocalUserEmail;
import fi.muikku.plugins.schooldatalocal.model.LocalUserProperty;
import fi.muikku.plugins.schooldatalocal.model.LocalUserPropertyKey;
import fi.muikku.schooldata.SchoolDataController;

@ApplicationScoped
@Stateful
public class SchoolDataLocalPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor{

	@Inject
	private SchoolDataController schoolDataController;

	@Override
	public String getName() {
		return "school-data-local";
	}

	@Override
	public void init() {
		/**
		 * Ensure that SchoolDataSource is defined
		 */
		
		SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(LocalUserSchoolDataController.SCHOOL_DATA_SOURCE);
		if (schoolDataSource == null) {
			schoolDataController.createSchoolDataSource(LocalUserSchoolDataController.SCHOOL_DATA_SOURCE);
		}
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(LocalUserSchoolDataBridge.class));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
			LocalUser.class,
			LocalUserEmail.class,
			LocalUserImage.class,
			LocalUserPropertyKey.class,
			LocalUserProperty.class
		};
	}

}
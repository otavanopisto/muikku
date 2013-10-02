package fi.muikku.plugins.schooldatamock;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.AfterPluginInitEvent;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.schooldata.SchoolDataController;

@ApplicationScoped
@Stateful
public class SchoolDataMockPluginDescriptor implements PluginDescriptor {

	public static final String SCHOOL_DATA_SOURCE = "MOCK";

	@Inject
	private SchoolDataController schoolDataController;

	@Inject
	private MockedUserSchoolDataBridge userSchoolDataBridge;
	
	@Inject
	private SchoolDataMockPluginController schoolDataMockPluginController;

	@Override
	public String getName() {
		return "school-data-mock";
	}

	@Override
	public void init() {
		/**
		 * Ensure that SchoolDataSource is defined
		 */
		
		SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(SCHOOL_DATA_SOURCE);
		if (schoolDataSource == null) {
			schoolDataController.createSchoolDataSource(SCHOOL_DATA_SOURCE);
		}
		
	}
	
	public void onAfterPluginInit(@Observes AfterPluginInitEvent event) {
		if (("h2db".equals(event.getPluginLibrary()) && "h2db".equals(event.getPluginName())) || ("hsqldb".equals(event.getPluginLibrary()) && "hsqldb".equals(event.getPluginName()))) {
			onAfterDbPluginInit();
		} 
	}
	
	private void onAfterDbPluginInit() {
		/**
		 * Create tables
		 */
		try {
			schoolDataMockPluginController.executeScript(getScriptFile("create_tables.sql"));
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private File getScriptFile(String fileName) throws URISyntaxException {
		ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
		URL initalScript = contextClassLoader.getResource("META-INF/resources/" + fileName);
		return new File(initalScript.toURI());
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
				
				/* School Data Bridges */
				
				MockedUserSchoolDataBridge.class,
				MockedWorkspaceSchoolDataBridge.class,
				MockedGradingSchoolDataBridge.class,
				MockedCourseMetaSchoolDataBridge.class,
				
				/* Controllers */
				
				SchoolDataMockPluginController.class
		));
	}

}
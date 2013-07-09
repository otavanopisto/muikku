package fi.muikku.plugins.schooldatamock;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.hsqldb.cmdline.SqlToolError;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.AfterPluginInitEvent;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.hsqldb.HSQLDBPluginController;
import fi.muikku.schooldata.SchoolDataController;

@ApplicationScoped
@Stateful
public class SchoolDataMockPluginDescriptor implements PluginDescriptor {

	public static final String DATABASE_NAME = "school-data-mock";

	public static final String SCHOOL_DATA_SOURCE = "MOCK";

	@Inject
	private HSQLDBPluginController hsqldbPluginController;

	@Inject
	private SchoolDataController schoolDataController;

	@Inject
	private MockedUserSchoolDataBridge userSchoolDataBridge;

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
		if ("hsqldb".equals(event.getPluginLibrary()) && "hsqldb".equals(event.getPluginName())) {
			onAfterHsqlDbPluginInit();
		}
	}
	
	private void onAfterHsqlDbPluginInit() {
		/**
		 * Create tables
		 */
		try {
			createTables();
		} catch (SqlToolError | URISyntaxException | IOException | SQLException e) {
			// TODO Proper error handling
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}
	
	private File getScriptFile(String fileName) throws URISyntaxException {
		ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
		URL initalScript = contextClassLoader.getResource("META-INF/resources/" + fileName);
		return new File(initalScript.toURI());
	}

	private void createTables() throws URISyntaxException, IOException, SQLException, SqlToolError {
		Connection connection = hsqldbPluginController.getConnection(DATABASE_NAME);
		hsqldbPluginController.executeScript(connection, getScriptFile("create_tables.sql"));
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
				
				/* School Data Bridges */
				
				MockedUserSchoolDataBridge.class,
				MockedWorkspaceSchoolDataBridge.class
		));
	}

}
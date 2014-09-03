package fi.muikku.plugins.schooldatamock;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.plugin.AfterPluginInitEvent;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.schooldata.SchoolDataController;

public class SchoolDataMockPluginDescriptor implements PluginDescriptor {

	public static final String SCHOOL_DATA_SOURCE = "MOCK";

  @Inject
	private SchoolDataController schoolDataController;

  @Inject
	private SchoolDataMockPluginController schoolDataMockPluginController;
	
  @PostConstruct
  public void init() {
    /**
     * Ensure that SchoolDataSource is defined
     */
    
    SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(SCHOOL_DATA_SOURCE);
    if (schoolDataSource == null) {
      schoolDataController.createSchoolDataSource(SCHOOL_DATA_SOURCE);
    }
  }
  
	@Override
	public String getName() {
		return "school-data-mock";
	}
	
	public void onAfterPluginInit(@Observes AfterPluginInitEvent event) {
		if ("h2db".equals(event.getPluginName()) || "hsqldb".equals(event.getPluginName())) {
			onAfterDbPluginInit();
		} 
	}
	
	private void onAfterDbPluginInit() {
		/**
		 * Create tables
		 */
		try {
			ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
			InputStream scriptStream = contextClassLoader.getResourceAsStream("META-INF/resources/create_tables.sql");
			try {
				schoolDataMockPluginController.executeScript(scriptStream);
			} finally {
				scriptStream.close();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
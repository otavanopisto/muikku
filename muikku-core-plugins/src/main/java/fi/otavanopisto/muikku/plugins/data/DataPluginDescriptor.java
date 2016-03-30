package fi.otavanopisto.muikku.plugins.data;

import java.io.File;
import java.io.IOException;

import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang3.StringUtils;
import org.xml.sax.SAXException;

import fi.otavanopisto.muikku.plugin.AfterPluginsInitEvent;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class DataPluginDescriptor implements PluginDescriptor {

  @Override
  public void init() {
  }

	@Inject
	private DataPluginController dataPluginController;
	
  @Inject
  private PermissionsPluginController permissionsPluginController;
	
	@Override
	public String getName() {
		return "data";
	}
	
	public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
		String xmlFilePaths = System.getProperty("muikku-data");
		if (StringUtils.isNotBlank(xmlFilePaths)) {
			try {
			  String[] files = xmlFilePaths.split(",");
			  for (String file : files) {
  				dataPluginController.processScripts(new File(file));
			  }
			} catch (ParserConfigurationException | SAXException | IOException e) {
				// TODO: Proper error handling
				e.printStackTrace();
				throw new RuntimeException(e);
			}
		}

		// TODO:  this should be in permissiondataplugindescriptor but it's dependent on 
		//        being run after data import and as @observes cannot be prioritized we cant implement it 
    try {
      permissionsPluginController.processPermissions();
    } catch (Exception e) {
      // TODO: Proper error handling
      e.printStackTrace();
      throw new RuntimeException(e);
    }
		
	}
	
}

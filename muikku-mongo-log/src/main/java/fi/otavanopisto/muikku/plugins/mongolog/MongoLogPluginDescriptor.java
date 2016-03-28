package fi.otavanopisto.muikku.plugins.mongolog;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class MongoLogPluginDescriptor implements PluginDescriptor {
  
  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "mongo-log";
	}
	
}

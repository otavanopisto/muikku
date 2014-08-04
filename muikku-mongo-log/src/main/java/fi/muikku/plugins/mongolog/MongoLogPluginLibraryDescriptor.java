package fi.muikku.plugins.mongolog;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;

public class MongoLogPluginLibraryDescriptor implements PluginLibraryDescriptor {

  @Override
  public String getName() {
    return "mongo-log";
  }

  @Override
  public List<Class<? extends PluginDescriptor>> getPlugins() {
    return new ArrayList<Class<? extends PluginDescriptor>>(Arrays.asList(
      MongoLogPluginDescriptor.class
    ));
  }

}

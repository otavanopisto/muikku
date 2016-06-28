package fi.otavanopisto.muikku.plugins.timed.notifications;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import de.neuland.jade4j.template.TemplateLoader;

public class TimedNotificationsJadeTemplateLoader implements TemplateLoader {

  @Override
  public long getLastModified(String name) throws IOException {
    return -1;
  }

  @Override
  public Reader getReader(String name) throws IOException {
    if (!name.endsWith(".jade"))
      name = name + ".jade";
    
    InputStream resourceStream = getClass().getClassLoader().getResourceAsStream("/jade/" + name);
    if (resourceStream != null) {
      return new InputStreamReader(resourceStream);
    }
    
    return null;
  }

}

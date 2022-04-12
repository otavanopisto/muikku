package fi.otavanopisto.muikku.plugins.matriculation;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import javax.enterprise.context.ApplicationScoped;

import de.neuland.jade4j.template.TemplateLoader;

/**
 * Jade template for Matriculation plugin
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 */
@ApplicationScoped
public class MatriculationJadeTemplateLoader implements TemplateLoader {

  @Override
  public long getLastModified(String name) throws IOException {
    return -1;
  }

  @Override
  public Reader getReader(String name) throws IOException {
    if (!name.endsWith(".jade"))
      name = name + ".jade";
    
    InputStream resourceStream = getClass().getClassLoader().getResourceAsStream(String.format("/jade/%s", name));
    if (resourceStream != null) {
      return new InputStreamReader(resourceStream);
    }
    
    return null;
  }

}

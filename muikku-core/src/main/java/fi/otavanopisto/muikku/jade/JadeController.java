package fi.otavanopisto.muikku.jade;

import java.io.IOException;
import java.util.Map;

import de.neuland.jade4j.JadeConfiguration;
import de.neuland.jade4j.exceptions.JadeException;
import de.neuland.jade4j.template.JadeTemplate;

public class JadeController {

  public JadeTemplate getTemplate(JadeConfiguration config, String template) throws JadeException, IOException {
    return config.getTemplate(template);
  }
  
  public String renderTemplate(JadeConfiguration config, String template, Map<String, Object> model) throws JadeException, IOException {
    return renderTemplate(config, getTemplate(config, template), model);
  }
  
  public String renderTemplate(JadeConfiguration config, JadeTemplate template, Map<String, Object> model) {
    return config.renderTemplate(template, model);
  }
}

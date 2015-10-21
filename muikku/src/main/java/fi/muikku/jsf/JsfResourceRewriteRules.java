package fi.muikku.jsf;

import javax.servlet.ServletContext;

import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.rule.Join;

@RewriteConfiguration
public class JsfResourceRewriteRules extends HttpConfigurationProvider {

  @Override
  public Configuration getConfiguration(ServletContext context) {
    // TODO: Parameterize theme
    
    ConfigurationBuilder configuration = ConfigurationBuilder.begin();
    configuration.addRule(Join.path("/scripts/{file}").to("/faces/javax.faces.resource/scripts/{file}"))
                    .where("file").matches("[a-zA-Z0-9/_.\\-]*");
    configuration.addRule(Join.path("/css/{file}").to("/javax.faces.resource/css/{file}.jsf?ln=theme-muikku"));
    configuration.addRule(Join.path("/fonts/{file}").to("/javax.faces.resource/fonts/{file}.jsf?ln=theme-muikku"));
    
    return configuration;
  }

  @Override
  public int priority() {
    return 0;
  }
  
}

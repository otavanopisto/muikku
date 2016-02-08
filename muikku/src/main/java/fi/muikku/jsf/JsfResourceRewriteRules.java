package fi.muikku.jsf;

import javax.servlet.ServletContext;

import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.Substitute;
import org.ocpsoft.rewrite.servlet.config.rule.Join;

@RewriteConfiguration
public class JsfResourceRewriteRules extends HttpConfigurationProvider {

  @Override
  public Configuration getConfiguration(ServletContext context) {
    // TODO: Parameterize theme
    
    ConfigurationBuilder configuration = ConfigurationBuilder.begin();
    configuration.addRule(
      Join.path("/scripts/{file}")
        .to("/faces/javax.faces.resource/scripts/{file}"))
        .where("file")
        .matches("[a-zA-Z0-9/_.\\-]*");
    
    configuration.addRule(
      Join.path("/css/{file}")
        .to("/javax.faces.resource/css/{file}.jsf?ln=theme-muikku"))
        .where("file")
        .matches("[a-zA-Z0-9/_.\\-]*");
    
    configuration.addRule()
      .when(Path.matches("/icons/{file}"))
      .perform(Substitute.with("/javax.faces.resource/icons/{file}.jsf?ln=theme-muikku"))
      .where("file").matches("[a-zA-Z0-9/_.\\-]*");

    configuration.addRule()
      .when(Path.matches("/gfx/{file}"))
      .perform(Substitute.with("/javax.faces.resource/gfx/{file}.jsf?ln=theme-muikku"))
      .where("file").matches("[a-zA-Z0-9/_.\\-]*");
    
    return configuration;
  }

  @Override
  public int priority() {
    return 0;
  }
  
}

package fi.muikku.jsf;

import javax.servlet.ServletContext;

import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.rule.Join;

@RewriteConfiguration
public class JavaScriptRewriteRules extends HttpConfigurationProvider {

  @Override
  public Configuration getConfiguration(ServletContext context) {
    ConfigurationBuilder configuration = ConfigurationBuilder.begin();
    configuration.addRule(Join.path("/scripts/{file}").to("/faces/javax.faces.resource/scripts/{file}"));
    return configuration;
  }

  @Override
  public int priority() {
    return 0;
  }
  
}

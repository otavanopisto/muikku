package fi.muikku.plugins.workspace;

import javax.servlet.ServletContext;

import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.rule.Join;

@RewriteConfiguration
public class WorkspaceMaterialRewriteRules extends HttpConfigurationProvider {

  @Override
  public Configuration getConfiguration(ServletContext context) {
    ConfigurationBuilder configuration = ConfigurationBuilder.begin();
    
    configuration.addRule(
      Join.path("/workspace/{workspaceUrlName}/materials.binary/{materialPath}")
        .to("/workspaceBinaryMaterialsServlet?workspaceUrlname={workspaceUrlName}&workspaceMaterialUrlName={materialPath}")
    ).where("materialPath").matches("[a-zA-Z0-9/_.\\-]*");

    return configuration;
  }

  @Override
  public int priority() {
    return 0;
  }
  
}

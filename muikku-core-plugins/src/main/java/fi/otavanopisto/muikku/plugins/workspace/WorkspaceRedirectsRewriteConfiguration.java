package fi.otavanopisto.muikku.plugins.workspace;

import javax.servlet.ServletContext;

import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.config.Direction;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.Redirect;

@RewriteConfiguration
public class WorkspaceRedirectsRewriteConfiguration extends HttpConfigurationProvider {

  @Override
  public Configuration getConfiguration(ServletContext context) {
    Configuration config = ConfigurationBuilder.begin()
      .addRule()
      .when(
        Direction.isInbound()
          .and(Path.matches("/workspace/{workspaceUrlName}/"))
      )
      .perform(Redirect.permanent("/workspace/{workspaceUrlName}"))
      .where("workspaceUrlName").matches(".*");
    
    return config;
  }

  @Override
  public int priority() {
    return 0;
  }

}

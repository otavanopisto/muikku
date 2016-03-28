package fi.otavanopisto.muikku.plugins.workspace;

import java.util.HashSet;
import java.util.Set;

import javax.inject.Inject;
import javax.servlet.ServletContext;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.config.Direction;
import org.ocpsoft.rewrite.context.EvaluationContext;
import org.ocpsoft.rewrite.param.ParameterStore;
import org.ocpsoft.rewrite.param.ParameterValueStore;
import org.ocpsoft.rewrite.param.Parameterized;
import org.ocpsoft.rewrite.servlet.config.HttpCondition;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.Substitute;
import org.ocpsoft.rewrite.servlet.config.rule.Join;
import org.ocpsoft.rewrite.servlet.http.event.HttpServletRewrite;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;

@RewriteConfiguration
public class WorkspaceMaterialRewriteRules extends HttpConfigurationProvider {
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Override
  public Configuration getConfiguration(ServletContext context) {
    ConfigurationBuilder configuration = ConfigurationBuilder.begin();
    
    configuration.addRule()
      .when(Direction.isInbound()
          .and(Path.matches("/workspace/{workspaceUrlName}/materials/{materialPath}"))
          .and(new WorkspaceMaterialTypeRule("workspaceUrlName", "materialPath", "materialType")))
      .perform(Substitute.with("/workspace/{workspaceUrlName}/materials.{materialType}/{materialPath}"))
      .where("materialPath").matches("[a-zA-Z0-9/_.\\-]*");

    configuration
      .addRule(Join.path("/workspace/{workspaceUrlName}/materials.binary/{materialPath}").to("/workspaceBinaryMaterialsServlet?workspaceUrlname={workspaceUrlName}&workspaceMaterialUrlName={materialPath}")).where("materialPath")
        .matches("[a-zA-Z0-9/_.\\-]*");

    return configuration;
  }

  @Override
  public int priority() {
    return 0;
  }

  private class WorkspaceMaterialTypeRule extends HttpCondition implements Parameterized {
    
    public WorkspaceMaterialTypeRule(String workspaceUrlNameParam, String materialPathParam, String materialTypeParam) {
      this.workspaceUrlNameParam = workspaceUrlNameParam;
      this.materialPathParam = materialPathParam;
      this.materialTypeParam = materialTypeParam;
    }

    @Override
    public Set<String> getRequiredParameterNames() {
      Set<String> result = new HashSet<>();
      result.add(workspaceUrlNameParam);
      result.add(materialPathParam);
      result.add(materialTypeParam);
      return result;
    }

    @Override
    public void setParameterStore(ParameterStore store) {
      this.parameterStore = store;
    }

    @Override
    public boolean evaluateHttp(HttpServletRewrite event, EvaluationContext context) {
      ParameterValueStore parameterValueStore = (ParameterValueStore) context.get(ParameterValueStore.class);
      String workspaceUrlName = parameterValueStore.retrieve(parameterStore.get(this.workspaceUrlNameParam));
      String materialPath = parameterValueStore.retrieve(parameterStore.get(this.materialPathParam));
      
      if (StringUtils.isNotBlank(workspaceUrlName) && StringUtils.isNotBlank(materialPath)) {
        
        WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
        if (workspaceEntity == null) {
          return false;
        }
        
        WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, materialPath);
        if (workspaceMaterial == null) {
          return false;
        }
        
        Material material = workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);
        if (material == null) {
          return false;
        }
        
        parameterValueStore.submit(event, context, parameterStore.get(this.materialTypeParam), material.getType());
        
        return true;
      }
      
      return false;
    }

    private ParameterStore parameterStore;
    private String workspaceUrlNameParam;
    private String materialPathParam;
    private String materialTypeParam;
  }

}

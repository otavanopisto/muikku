package fi.otavanopisto.muikku.plugins.workspace.rest;

import java.security.SecureRandom;
import java.util.List;
import java.util.Random;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.workspace.ContentNode;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

@ApplicationScoped
public class Randomamaattori {

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @PostConstruct
  public void init() {
    random = new SecureRandom();
  }
  
  public void randomosoi(List<ContentNode> workspaceMaterials) {
    WorkspaceMaterial winDoc = workspaceMaterialController.findWorkspaceMaterialById(1947L);
    WorkspaceMaterial failDoc = workspaceMaterialController.findWorkspaceMaterialById(1948L);
    List<WorkspaceMaterial> wins = workspaceMaterialController.listWorkspaceMaterialsByParent(winDoc);
    List<WorkspaceMaterial> fails = workspaceMaterialController.listWorkspaceMaterialsByParent(failDoc);
    for (ContentNode folder : workspaceMaterials) {
      for (ContentNode content : folder.getChildren()) {
        if (StringUtils.contains(content.getHtml(), "[[WIN]]") && !wins.isEmpty()) {
          WorkspaceMaterial randomWin = wins.get(random.nextInt(wins.size()));
          content.setHtml(StringUtils.replace(content.getHtml(), "[[WIN]]", String.format("<img src=\"https://staging.muikkuverkko.fi/workspace/meemivarasto/materials/meemikansio/wins/%s\"/>", randomWin.getUrlName())));
        }
        if (StringUtils.contains(content.getHtml(), "[[FAIL]]") && !fails.isEmpty()) {
          WorkspaceMaterial randomFail = fails.get(random.nextInt(fails.size()));
          content.setHtml(StringUtils.replace(content.getHtml(), "[[FAIL]]", String.format("<img src=\"https://staging.muikkuverkko.fi/workspace/meemivarasto/materials/meemikansio/fails/%s\\\"/>", randomFail.getUrlName())));
        }
      }
    }
  }
  
  private Random random;

}

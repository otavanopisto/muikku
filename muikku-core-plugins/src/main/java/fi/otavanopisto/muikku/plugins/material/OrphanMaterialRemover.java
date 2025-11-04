package fi.otavanopisto.muikku.plugins.material;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import org.apache.commons.codec.binary.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.plugins.material.dao.MaterialDAO;
import fi.otavanopisto.muikku.plugins.material.dao.OrphanMaterialDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.OrphanMaterial;
import fi.otavanopisto.muikku.plugins.workspace.MaterialDeleteController;

@Startup
@Singleton
public class OrphanMaterialRemover {

  @Inject
  private Logger logger;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private MaterialDeleteController materialDeleteController;
  
  @Inject
  private MaterialDAO materialDAO;
  
  @Inject
  private OrphanMaterialDAO orphanMaterialDAO;

  @Schedule(hour = "*", minute = "*/10", persistent = false)
  public void cleanup() {
    String setting = systemSettingsController.getSetting("materials.orphanRemoval");
    if (StringUtils.equals(setting, "1")) {
      List<OrphanMaterial> orphans = orphanMaterialDAO.getBatch(10);
      if (orphans.isEmpty()) {
        logger.info("All orphan materials deleted, kill me now");
        systemSettingsController.setSetting("materials.orphanRemoval", "0");
      }
      else {
        for (OrphanMaterial orphan : orphans) {
          try {
            Material material = materialDAO.findById(orphan.getId());
            materialDeleteController.deleteMaterial(material);
            orphanMaterialDAO.delete(orphan);
          }
          catch (Exception e) {
            logger.log(Level.SEVERE, "Orphan material removal failure", e);
            systemSettingsController.setSetting("materials.orphanRemoval", "0");
          }
        }
        logger.info(String.format("Deleted %d orphan materials", orphans.size()));
      }
    }
  }

}

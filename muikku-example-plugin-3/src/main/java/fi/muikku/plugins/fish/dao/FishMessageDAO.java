package fi.otavanopisto.muikku.plugins.fish.dao;

import fi.otavanopisto.muikku.dao.DAO;
import fi.otavanopisto.muikku.dao.PluginDAO;
import fi.otavanopisto.muikku.plugins.fish.model.FishMessage;

@DAO
public class FishMessageDAO extends PluginDAO<FishMessage> {

  /**
   * 
   */
  private static final long serialVersionUID = -19075691136L;
  
  public FishMessage create(String content) {
    FishMessage fishMessage = new FishMessage();
    fishMessage.setContent(content);
    getEntityManager().persist(fishMessage);
    return fishMessage;
  }
  
  public void delete(FishMessage fishMessage) {
    super.delete(fishMessage);
  }
}
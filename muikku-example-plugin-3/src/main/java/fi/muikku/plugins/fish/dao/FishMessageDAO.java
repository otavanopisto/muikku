package fi.muikku.plugins.fish.dao;

import fi.muikku.dao.DAO;
import fi.muikku.dao.PluginDAO;
import fi.muikku.plugins.fish.model.FishMessage;

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
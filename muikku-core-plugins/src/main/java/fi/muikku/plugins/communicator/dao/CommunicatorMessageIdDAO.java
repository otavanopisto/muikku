package fi.muikku.plugins.communicator.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;

@DAO
public class CommunicatorMessageIdDAO extends PluginDAO<CommunicatorMessageId> {
	
  private static final long serialVersionUID = -7513353900590903561L;

  public CommunicatorMessageId create() {
    CommunicatorMessageId communicatorMessageId = new CommunicatorMessageId();
    
    getEntityManager().persist(communicatorMessageId);
    
    return communicatorMessageId;
  }
  
}

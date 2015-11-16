package fi.muikku.plugins.communicator.dao;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;


public class CommunicatorMessageIdDAO extends CorePluginsDAO<CommunicatorMessageId> {
	
  private static final long serialVersionUID = -7513353900590903561L;

  public CommunicatorMessageId create() {
    CommunicatorMessageId communicatorMessageId = new CommunicatorMessageId();
    
    getEntityManager().persist(communicatorMessageId);
    
    return communicatorMessageId;
  }
  
  @Override
  public void delete(CommunicatorMessageId e) {
    super.delete(e);
  }
}

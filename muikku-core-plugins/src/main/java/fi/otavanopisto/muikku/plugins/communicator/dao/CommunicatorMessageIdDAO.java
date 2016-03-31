package fi.otavanopisto.muikku.plugins.communicator.dao;


import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;


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

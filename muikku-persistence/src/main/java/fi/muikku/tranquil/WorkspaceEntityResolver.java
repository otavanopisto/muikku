package fi.muikku.tranquil;

import fi.muikku.dao.workspace.WorkspaceEntityDAO;

public class WorkspaceEntityResolver extends AbstractTranquilEntityResolver {
  
  @Override
  public Object resolveEntity(Object id) {
    try {
      WorkspaceEntityDAO workspaceEntityDAO = (WorkspaceEntityDAO) getManagedBean(WorkspaceEntityDAO.class);
      
      return workspaceEntityDAO.findById((Long) id);
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    
    return null;
  }
  
}

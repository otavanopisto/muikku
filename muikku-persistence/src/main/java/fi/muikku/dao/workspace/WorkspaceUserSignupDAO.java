package fi.muikku.dao.workspace;

import java.util.Date;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserSignup;

public class WorkspaceUserSignupDAO extends CoreDAO<WorkspaceUserSignup> {

  private static final long serialVersionUID = -4056985051421731486L;

  public WorkspaceUserSignup create(WorkspaceEntity workspaceEntity, UserEntity userEntity, Date date, String message) {
    WorkspaceUserSignup signup = new WorkspaceUserSignup();
    
    signup.setDate(date);
    signup.setMessage(message);
    signup.setUserEntity(userEntity);
    signup.setWorkspaceEntity(workspaceEntity);
    
    getEntityManager().persist(signup);
    return signup;
  }

  
}

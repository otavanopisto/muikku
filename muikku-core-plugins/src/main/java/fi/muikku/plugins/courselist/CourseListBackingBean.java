package fi.muikku.plugins.courselist;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.courses.CourseUserDAO;
import fi.muikku.model.courses.CourseUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.session.SessionController;

@RequestScoped
@Named ("CourseList")
public class CourseListBackingBean {

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private CourseListSelectionDAO courseListSelectionDAO;
  
  @Inject
  private CourseUserDAO courseUserDAO;
  
  @Inject
  private UserFavouriteWorkspaceDAO userFavouriteWorkspaceDAO;
  
  public List<Workspace> listWorkspacesByContext(String context, String defaultSelection) {
    UserEntity userEntity = sessionController.getUser();
    
    CourseListSelection listSelection = courseListSelectionDAO.findByUserAndContext(userEntity, context);
    CourseListSelectionEnum selection;
    
    if (listSelection != null)
      selection = listSelection.getSelection();
    else {
      selection = CourseListSelectionEnum.valueOf(defaultSelection);
    }
    
    switch (selection) {
      case MY_COURSES: {
        List<CourseUser> courseUsers = courseUserDAO.listByUser(userEntity);
        List<Workspace> workspaces = new ArrayList<Workspace>();
        
        for (CourseUser courseUser : courseUsers) {
          Workspace workspace = workspaceController.findWorkspace(courseUser.getCourse());
          workspaces.add(workspace);
        }
        
        return workspaces;
      }
        
      case FAVOURITES: {
        List<UserFavouriteWorkspace> userFavourites = userFavouriteWorkspaceDAO.listByUser(userEntity);
        List<Workspace> workspaces = new ArrayList<Workspace>();
        
        for (UserFavouriteWorkspace userFavourite : userFavourites) {
          Long workspaceId = userFavourite.getWorkspaceEntity(); 
          WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
          Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
          workspaces.add(workspace);
        }
        
        return workspaces;
      }
      
      default:
        throw new RuntimeException("Selection type not covered.");
    }
  }
}

package fi.otavanopisto.muikku.plugins.courselist;


//@RequestScoped
//@Named ("CourseList")
public class CourseListBackingBean {

  /**
   * Commented, not in use currently and move the code to REST service
   */
  
//  @Inject
//  private WorkspaceController workspaceController;
//  
//  @Inject
//  private SessionController sessionController;
//  
//  @Inject
//  private CourseListSelectionDAO courseListSelectionDAO;
//  
//  @Inject
//  private WorkspaceUserEntityController workspaceUserEntityController;
//  
//  @Inject
//  private UserFavouriteWorkspaceDAO userFavouriteWorkspaceDAO;
//  
//  /**
//   * Lists workspaces by selection, context and logged user.
//   * 
//   * @return
//   */
//  public List<Workspace> listWorkspacesByContext() {
//    UserEntity userEntity = sessionController.getLoggedUserEntity();
//    
//    CourseListSelectionEnum selection = getContextSelection();
//    
//    switch (selection) {
//      case MY_COURSES: {
//        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByUserEntity(userEntity);
//        List<Workspace> workspaces = new ArrayList<Workspace>();
//        
//        for (WorkspaceUserEntity workspaceUser : workspaceUsers) {
//          Workspace workspace = workspaceController.findWorkspace(workspaceUser.getWorkspaceEntity());
//          workspaces.add(workspace);
//        }
//        
//        return orderWorkspaces(workspaces);
//      }
//        
//      case FAVOURITES: {
//        List<UserFavouriteWorkspace> userFavourites = userFavouriteWorkspaceDAO.listByUser(userEntity);
//        List<Workspace> workspaces = new ArrayList<Workspace>();
//        
//        for (UserFavouriteWorkspace userFavourite : userFavourites) {
//          Long workspaceId = userFavourite.getWorkspaceEntity(); 
//          WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
//          Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
//          workspaces.add(workspace);
//        }
//        
//        return orderWorkspaces(workspaces);
//      }
//      
//      default:
//        throw new RuntimeException("Selection type not covered.");
//    }
//  }
//
//  /**
//   * Saves list selection for current logged user and context. 
//   */
//  public void saveSettings() {
//    UserEntity user = sessionController.getLoggedUserEntity();
//    CourseListSelection selection = courseListSelectionDAO.findByUserAndContext(user, context);
//    
//    if (selection == null)
//      courseListSelectionDAO.create(user, context, courseListSelection);
//    else
//      courseListSelectionDAO.updateSelection(selection, courseListSelection);
//  }
//  
//  /**
//   * Returns selection enum from database for current logged user and given context.
//   * If selection doesn't exist, default selection is used.
//   * 
//   * @param context
//   * @param defaultSelection
//   * @return
//   */
//  private CourseListSelectionEnum getContextSelection() {
//    UserEntity userEntity = sessionController.getLoggedUserEntity();
//    
//    CourseListSelection listSelection = courseListSelectionDAO.findByUserAndContext(userEntity, context);
//    CourseListSelectionEnum selection;
//    
//    if (listSelection != null)
//      selection = listSelection.getSelection();
//    else {
//      selection = CourseListSelectionEnum.valueOf(defaultSelection);
//    }
//    
//    return selection;
//  }
//  
//  private List<Workspace> orderWorkspaces(List<Workspace> workspaces) {
//    Collections.sort(workspaces, new Comparator<Workspace>() {
//
//      @Override
//      public int compare(Workspace o1, Workspace o2) {
//        String n1 = o1.getName();
//        String n2 = o2.getName();
//        
//        return n1 == null ? n2 == null ? 0 : -1 : n2 == null ? 1 : n1.compareTo(n2);
//      }
//      
//    });
//    
//    return workspaces;
//  }
//  
//  public CourseListSelectionEnum getCourseListSelection() {
//    if (courseListSelection == null)
//      courseListSelection = getContextSelection();
//    
//    return courseListSelection;
//  }
//
//  public void setCourseListSelection(CourseListSelectionEnum courseListSelection) {
//    this.courseListSelection = courseListSelection;
//  }
//
//  public Map<String,Object> getCourseListSelectionValues() {
//    return courseListSelectionValues;
//  }  
//  
//  public String getContext() {
//    return context;
//  }
//
//  public void setContext(String context) {
//    this.context = context;
//  }
//
//  public String getDefaultSelection() {
//    return defaultSelection;
//  }
//
//  public void setDefaultSelection(String defaultSelection) {
//    this.defaultSelection = defaultSelection;
//  }
//
//  // Label, Value
//  private static Map<String,Object> courseListSelectionValues;
//  
//  static {
//    courseListSelectionValues = new LinkedHashMap<String, Object>();
//    for (CourseListSelectionEnum v : CourseListSelectionEnum.values()) {
//      courseListSelectionValues.put(v.name(), v);
//    }
//  }
//
//  private String context;
//  private String defaultSelection;   
//  private CourseListSelectionEnum courseListSelection;
}

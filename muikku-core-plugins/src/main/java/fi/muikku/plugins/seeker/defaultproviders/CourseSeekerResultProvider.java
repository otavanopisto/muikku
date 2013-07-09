package fi.muikku.plugins.seeker.defaultproviders;


public class CourseSeekerResultProvider {
//implements SeekerResultProvider {
//
//  @Inject
//  private SessionController sessionController;
//  
//  @Inject
//  private LocaleController localeController;
//  
//  @Inject
//  private CourseController courseController;
//  
//  @Override
//  public List<SeekerResult> search(String searchTerm) {
//    return seekerify(courseController.listCourses(), searchTerm);
//  }
//
//  private List<SeekerResult> seekerify(List<WorkspaceEntity> courses, String searchTerm) {
//    List<SeekerResult> result = new ArrayList<SeekerResult>();
//
//    searchTerm = searchTerm.toLowerCase();
//    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.courses");
//
//    for (WorkspaceEntity c : courses) {
//      Course c2 = courseController.findCourse(c);
//      
//      // TODO remove
//      if ((c2.getName().toLowerCase().contains(searchTerm)) || (c2.getDescription().toLowerCase().contains(searchTerm)))
//        result.add(new DefaultSeekerResultImpl(c2.getName(), caption, "/course/index.jsf?courseId=" + c.getId(), ""));
//    }
//    
//    return result;
//  }
//  
}

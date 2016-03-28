package fi.otavanopisto.muikku.plugins.wall;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.enterprise.context.Dependent;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.controller.ResourceRightsController;
import fi.otavanopisto.muikku.events.CourseEntityEvent;
import fi.otavanopisto.muikku.events.CourseUserEvent;
import fi.otavanopisto.muikku.events.Created;
import fi.otavanopisto.muikku.events.UserEntityEvent;
import fi.otavanopisto.muikku.model.security.ResourceRights;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.otavanopisto.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.wall.dao.EnvironmentWallDAO;
import fi.otavanopisto.muikku.plugins.wall.dao.UserWallDAO;
import fi.otavanopisto.muikku.plugins.wall.dao.UserWallSubscriptionDAO;
import fi.otavanopisto.muikku.plugins.wall.dao.WallDAO;
import fi.otavanopisto.muikku.plugins.wall.dao.WallEntryDAO;
import fi.otavanopisto.muikku.plugins.wall.dao.WallEntryReplyDAO;
import fi.otavanopisto.muikku.plugins.wall.dao.WorkspaceWallDAO;
import fi.otavanopisto.muikku.plugins.wall.model.EnvironmentWall;
import fi.otavanopisto.muikku.plugins.wall.model.UserWall;
import fi.otavanopisto.muikku.plugins.wall.model.Wall;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntry;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntryReply;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntryVisibility;
import fi.otavanopisto.muikku.plugins.wall.model.WorkspaceWall;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Dependent
@Named("Wall")
public class WallController {
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private WallDAO wallDAO;

  @Inject
  private WallEntryDAO wallEntryDAO;

  @Inject
  private UserWallDAO userWallDAO;

  @Inject
  private UserWallSubscriptionDAO userWallLinkDAO;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceWallDAO workspaceWallDAO;

  @Inject
  private WallEntryReplyDAO wallEntryCommentDAO;

  @Inject
  private EnvironmentWallDAO environmentWallDAO;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private EnvironmentUserController environmentUserController; 

  @Inject
  private WallEntryReplyDAO wallEntryReplyDAO;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  @Any
  private Instance<WallEntryProvider> wallEntryProviders;

  @Inject
  private EnvironmentForumAreaDAO forumAreaDAO_TEMP;
  
  @Inject
  private ForumThreadDAO forumThreadDAO_TEMP;
  
  @Inject
  private ResourceRightsController resourceRightsController_TEMP;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  public void TEST_DATA() {
    Random R = new Random();
    
    
    List<Workspace> workspaces = workspaceController.listWorkspaces();
    
    Workspace workspace = workspaces.get(R.nextInt(workspaces.size()));
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntity(workspace);
    WorkspaceWall wall = workspaceWallDAO.findByWorkspace(workspaceEntity);
    
    List<EnvironmentUser> users = environmentUserController.listEnvironmentUsers();
    
    EnvironmentUser environmentUser = users.get(R.nextInt(users.size()));
    UserEntity userEntity = environmentUser.getUser();
    
    int r = R.nextInt(24180);
    
    switch (R.nextInt(4)) {
      case 1:
        // Guidance Request
      break;

      case 2:
        // Forum message
        ForumArea forumArea = forumAreaDAO_TEMP.findById(1l);
        if (forumArea == null) {
          ResourceRights rights = resourceRightsController_TEMP.create();
          forumArea = forumAreaDAO_TEMP.create("Foorumi.", null, false, sessionController.getLoggedUserEntity(), rights);
        }
          
        forumThreadDAO_TEMP.create(forumArea, "Foorumikirjoitus #" + r, "Testidatakirjoitus numero " + r, userEntity, false, false);
      break;
      
      case 3:
        // Assessment request
        
//        assessmentRequestController.create(workspaceEntity, userEntity, new Date(), "Arvioi mut, beibe! #" + r);
      break;

      default:
        wallEntryDAO.create(wall, "Hei mä postaan #" + r, WallEntryVisibility.PUBLIC, userEntity);
    }
  }
  
  
//  public WallEntryTextItem createWallEntryTextItem(AbstractWallEntry entry, String text, UserEntity user) {
//    return wallEntryTextItemDAO.create(entry, text, user);
//  }
//
//  public List<UserFeedItem> listUserFeedItems(UserEntity user) {
//    List<UserFeedItem> feedItems = new ArrayList<UserFeedItem>();
//    UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;
//    UserWall wall = userWallDAO.findByUser(user);
//    boolean ownsWall = loggedUser != null ? loggedUser.getId().equals(user.getId()) : false;
//    boolean hasAccess = sessionController.hasEnvironmentPermission(MuikkuPermissions.READ_ALL_WALLS);
//
//    if (ownsWall || hasAccess) {
//      /**
//       * Full access grants full listing of both the users wall and all linked walls
//       */
//      List<WallEntry> entriesByWall = wallEntryDAO.listEntriesByWall(wall);
//
//      for (WallEntry entry : entriesByWall) {
//        feedItems.add(new UserFeedWallEntryItem(entry));
//      }
//
//      List<WallSubscription> subscriptions = wallSubscriptionDAO.listByUser(user);
//      for (WallSubscription subscription : subscriptions) {
//        switch (subscription.getType()) {
//        case WALL:
//          UserWallSubscription userWallSubscription = userWallLinkDAO.findById(subscription.getId());
//
//          List<WallEntry> userWallSubEntries = wallEntryDAO.listEntriesByWall(userWallSubscription.getWall());
//          for (WallEntry entry : userWallSubEntries) {
//            feedItems.add(new UserFeedWallEntryItem(entry));
//          }
//
//          break;
//        case FORUM:
//          ForumAreaSubscription forumAreaSubscription = forumAreaSubscriptionDAO.findById(subscription.getId());
//
//          ForumArea forumArea = forumAreaSubscription.getForumArea();
//
//          List<ForumThread> forumThreads = forumThreadDAO.listByForumArea(forumArea);
//
//          for (ForumThread thread : forumThreads) {
//            List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(thread);
//            feedItems.add(new UserFeedForumThreadItem(thread, replies));
//          }
//          break;
//        }
//      }
//    } else {
//      System.out.println("No rights for feed of user x");
//    }
//    return orderUserFeed(feedItems);
//  }

  public List<WallFeedItem> listWallFeed(Wall wall) {
    if (wall == null)
      return null;

    List<WallFeedItem> entries = new ArrayList<WallFeedItem>();

    for (WallEntryProvider provider : wallEntryProviders) {
      entries.addAll(provider.listWallEntryItems(wall));
    }

    if (wall instanceof UserWall) {
      UserWall userWall = findUserWallById(wall.getId());
      UserEntity userEntity = userEntityController.findUserEntityById(userWall.getUser());

      // Friends
      
      // ...

      // Users Workspaces
      
      List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByUserEntity(userEntity);
      
      for (WorkspaceUserEntity workspaceUser : workspaceUsers) {
        WorkspaceWall workspaceWall = getWorkspaceWall(workspaceUser.getWorkspaceEntity());
        
        for (WallEntryProvider provider : wallEntryProviders) {
          entries.addAll(provider.listWallEntryItems(workspaceWall));
        }
      }
    }
    
    return orderUserFeed(entries);
  }
  
//  public List<WallEntry> listWallEntries(Wall wall) {
//    // TODO
//    if (wall == null)
//      return null;
//
//    List<WallEntry> entries = new ArrayList<WallEntry>();
//    switch (wall.getWallType()) {
//    case USER: {
//      UserWall userWall = userWallDAO.findById(wall.getId());
//
//      UserEntity wallOwner = userController.findUserEntityById(userWall.getUser());
//      UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;
//
//      boolean ownsWall = loggedUser != null ? loggedUser.getId().equals(wallOwner.getId()) : false;
//      boolean hasAccess = sessionController.hasEnvironmentPermission(MuikkuPermissions.READ_ALL_WALLS);
//
//      if (ownsWall || hasAccess) {
//        /**
//         * Full access grants full listing of both the users wall and all linked walls
//         */
//        entries.addAll(wallEntryDAO.listEntriesByWall(wall));
//      } else {
//        /**
//         * When viewing other peoples walls, you only see public or owned entries
//         */
//
//        entries.addAll(wallEntryDAO.listPublicOrOwnedEntriesByWall(wall, loggedUser));
//      }
//    }
//      break;
//
//    case WORKSPACE:
//      WorkspaceWall courseWall = courseWallDAO.findById(wall.getId());
//
//      WorkspaceEntity course = workspaceController.findWorkspaceEntityById(courseWall.getWorkspace());
//
//      if (sessionController.hasCoursePermission(MuikkuPermissions.WALL_READALLCOURSEMESSAGES, course)) {
//        entries.addAll(wallEntryDAO.listEntriesByWall(courseWall));
//      } else {
//        entries.addAll(wallEntryDAO.listPublicOrOwnedEntriesByWall(courseWall, sessionController.getUser()));
//      }
//      break;
//
//    case ENVIRONMENT:
//      // TODO: oikeudet?
//      entries.addAll(wallEntryDAO.listEntriesByWall(wall));
//      break;
//    }

//    return orderWallEntries(entries);
//  }

//  public List<WallEntryItem> listWallEntryItems(AbstractWallEntry wallEntry) {
//    // TODO: oikeudet
//    return abstractWallEntryItemDAO.listByWallEntry(wallEntry);
//  }

  public List<WallEntryReply> listWallEntryComments(WallEntry wallEntry) {
    return wallEntryCommentDAO.listByWallEntry(wallEntry);
  }

  public boolean canPostEntry(Wall wall) {
    if (wall instanceof EnvironmentWall) {
      return sessionController.hasEnvironmentPermission(WallPermissions.WALL_WRITEENVIRONMENTWALL);
    }

    if (wall instanceof WorkspaceWall) {
      WorkspaceWall courseWall = (WorkspaceWall) wall;

      return sessionController.hasCoursePermission(WallPermissions.WALL_WRITECOURSEWALL, 
          workspaceController.findWorkspaceEntityById(courseWall.getWorkspace()));
    }

    if (wall instanceof UserWall) {
      return true;
    }

    return false;
  }

  public EnvironmentWall getEnvironmentWall() {
    EnvironmentWall environmentWall = environmentWallDAO.find();
    
    if (environmentWall == null)
      environmentWall = environmentWallDAO.create();
    
    return environmentWall;
  }

  public UserWall getUserWall(UserEntity user) {
    UserWall userWall = userWallDAO.findByUser(user);
    
//    // TODO 
//    if (userWall == null)
//      userWall = userWallDAO.create(user);
    
    return userWall;
  }

  public WorkspaceWall getWorkspaceWall(WorkspaceEntity workspace) {
    WorkspaceWall workspaceWall = workspaceWallDAO.findByWorkspace(workspace);
    return workspaceWall;
  }

  public String getWallType(Wall wall) {
    return wall.getClass().getSimpleName();
  }

  public boolean showContext(Wall wall, WallEntry wallEntry) {
    // Don't show context for entries on the wall we're currently viewing
    return !wallEntry.getWall().getId().equals(wall.getId());
  }

  private List<WallFeedItem> orderUserFeed(List<WallFeedItem> entries) {
    Collections.sort(entries, new Comparator<WallFeedItem>() {

      @Override
      public int compare(WallFeedItem o1, WallFeedItem o2) {
        Date d1 = o1.getDate();
        Date d2 = o2.getDate();

        return d2.compareTo(d1);
      }
    });

    return entries;
  }

//  private List<WallEntry> orderWallEntries(List<WallEntry> entries) {
//    Collections.sort(entries, new Comparator<WallEntry>() {
//
//      @Override
//      public int compare(WallEntry o1, WallEntry o2) {
//        Date d1 = wallEntryCommentDAO.findMaxDateByWallEntry(o1);
//        Date d2 = wallEntryCommentDAO.findMaxDateByWallEntry(o2);
//
//        d1 = d1 != null ? d1 : o1.getCreated();
//        d2 = d2 != null ? d2 : o2.getCreated();
//
//        return d2.compareTo(d1);
//      }
//    });
//
//    return entries;
//  }

  public WallEntry createWallEntry(Wall wall, String text, WallEntryVisibility visibility, UserEntity user) {
    return wallEntryDAO.create(wall, text, visibility, user);
  }

  public WallEntryReply createWallEntryReply(Wall wall, WallEntry wallEntry, String text, UserEntity user) {
    return wallEntryReplyDAO.create(wall, wallEntry, text, user);
  }

  public WorkspaceWall createWorkspaceWall(WorkspaceEntity workspaceEntity) {
    return workspaceWallDAO.create(workspaceEntity);
  }
  
  public UserWall createUserWall(UserEntity userEntity) {
    return userWallDAO.create(userEntity);
  }
  
  public WallEntry findWallEntryById(Long wallEntryId) {
    return wallEntryDAO.findById(wallEntryId);
  }

  public Wall findWallById(Long wallId) {
    return wallDAO.findById(wallId);
  }

  public UserWall findUserWallById(Long wallId) {
    return userWallDAO.findById(wallId);
  }

  public UserWall findUserWall(UserEntity userEntity) {
    return userWallDAO.findByUser(userEntity);
  }
  
  public List<String> listRequiredJSFiles() {
    List<String> result = new ArrayList<String>();
    
    for (WallEntryProvider wallEntryProvider : wallEntryProviders) {
      List<String> v = wallEntryProvider.listRequiredJavaScripts();
      if (v != null)
        result.addAll(v);
    }
    return result;
  }
  
  public void onCourseCreateEvent(@Observes @Created CourseEntityEvent event) {
    WorkspaceEntity courseEntity = workspaceController.findWorkspaceEntityById(event.getCourseEntityId());
    workspaceWallDAO.create(courseEntity);
  }
  
  public void onCourseUserCreateEvent(@Observes @Created CourseUserEvent event) {
    throw new RuntimeException("TODO: Implement");
    
//    CourseUser courseUser = workspaceController.findCourseUserById(event.getCourseUserId());
//    WorkspaceWall courseWall = courseWallDAO.findByCourse(courseUser.getCourse());
//
//    userWallLinkDAO.create(courseUser.getUser(), courseWall);
  }
  
  public void onUserCreatedEvent(@Observes @Created UserEntityEvent event) {
    /**
     * Create User Wall
     */
    UserEntity userEntity = userEntityController.findUserEntityById(event.getUserEntityId());
    
    UserWall userWall = userWallDAO.create(userEntity);

//    WallEntry wallEntry = 
    wallEntryDAO.create(userWall, "Joined Muikku", WallEntryVisibility.PRIVATE, userEntity);

    /**
     * Link Environment wall
     */
    EnvironmentWall environmentWall = environmentWallDAO.find();
    userWallLinkDAO.create(userEntity, environmentWall);
  }


  public WorkspaceWall findWorkspaceWall(WorkspaceEntity workspaceEntity) {
    return workspaceWallDAO.findByWorkspace(workspaceEntity);
  }

  public WorkspaceWall findWorkspaceWallById(Long id) {
    return workspaceWallDAO.findById(id);
  }
  
}

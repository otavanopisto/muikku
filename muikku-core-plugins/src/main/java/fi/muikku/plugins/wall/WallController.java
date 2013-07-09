package fi.muikku.plugins.wall;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.CourseController;
import fi.muikku.controller.UserController;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.events.Created;
import fi.muikku.events.UserEntityEvent;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.wall.dao.CourseWallDAO;
import fi.muikku.plugins.wall.dao.EnvironmentWallDAO;
import fi.muikku.plugins.wall.dao.ForumAreaSubscriptionDAO;
import fi.muikku.plugins.wall.dao.UserWallDAO;
import fi.muikku.plugins.wall.dao.UserWallSubscriptionDAO;
import fi.muikku.plugins.wall.dao.WallDAO;
import fi.muikku.plugins.wall.dao.WallEntryDAO;
import fi.muikku.plugins.wall.dao.WallEntryGuidanceRequestItemDAO;
import fi.muikku.plugins.wall.dao.WallEntryItemDAO;
import fi.muikku.plugins.wall.dao.WallEntryReplyDAO;
import fi.muikku.plugins.wall.dao.WallEntryTextItemDAO;
import fi.muikku.plugins.wall.dao.WallSubscriptionDAO;
import fi.muikku.plugins.wall.model.AbstractWallEntry;
import fi.muikku.plugins.wall.model.CourseWall;
import fi.muikku.plugins.wall.model.EnvironmentWall;
import fi.muikku.plugins.wall.model.ForumAreaSubscription;
import fi.muikku.plugins.wall.model.UserWall;
import fi.muikku.plugins.wall.model.UserWallSubscription;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallEntry;
import fi.muikku.plugins.wall.model.WallEntryGuidanceRequestItem;
import fi.muikku.plugins.wall.model.WallEntryItem;
import fi.muikku.plugins.wall.model.WallEntryReply;
import fi.muikku.plugins.wall.model.WallEntryTextItem;
import fi.muikku.plugins.wall.model.WallEntryVisibility;
import fi.muikku.plugins.wall.model.WallSubscription;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;

@RequestScoped
@Named("Wall")
public class WallController {
  @Inject
  private UserEntityDAO userDAO;

  @Inject
  private WallDAO wallDAO;

  @Inject
  private WallEntryDAO wallEntryDAO;

  @Inject
  private UserWallDAO userWallDAO;

  @Inject
  private UserWallSubscriptionDAO userWallLinkDAO;

  @Inject
  private ForumAreaSubscriptionDAO forumAreaSubscriptionDAO;

  @Inject
  private WallSubscriptionDAO wallSubscriptionDAO;

  @Inject
  private SessionController sessionController;

//  @Inject
//  private CourseEntityDAO courseDAO;

  @Inject
  private CourseWallDAO courseWallDAO;

  @Inject
  private WallEntryReplyDAO wallEntryCommentDAO;

  @Inject
  private WallEntryItemDAO abstractWallEntryItemDAO;

  @Inject
  private EnvironmentWallDAO environmentWallDAO;

  @Inject
  private UserSchoolDataController schoolUserController;

//  @Inject
//  private CourseSchoolDataController courseSchoolDataController;

  @Inject
  private ForumThreadDAO forumThreadDAO;

  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;

  @Inject
  private WallEntryTextItemDAO wallEntryTextItemDAO;

  @Inject
  private WallEntryGuidanceRequestItemDAO wallEntryGuidanceRequestItemDAO;

  @Inject
  private WallEntryReplyDAO wallEntryReplyDAO;
  
  @Inject
  private UserController userController;
  
  @Inject
  private CourseController courseController;
  
  public WallEntryTextItem createWallEntryTextItem(AbstractWallEntry entry, String text, UserEntity user) {
    return wallEntryTextItemDAO.create(entry, text, user);
  }

  public List<UserFeedItem> listUserFeedItems(UserEntity user) {
    List<UserFeedItem> feedItems = new ArrayList<UserFeedItem>();

    UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;
    UserWall wall = userWallDAO.findByUser(user);
    boolean ownsWall = loggedUser != null ? loggedUser.getId().equals(user.getId()) : false;
    boolean hasAccess = sessionController.hasEnvironmentPermission(MuikkuPermissions.READ_ALL_WALLS);

    if (ownsWall || hasAccess) {
      /**
       * Full access grants full listing of both the users wall and all linked walls
       */
      List<WallEntry> entriesByWall = wallEntryDAO.listEntriesByWall(wall);

      for (WallEntry entry : entriesByWall) {
        feedItems.add(new UserFeedWallEntryItem(entry));
      }

      List<WallSubscription> subscriptions = wallSubscriptionDAO.listByUser(user);
      for (WallSubscription subscription : subscriptions) {
        switch (subscription.getType()) {
        case WALL:
          UserWallSubscription userWallSubscription = userWallLinkDAO.findById(subscription.getId());

          List<WallEntry> userWallSubEntries = wallEntryDAO.listEntriesByWall(userWallSubscription.getWall());
          for (WallEntry entry : userWallSubEntries) {
            feedItems.add(new UserFeedWallEntryItem(entry));
          }

          break;
        case FORUM:
          ForumAreaSubscription forumAreaSubscription = forumAreaSubscriptionDAO.findById(subscription.getId());

          ForumArea forumArea = forumAreaSubscription.getForumArea();

          List<ForumThread> forumThreads = forumThreadDAO.listByForumArea(forumArea);

          for (ForumThread thread : forumThreads) {
            List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(thread);
            feedItems.add(new UserFeedForumThreadItem(thread, replies));
          }
          break;
        }
      }
    } else {
      System.out.println("No rights for feed of user x");
    }

    return orderUserFeed(feedItems);
  }

//  public List<WallEntry> listWallEntries(Wall wall) {
//    // TODO
//    if (wall == null)
//      return null;
//
//    List<WallEntry> entries = new ArrayList<WallEntry>();
//
//    switch (wall.getWallType()) {
//    case USER: {
//      UserWall userWall = userWallDAO.findById(wall.getId());
//
//      UserEntity wallOwner = userController.findUserEntity(userWall.getUser());
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
//    case COURSE:
//      CourseWall courseWall = courseWallDAO.findById(wall.getId());
//
//      WorkspaceEntity course = courseController.findCourseEntityById(courseWall.getCourse());
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
//
//    return orderWallEntries(entries);
//  }

  public List<WallEntryItem> listWallEntryItems(AbstractWallEntry wallEntry) {
    // TODO: oikeudet
    return abstractWallEntryItemDAO.listByWallEntry(wallEntry);
  }

  public List<WallEntryReply> listWallEntryComments(WallEntry wallEntry) {
    return wallEntryCommentDAO.listByWallEntry(wallEntry);
  }

//  public boolean canPostEntry(Wall wall) {
//    if (wall instanceof EnvironmentWall) {
//      return sessionController.hasEnvironmentPermission(MuikkuPermissions.WALL_WRITEENVIRONMENTWALL);
//    }
//
//    if (wall instanceof CourseWall) {
//      CourseWall courseWall = (CourseWall) wall;
//
//      return sessionController.hasCoursePermission(MuikkuPermissions.WALL_WRITECOURSEWALL, 
//          courseController.findCourseEntityById(courseWall.getCourse()));
//    }
//
//    if (wall instanceof UserWall) {
//      return true;
//    }
//
//    return false;
//  }

  public EnvironmentWall getEnvironmentWall() {
    return environmentWallDAO.find();
  }

  public UserWall getUserWall(UserEntity user) {
    return userWallDAO.findByUser(user);
  }

  public CourseWall getCourseWall(WorkspaceEntity course) {
    return courseWallDAO.findByCourse(course);
  }

  public String getWallType(Wall wall) {
    return wall.getClass().getSimpleName();
  }

  @Deprecated
  public String getWallName(Wall wall) {
    switch (wall.getWallType()) {
    case COURSE:
//      CourseWall courseWall = courseWallDAO.findById(wall.getId());
//
//      Course course = courseSchoolDataController.findCourse(courseController.findCourseEntityById(courseWall.getCourse()));
//
//      return course.getName();
      return null;
    case ENVIRONMENT:
      return "the Muikerosuikero";

    case USER:
      UserWall userWall = userWallDAO.findById(wall.getId());

      User user = schoolUserController.findUser(userController.findUserEntity(userWall.getUser()));

      return user.getFirstName() + " " + user.getLastName();
    }

    throw new RuntimeException("getWallName - undefined wall type");
  }

  public boolean showContext(Wall wall, WallEntry wallEntry) {
    // Don't show context for entries on the wall we're currently viewing
    return !wallEntry.getWall().getId().equals(wall.getId());
  }

  private List<UserFeedItem> orderUserFeed(List<UserFeedItem> entries) {
    Collections.sort(entries, new Comparator<UserFeedItem>() {

      @Override
      public int compare(UserFeedItem o1, UserFeedItem o2) {
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

  public WallEntryGuidanceRequestItem createWallEntryGuidanceRequestItem(WallEntry entry, String text, UserEntity user) {
    return wallEntryGuidanceRequestItemDAO.create(entry, text, user);
  }

  public WallEntry createWallEntry(Wall wall, WallEntryVisibility visibility, UserEntity user) {
    return wallEntryDAO.create(wall, visibility, user);
  }

  public WallEntryReply createWallEntryReply(Wall wall, WallEntry wallEntry, UserEntity user) {
    return wallEntryReplyDAO.create(wall, wallEntry, user);
  }

  public WallEntry findWallEntryById(Long wallEntryId) {
    return wallEntryDAO.findById(wallEntryId);
  }

  public Wall findWallById(Long wallId) {
    return wallDAO.findById(wallId);
  }

  
//  public void onCourseCreateEvent(@Observes @Created CourseEntityEvent event) {
//    WorkspaceEntity courseEntity = courseController.findCourseEntityById(event.getCourseEntityId());
//    courseWallDAO.create(courseEntity);
//  }
//  
//  public void onCourseUserCreateEvent(@Observes @Created CourseUserEvent event) {
//    CourseUser courseUser = courseController.findCourseUserById(event.getCourseUserId());
//    CourseWall courseWall = courseWallDAO.findByCourse(courseUser.getCourse());
//
//    userWallLinkDAO.create(courseUser.getUser(), courseWall);
//  }
  
  public void onUserCreatedEvent(@Observes @Created UserEntityEvent event) {
    /**
     * Create User Wall
     */
    UserEntity userEntity = userController.findUserEntity(event.getUserEntityId());
    
    UserWall userWall = userWallDAO.create(userEntity);

    WallEntry wallEntry = wallEntryDAO.create(userWall, WallEntryVisibility.PRIVATE, userEntity);
    wallEntryTextItemDAO.create(wallEntry, "Joined Muikku", userEntity);

    /**
     * Link Environment wall
     */
    EnvironmentWall environmentWall = environmentWallDAO.find();
    userWallLinkDAO.create(userEntity, environmentWall);
  }
  
}

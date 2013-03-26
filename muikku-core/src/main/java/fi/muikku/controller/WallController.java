package fi.muikku.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.dao.forum.ForumThreadDAO;
import fi.muikku.dao.forum.ForumThreadReplyDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.wall.CourseWallDAO;
import fi.muikku.dao.wall.EnvironmentWallDAO;
import fi.muikku.dao.wall.UserWallDAO;
import fi.muikku.dao.wall.WallDAO;
import fi.muikku.dao.wall.WallEntryDAO;
import fi.muikku.dao.wall.WallEntryGuidanceRequestItemDAO;
import fi.muikku.dao.wall.WallEntryItemDAO;
import fi.muikku.dao.wall.WallEntryReplyDAO;
import fi.muikku.dao.wall.WallEntryTextItemDAO;
import fi.muikku.dao.wall.subscription.ForumAreaSubscriptionDAO;
import fi.muikku.dao.wall.subscription.UserWallSubscriptionDAO;
import fi.muikku.dao.wall.subscription.WallSubscriptionDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.forum.ForumArea;
import fi.muikku.model.forum.ForumThread;
import fi.muikku.model.forum.ForumThreadReply;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.AbstractWallEntry;
import fi.muikku.model.wall.CourseWall;
import fi.muikku.model.wall.EnvironmentWall;
import fi.muikku.model.wall.UserWall;
import fi.muikku.model.wall.Wall;
import fi.muikku.model.wall.WallEntry;
import fi.muikku.model.wall.WallEntryGuidanceRequestItem;
import fi.muikku.model.wall.WallEntryItem;
import fi.muikku.model.wall.WallEntryReply;
import fi.muikku.model.wall.WallEntryTextItem;
import fi.muikku.model.wall.WallEntryVisibility;
import fi.muikku.model.wall.subscription.ForumAreaSubscription;
import fi.muikku.model.wall.subscription.UserWallSubscription;
import fi.muikku.model.wall.subscription.WallSubscription;
import fi.muikku.schooldata.CourseSchoolDataController;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.Course;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.local.wall.UserFeedForumThreadItem;
import fi.muikku.schooldata.local.wall.UserFeedItem;
import fi.muikku.schooldata.local.wall.UserFeedWallEntryItem;
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

  @Inject
  private CourseEntityDAO courseDAO;

  @Inject
  private CourseWallDAO courseWallDAO;

  @Inject
  private WallEntryReplyDAO wallEntryCommentDAO;

  @Inject
  private WallEntryItemDAO abstractWallEntryItemDAO;

  @Inject
  private EnvironmentWallDAO environmentWallDAO;

  @Inject
  private UserSchoolDataController userController;

  @Inject
  private CourseSchoolDataController courseSchoolDataController;

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

  public WallEntryTextItem createWallEntryTextItem(AbstractWallEntry entry, String text, UserEntity user) {
    return wallEntryTextItemDAO.create(entry, text, user);
  }

  public List<UserFeedItem> listUserFeedItems(UserEntity user) {
    List<UserFeedItem> feedItems = new ArrayList<UserFeedItem>();

    UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;

    Environment environment = sessionController.getEnvironment();

    UserWall wall = userWallDAO.findByUser(user);
    boolean ownsWall = loggedUser != null ? loggedUser.getId().equals(user.getId()) : false;
    boolean hasAccess = sessionController.hasPermission(MuikkuPermissions.READ_ALL_WALLS, environment);

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

  public List<WallEntry> listWallEntries(Wall wall) {
    // TODO
    if (wall == null)
      return null;

    List<WallEntry> entries = new ArrayList<WallEntry>();

    switch (wall.getWallType()) {
    case USER: {
      UserWall userWall = userWallDAO.findById(wall.getId());

      UserEntity wallOwner = userWall.getUser();
      UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;
      Environment environment = sessionController.getEnvironment();

      boolean ownsWall = loggedUser != null ? loggedUser.getId().equals(wallOwner.getId()) : false;
      boolean hasAccess = sessionController.hasPermission(MuikkuPermissions.READ_ALL_WALLS, environment);

      if (ownsWall || hasAccess) {
        /**
         * Full access grants full listing of both the users wall and all linked walls
         */
        entries.addAll(wallEntryDAO.listEntriesByWall(wall));
      } else {
        /**
         * When viewing other peoples walls, you only see public or owned entries
         */

        entries.addAll(wallEntryDAO.listPublicOrOwnedEntriesByWall(wall, loggedUser));
      }
    }
      break;

    case COURSE:
      CourseWall courseWall = courseWallDAO.findById(wall.getId());

      CourseEntity course = courseWall.getCourse();

      if (sessionController.hasCoursePermission(MuikkuPermissions.WALL_READALLCOURSEMESSAGES, course)) {
        entries.addAll(wallEntryDAO.listEntriesByWall(courseWall));
      } else {
        entries.addAll(wallEntryDAO.listPublicOrOwnedEntriesByWall(courseWall, sessionController.getUser()));
      }
      break;

    case ENVIRONMENT:
      // TODO: oikeudet?
      entries.addAll(wallEntryDAO.listEntriesByWall(wall));
      break;
    }

    return orderWallEntries(entries);
  }

  public List<WallEntryItem> listWallEntryItems(AbstractWallEntry wallEntry) {
    // TODO: oikeudet
    return abstractWallEntryItemDAO.listByWallEntry(wallEntry);
  }

  public List<WallEntryReply> listWallEntryComments(WallEntry wallEntry) {
    return wallEntryCommentDAO.listByWallEntry(wallEntry);
  }

  public boolean canPostEntry(Wall wall) {
    if (wall instanceof EnvironmentWall) {
      EnvironmentWall envWall = (EnvironmentWall) wall;

      return sessionController.hasEnvironmentPermission(MuikkuPermissions.WALL_WRITEENVIRONMENTWALL, envWall.getEnvironment());
    }

    if (wall instanceof CourseWall) {
      CourseWall courseWall = (CourseWall) wall;

      return sessionController.hasCoursePermission(MuikkuPermissions.WALL_WRITECOURSEWALL, courseWall.getCourse());
    }

    if (wall instanceof UserWall) {
      return true;
    }

    return false;
  }

  public EnvironmentWall getEnvironmentWall(Environment environment) {
    return environmentWallDAO.findByEnvironment(environment);
  }

  public UserWall getUserWall(UserEntity user) {
    return userWallDAO.findByUser(user);
  }

  public CourseWall getCourseWall(CourseEntity course) {
    return courseWallDAO.findByCourse(course);
  }

  public String getWallType(Wall wall) {
    return wall.getClass().getSimpleName();
  }

  @Deprecated
  public String getWallName(Wall wall) {
    switch (wall.getWallType()) {
    case COURSE:
      CourseWall courseWall = courseWallDAO.findById(wall.getId());

      Course course = courseSchoolDataController.findCourse(courseWall.getCourse());

      return course.getName();

    case ENVIRONMENT:
      return "the Muikerosuikero";

    case USER:
      UserWall userWall = userWallDAO.findById(wall.getId());

      User user = userController.findUser(userWall.getUser());

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

  private List<WallEntry> orderWallEntries(List<WallEntry> entries) {
    Collections.sort(entries, new Comparator<WallEntry>() {

      @Override
      public int compare(WallEntry o1, WallEntry o2) {
        Date d1 = wallEntryCommentDAO.findMaxDateByWallEntry(o1);
        Date d2 = wallEntryCommentDAO.findMaxDateByWallEntry(o2);

        d1 = d1 != null ? d1 : o1.getCreated();
        d2 = d2 != null ? d2 : o2.getCreated();

        return d2.compareTo(d1);
      }
    });

    return entries;
  }

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

}

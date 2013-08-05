package fi.muikku.data;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.UserTransaction;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.model.base.Environment;
import fi.muikku.model.base.EnvironmentDefaults;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.courses.CourseSettingsTemplate;
import fi.muikku.model.courses.CourseUserRole;
import fi.muikku.model.oauth.Consumer;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.SuperUser;
import fi.muikku.model.security.UserPassword;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.EnvironmentUserRole;
import fi.muikku.model.users.SystemUserRole;
import fi.muikku.model.users.SystemUserRoleType;
import fi.muikku.model.users.UserContact;
import fi.muikku.model.users.UserContactType;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.model.users.UserImpl;
import fi.muikku.security.PermissionCollection;
import fi.muikku.security.PermissionScope;

/**
 * Import seed data into the database on application startup.
 * 
 * <p>
 * Observes the context initialized event and loads seed data into the database using JPA.
 * </p>
 * 
 * <p>
 * As an alternative, you can perform the data loading by observing the context initialized event of a ServletContextListener
 * </p>
 * 
 * @author Dan Allen
 */
@Startup
@Singleton
public class SeedDataImporter {
   
  @PersistenceContext
  private EntityManager em;

  @Inject
  private UserTransaction tx;

  @Inject
  @Any
  private Instance<PermissionCollection> permissionCollections;
  
  @PostConstruct
  public void importData() {
    if (findById(SchoolDataSource.class, 1l) == null) {
      // Local
      
      SchoolDataSource dataSource = new SchoolDataSource();
      dataSource.setIdentifier("LOCAL");
      em.persist(dataSource);
    }
    
    if (findById(SchoolDataSource.class, 2l) == null) {
      // Pyramus source
      SchoolDataSource dataSource = new SchoolDataSource();
      dataSource.setIdentifier("PYRAMUS");
      em.persist(dataSource);
    }
    
    Environment env = findById(Environment.class, 1l);
    if (env == null) {
      env = new Environment();
      em.persist(env);
    }

    if (findById(UserGroup.class, 1l) == null) {
      // Students
      
      UserGroup group = new UserGroup();
      group.setName("Opiskelijat");
      em.persist(group);
    }
    
    if (findById(UserGroup.class, 2l) == null) {
      // Teachers
      
      UserGroup group = new UserGroup();
      group.setName("Opettajat");
      em.persist(group);
    }
    
//    if (em.createQuery("from EnvironmentWall where environment.id = " + env.getId().toString()).getResultList().size() == 0) {
//      EnvironmentWall environmentWall = new EnvironmentWall();
//      environmentWall.setEnvironment(env);
//      em.persist(environmentWall);
//    }
//    
//    
    EnvironmentDefaults envdef = findById(EnvironmentDefaults.class, 1l);
    if (envdef == null)
      envdef = new EnvironmentDefaults();
    envdef.setEnvironment(env);
    
    // UserRoles
    long userRoleId = 0;
    
    for (SystemUserRoleType type : SystemUserRoleType.values()) {
      userRoleId++;
      
      if (em.createQuery("from SystemUserRole where name = '" + type.name() + "'").getResultList().size() == 0) {
        SystemUserRole sur = new SystemUserRole();
        sur.setName(type.name());
        sur.setSystemUserRoleType(type);
        em.persist(sur);
      }
    }
    
    EnvironmentUserRole eur = findById(EnvironmentUserRole.class, ++userRoleId);
    if (eur == null) {
      eur = new EnvironmentUserRole();
      eur.setName("Manageri");
      em.persist(eur);
    }
    EnvironmentUserRole envManager = eur;

    eur = findById(EnvironmentUserRole.class, ++userRoleId);
    if (eur == null) {
      eur = new EnvironmentUserRole();
      eur.setName("Opettaja");
      em.persist(eur);
    }

    eur = findById(EnvironmentUserRole.class, ++userRoleId);
    if (eur == null) {
      eur = new EnvironmentUserRole();
      eur.setName("Opiskelija");
      em.persist(eur);
      envdef.setDefaultUserRole(eur);
    }
    
    CourseUserRole cur = findById(CourseUserRole.class, ++userRoleId);
    if (cur == null) {
      cur = new CourseUserRole();
      cur.setName("Kurssin opettaja");
      em.persist(cur);
      envdef.setDefaultCourseCreatorRole(cur);
    }
    
    cur = findById(CourseUserRole.class, ++userRoleId);
    if (cur == null) {
      cur = new CourseUserRole();
      cur.setName("Kurssin opiskelija");
      em.persist(cur);
    }

    // Tallennellaan defaultsit
    em.persist(envdef);
    
    CourseSettingsTemplate courDef = findById(CourseSettingsTemplate.class, 1l);
    if (courDef == null) {
      courDef = new CourseSettingsTemplate();
      courDef.setDefaultCourseUserRole(findById(CourseUserRole.class, 6l));
      em.persist(courDef);
    }
    
    UserEntity userEntity = findById(UserEntity.class, 1l);
    if (userEntity == null) {
      userEntity = new SuperUser();
      userEntity.setDataSource(findById(SchoolDataSource.class, 1l));
      userEntity.setArchived(false);
      em.persist(userEntity);
      
      UserImpl user = new UserImpl();
      user.setFirstName("Andreas");
      user.setLastName("Fuccibani");
      user.setEmail("andreas.fuccibani@superdupermangobanana.fi");
      user.setUserEntity(userEntity);
      em.persist(user);
      
      UserPassword pass = new UserPassword();
      pass.setUser(userEntity);
      pass.setPasswordHash(DigestUtils.md5Hex((DigestUtils.md5Hex("qwe"))));
      em.persist(pass);
      
      UserContact userContact = new UserContact();
      userContact.setUser(userEntity);
      userContact.setType(UserContactType.PHONE);
      userContact.setValue("1-555-CALLME-FUCCIBANI");
      userContact.setHidden(false);
      em.persist(userContact);

      userContact = new UserContact();
      userContact.setUser(userEntity);
      userContact.setType(UserContactType.SKYPE);
      userContact.setValue("fuccibani");
      userContact.setHidden(false);
      em.persist(userContact);

      userContact = new UserContact();
      userContact.setUser(userEntity);
      userContact.setType(UserContactType.MSN);
      userContact.setValue("fuccibani@fuzzybunnies.org");
      userContact.setHidden(true);
      em.persist(userContact);
      
      EnvironmentUser envUser = new EnvironmentUser();
      envUser.setEnvironment(env);
      envUser.setRole(envManager);
      envUser.setUser(userEntity);
      em.persist(envUser);
      
      /**
      UserWidget userWidget = new UserWidget();
      userWidget.setUser(userEntity);
      userWidget.setWidget(findFirst(Widget.class, "from Widget where name = 'feed'"));
      userWidget.setLocation(findFirst(WidgetLocation.class, "from WidgetLocation where name = 'environment.sidebar.left'"));
      em.persist(userWidget);
      
      LocatedWidgetSetting userWidgetSetting = new LocatedWidgetSetting();
      userWidgetSetting.setLocatedWidget(userWidget);
      userWidgetSetting.setValue("http://syndication.thedailywtf.com/TheDailyWtf");
      userWidgetSetting.setWidgetSetting(feedUrlSetting);
      em.persist(userWidgetSetting);
      
      userWidget = new UserWidget();
      userWidget.setUser(userEntity);
      userWidget.setWidget(findFirst(Widget.class, "from Widget where name = 'feed'"));
      userWidget.setLocation(findFirst(WidgetLocation.class, "from WidgetLocation where name = 'environment.sidebar.left'"));
      em.persist(userWidget);
      
      userWidgetSetting = new LocatedWidgetSetting();
      userWidgetSetting.setLocatedWidget(userWidget);
      userWidgetSetting.setValue("http://www.otavanopisto.fi/feeds/shouts");
      userWidgetSetting.setWidgetSetting(feedUrlSetting);
      em.persist(userWidgetSetting);

      userWidget = new UserWidget();
      userWidget.setUser(userEntity);
      userWidget.setWidget(findFirst(Widget.class, "from Widget where name = 'fish'"));
      userWidget.setLocation(findFirst(WidgetLocation.class, "from WidgetLocation where name = 'environment.sidebar.right'"));
      em.persist(userWidget);;
      **/
//      UserWall userWall = new UserWall();
//      userWall.setUser(userEntity);
//      em.persist(userWall);
//      
//      UserWallSubscription envWallLink = new UserWallSubscription();
//      envWallLink.setUser(userEntity);
//      envWallLink.setWall(findFirst(EnvironmentWall.class, "from EnvironmentWall where environment.id = " + env.getId().toString()));
//      em.persist(envWallLink);
    }

    UserGroupUser uguchaga = new UserGroupUser();
    uguchaga.setUser(userEntity);
    uguchaga.setUserGroup(findById(UserGroup.class, 2l));
    em.persist(uguchaga);
    
//    EnvironmentWall sysWall = findById(EnvironmentWall.class, 1l);
//    if (sysWall == null) {
//      sysWall = new EnvironmentWall();
//      em.persist(sysWall);
//    }

    for (PermissionCollection collection : permissionCollections) {
      List<String> permissions = collection.listPermissions();
      
      for (String permission : permissions) {
        if (em.createQuery("from Permission where name = '" + permission + "'").getResultList().size() == 0) {
          try {
            String permissionScope = collection.getPermissionScope(permission);

            if (!PermissionScope.PERSONAL.equals(permissionScope)) {
              Permission per = new Permission();
              per.setName(permission);
              per.setScope(permissionScope);
              em.persist(per);
            }
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      }
    }
    
//    for (Permissions p : Permissions.values()) {
//      if (em.createQuery("from Permission where name = '" + p.name() + "'").getResultList().size() == 0) {
//        try {
//          Scope scopeAnnotation = Permissions.class.getField(p.name()).getAnnotation(Scope.class);
//
//          if (scopeAnnotation != null) {
//            PermissionScope permissionScope = scopeAnnotation.value();
//            
//            Permission per = new Permission();
//            per.setName(p.name());
//            per.setScope(permissionScope);
//            em.persist(per);
//          }
//        } catch (Exception e) {
//          e.printStackTrace();
//        }
//      }
//    }
    
    Consumer consumer = findFirst(Consumer.class, "from Consumer where consumerKey = '1234'");
    if (consumer == null) {
      consumer = new Consumer();
      consumer.setConnectURI("http://localhost:8080/muikku-rest-client/oauth?a=cb");
      consumer.setConsumerKey("1234");
      consumer.setConsumerSecret("5678");
      consumer.setDisplayName("Test Client");
      em.persist(consumer);
    }
  }

  private <T> T findById(Class<T> clazz, Long id) {
    return em.find(clazz, id);
  }

  private <T> T findFirst(Class<T> clazz, String jpql) {
    @SuppressWarnings("unchecked")
    List<T> resultList = em.createQuery(jpql).getResultList();
    if (resultList.size() > 0)
      return resultList.get(0);
      
    return null;
  }
}

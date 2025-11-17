package fi.otavanopisto.muikku.plugins.announcer.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncementController;
import fi.otavanopisto.muikku.plugins.announcer.AnnouncerPermissions;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementEnvironmentRestriction;
import fi.otavanopisto.muikku.plugins.announcer.dao.AnnouncementTimeFrame;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementAttachment;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementCategory;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementRecipient;
import fi.otavanopisto.muikku.plugins.announcer.model.AnnouncementUserGroup;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceBasicInfo;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRESTModelController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Path("/announcer")
@Produces("application/json")
public class AnnouncerRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 1L;

  @Inject
  private Logger logger;

  @Inject
  private AnnouncementController announcementController;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceRESTModelController workspaceRESTModelController;
  
  private Date currentDate() {
    Calendar cal = Calendar.getInstance();
    cal.setTime(new Date());
    cal.set(Calendar.HOUR_OF_DAY, 0);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);
    return cal.getTime();
  }
  
  @POST
  @Path("/announcements")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createAnnouncement(AnnouncementRESTModel restModel) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    List<Long> workspaceEntityIds = restModel.getWorkspaceEntityIds();
    if (workspaceEntityIds == null) {
      workspaceEntityIds = Collections.emptyList();
    }
    
    List<Long> userGroupEntityIds = restModel.getUserGroupEntityIds();
    if (userGroupEntityIds == null) {
      userGroupEntityIds = Collections.emptyList();
    }
    
    if (workspaceEntityIds.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.CREATE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create environment announcements").build();
    }

    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.CREATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create workspace announcement").build();
      }
    }
    
    // Categories
    List<AnnouncementCategory> categories = new ArrayList<AnnouncementCategory>();
    
    if (CollectionUtils.isNotEmpty(restModel.getCategories())) {
      for (AnnouncementCategoryRESTModel categoryRest : restModel.getCategories()) {
        AnnouncementCategory category = announcementController.findAnnouncementCategoryById(categoryRest.getId());
        
        if (category != null) {
          categories.add(category);
        }
      }
    }
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity organizationEntity = userSchoolDataIdentifier.getOrganization();
    
    boolean pinned = false;
    
    if (sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      pinned = restModel.isPinned();
    }
    
    Announcement announcement = announcementController.createAnnouncement(
        userEntity,
        organizationEntity,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible(),
        categories,
        pinned);
    
    for (Long userGroupEntityId : userGroupEntityIds) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);

      if (userGroupEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid userGroupEntityId").build();
      }

      announcementController.addAnnouncementTargetGroup(announcement, userGroupEntity);
    }

    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      announcementController.addAnnouncementWorkspace(announcement, workspaceEntity);
    }
    
    List<AnnouncementUserGroup> announcementUserGroups = announcementController.listAnnouncementUserGroups(announcement);
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspaces(announcement);
    
    
    // Mark the announcement as read directly on behalf of the creator
    announcementController.createAnnouncementRecipient(announcement, sessionController.getLoggedUserEntity().getId(), new Date(), false);
    
    return Response
        .ok(createRESTModel(announcement, announcementUserGroups, announcementWorkspaces, false))
        .build();
  }

  @PUT
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateAnnouncement(@PathParam("ID") Long announcementId, AnnouncementRESTModel restModel) {
    if (announcementId == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    Announcement oldAnnouncement = announcementController.findById(announcementId);
    
    if (oldAnnouncement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Check that the user has permission to update the old announcement
    if (!canEdit(oldAnnouncement, sessionController.getLoggedUser())) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update this announcement.").build();
    }
    
    List<Long> workspaceEntityIds = restModel.getWorkspaceEntityIds();
    if (workspaceEntityIds == null) {
      workspaceEntityIds = Collections.emptyList();
    }
    
    List<Long> userGroupEntityIds = restModel.getUserGroupEntityIds();
    if (userGroupEntityIds == null) {
      userGroupEntityIds = Collections.emptyList();
    }
    
    if (workspaceEntityIds.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.UPDATE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update environment announcements").build();
    }

    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.UPDATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update workspace announcement").build();
      }
    }
    
    boolean pinned = oldAnnouncement.isPinned();
    
    if (oldAnnouncement.isPinned() != restModel.isPinned() && sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      pinned = restModel.isPinned();
    }
    
    // Categories
    List<AnnouncementCategory> categories = new ArrayList<AnnouncementCategory>();
    
    if (CollectionUtils.isNotEmpty(restModel.getCategories())) {
      for (AnnouncementCategoryRESTModel categoryRest : restModel.getCategories()) {
        AnnouncementCategory category = announcementController.findAnnouncementCategoryById(categoryRest.getId());
        
        if (category != null) {
          categories.add(category);
        }
      }
    }

    Announcement newAnnouncement = announcementController.updateAnnouncement(
        oldAnnouncement,
        restModel.getCaption(),
        restModel.getContent(),
        restModel.getStartDate(),
        restModel.getEndDate(),
        restModel.getPubliclyVisible(),
        restModel.isArchived(),
        pinned,
        categories
    );

    announcementController.clearAnnouncementTargetGroups(newAnnouncement);
    for (Long userGroupEntityId : userGroupEntityIds) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroupEntityId);
      
      if (userGroupEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid userGroupEntityId").build();
      }
      
      announcementController.addAnnouncementTargetGroup(newAnnouncement, userGroupEntity);
    }

    announcementController.clearAnnouncementWorkspaces(newAnnouncement);
    for (Long workspaceEntityId : workspaceEntityIds) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      announcementController.addAnnouncementWorkspace(newAnnouncement, workspaceEntity);
    }

    List<AnnouncementUserGroup> announcementUserGroups = announcementController.listAnnouncementUserGroups(newAnnouncement);
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspaces(newAnnouncement);
    
    
    boolean pinnedByLoggedUser = false;
    
    AnnouncementRecipient announcementRecipient = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(newAnnouncement, sessionController.getLoggedUserEntity().getId());
    
    if (announcementRecipient != null) {
      pinnedByLoggedUser = announcementRecipient.isPinned();
    }
    return Response
        .ok(createRESTModel(newAnnouncement, announcementUserGroups, announcementWorkspaces, pinnedByLoggedUser))
        .build();
  }
  
  @GET
  @Path("/announcements")
  @RESTPermit(handling=Handling.INLINE)
  public Response listAnnouncements(
      @QueryParam("hideEnvironmentAnnouncements") @DefaultValue("false") boolean hideEnvironmentAnnouncements,
      @QueryParam("hideWorkspaceAnnouncements") @DefaultValue("false") boolean hideWorkspaceAnnouncements,
      @QueryParam("hideGroupAnnouncements") @DefaultValue("false") boolean hideGroupAnnouncements,
      @QueryParam("workspaceEntityId") Long workspaceEntityId,
      @QueryParam("onlyMine") @DefaultValue("false") boolean onlyMine,
      @QueryParam("onlyEditable") @DefaultValue("false") boolean onlyEditable,
      @QueryParam("onlyArchived") @DefaultValue("false") boolean onlyArchived,
      @QueryParam("onlyUnread") @DefaultValue("false") boolean onlyUnread,
      @QueryParam("timeFrame") @DefaultValue("CURRENT") AnnouncementTimeFrame timeFrame,
      @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, 
      @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults,
      @QueryParam("categoryIds") List<Long> categoryIds
  ) {
    if (!sessionController.isLoggedIn()) {
      return Response.noContent().build();
    }
    
    UserEntity currentUserEntity = sessionController.getLoggedUserEntity();
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    Set<SchoolDataIdentifier> announcementsForUser = Set.of(loggedUser);
    UserSchoolDataIdentifier schoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(loggedUser);
    OrganizationEntity organizationEntity = schoolDataIdentifier.getOrganization();
    if (organizationEntity == null) {
      return Response.noContent().build();
    }
    
    List<Announcement> announcements = null;

    AnnouncementEnvironmentRestriction environment = 
        hideEnvironmentAnnouncements ? AnnouncementEnvironmentRestriction.NONE :
            sessionController.hasEnvironmentPermission(AnnouncerPermissions.LIST_ENVIRONMENT_GROUP_ANNOUNCEMENTS) ? 
                AnnouncementEnvironmentRestriction.PUBLICANDGROUP : AnnouncementEnvironmentRestriction.PUBLIC;

    if (schoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT_PARENT)) {
      /*
       * Guardian cannot list with onlyMine - there's no sensible situation for that.
       * They always only list the announcements of their dependants.
       */
      
      if (onlyMine) {
        return Response.status(Status.BAD_REQUEST).entity("Guardian cannot have own announcements.").build();
      }
      List<GuardiansDependent> guardiansDependents = userController.listGuardiansDependents(loggedUser);
      announcementsForUser = guardiansDependents == null ? Collections.emptySet() :
        guardiansDependents.stream().map(GuardiansDependent::getUserIdentifier).collect(Collectors.toSet());
    }
    
    // Categories
    List<AnnouncementCategory> announcementCategories = new ArrayList<AnnouncementCategory>();
    
    if (CollectionUtils.isNotEmpty(categoryIds)) {
      
      for (Long categoryId : categoryIds) {
        AnnouncementCategory category = announcementController.findAnnouncementCategoryById(categoryId);
        
        if (category != null) {
          announcementCategories.add(category);
        }
      }
    }
    
    if (workspaceEntityId == null) {
      boolean includeGroups = !hideGroupAnnouncements;
      boolean includeWorkspaces = !hideWorkspaceAnnouncements;
      announcements = announcementController.listAnnouncements(announcementsForUser, organizationEntity,
          includeGroups, includeWorkspaces, environment, timeFrame, onlyMine ? currentUserEntity : null, onlyUnread, sessionController.getLoggedUserEntity().getId(), onlyArchived, firstResult, maxResults, announcementCategories);

    }
    else {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Workspace entity with given ID not found").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.LIST_WORKSPACE_ANNOUNCEMENTS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to list workspace announcements").build();
      }
      
      announcements = announcementController.listWorkspaceAnnouncements(organizationEntity,
          Arrays.asList(workspaceEntity), environment, timeFrame, onlyMine ? currentUserEntity : null, onlyUnread, sessionController.getLoggedUserEntity().getId(), onlyArchived, firstResult, maxResults);
    }
    int unreadAnnouncements = 0;
    
    List<AnnouncementRESTModel> restModels = new ArrayList<>();
    for (Announcement announcement : announcements) {
      if (onlyEditable && !canEdit(announcement, loggedUser)) {
        continue;
      }
      
      List<AnnouncementUserGroup> announcementUserGroups = announcementController.listAnnouncementUserGroups(announcement);
      List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspacesSortByUserFirst(announcement, loggedUser);
      
      AnnouncementRecipient ar = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(announcement, currentUserEntity.getId());
      // Count unread announcements      
      if (ar == null) {
        unreadAnnouncements++;
      }
      AnnouncementRESTModel restModel = createRESTModel(announcement, announcementUserGroups, announcementWorkspaces, ar.isPinned());
      restModels.add(restModel);
      
    }
    AnnouncementWithUnreadsRESTModel restModel = new AnnouncementWithUnreadsRESTModel();
    restModel.setAnnouncements(restModels);
    restModel.setUnreadCount(unreadAnnouncements);
    
    return Response.ok(restModel).build();
  }
  
  @GET
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response findAnnouncementById(@PathParam("ID") Long announcementId) {
    
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).entity("Announcement not found").build();
    }
    
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    
    // Permission checks - either global permission to access all announcements or permission via groups etc
    if (!sessionController.hasEnvironmentPermission(AnnouncerPermissions.FIND_ANNOUNCEMENT)) {
      if (!canSeeAnnouncement(announcement, loggedUser)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<AnnouncementUserGroup> announcementUserGroups = announcementController.listAnnouncementUserGroups(announcement);
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspacesSortByUserFirst(announcement, loggedUser);
    
    boolean pinnedByLoggedUser = false;
    
    AnnouncementRecipient announcementRecipient = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(announcement, sessionController.getLoggedUserEntity().getId());
    
    if (announcementRecipient != null) {
      pinnedByLoggedUser = announcementRecipient.isPinned();
    }
    return Response.ok(createRESTModel(announcement, announcementUserGroups, announcementWorkspaces, pinnedByLoggedUser)).build();
  }
  
  @POST
  @Path("/announcements/{ANNOUNCEMENTID}/markAsRead")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markAnnouncementAsRead(@PathParam("ANNOUNCEMENTID") Long announcementId) {
    
    Announcement announcement = announcementController.findById(announcementId);
    
    if (announcement == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid announcementId").build();
    }
    
    AnnouncementRecipient announcementRecipient = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(announcement, sessionController.getLoggedUserEntity().getId());
    
    if (announcementRecipient == null) {

      announcementRecipient = announcementController.createAnnouncementRecipient(announcement, sessionController.getLoggedUserEntity().getId(), new Date(), false);
    }
    AnnouncementRecipientRESTModel restModel = new AnnouncementRecipientRESTModel();
    
    if (announcementRecipient != null) {
      restModel.setAnnouncementId(announcementRecipient.getAnnouncement().getId());
      restModel.setReadDate(announcementRecipient.getReadDate());
      restModel.setUserEntityId(announcementRecipient.getUserEntityId());
      restModel.setId(announcementRecipient.getId());
    }

    return Response
        .ok(restModel)
        .build();
  }

  @POST
  @Path("/announcements/markAllAsRead")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response markUsersAllAnnouncementAsRead() {
    
    UserEntity userEntity = userEntityController.findUserEntityById(sessionController.getLoggedUserEntity().getId());
    
    Set<SchoolDataIdentifier> announcementsForUser = Set.of(sessionController.getLoggedUser());
    
    UserSchoolDataIdentifier schoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    OrganizationEntity organizationEntity = schoolDataIdentifier.getOrganization();
    
    List<Announcement> announcements = announcementController.listAnnouncements(announcementsForUser, organizationEntity,
        true, true, AnnouncementEnvironmentRestriction.PUBLICANDGROUP, AnnouncementTimeFrame.CURRENT, null, true, sessionController.getLoggedUserEntity().getId(), false, 0, 100, new ArrayList<AnnouncementCategory>());

    List<AnnouncementRecipientRESTModel> restModels = new ArrayList<AnnouncementRecipientRESTModel>();
    
    for (Announcement announcement : announcements) {
      AnnouncementRecipient announcementRecipient = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(announcement, userEntity.getId());
      
      if (announcementRecipient == null) {
        announcementRecipient = announcementController.createAnnouncementRecipient(announcement, userEntity.getId(), new Date(), false);
      }
      
      AnnouncementRecipientRESTModel restModel = new AnnouncementRecipientRESTModel();
      
      restModel.setAnnouncementId(announcementRecipient.getAnnouncement().getId());
      restModel.setReadDate(announcementRecipient.getReadDate());
      restModel.setUserEntityId(announcementRecipient.getUserEntityId());
      restModel.setId(announcementRecipient.getId());
      
      restModels.add(restModel);
    }

    return Response
        .ok(restModels)
        .build();
  }
  
  @POST
  @Path("/categories/create")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createAnnouncementCategory(AnnouncementCategoryRESTModel restModel) {
    
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to create announcement categories").build();
    }
    
    if (restModel.getCategory() == null || restModel.getColor() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing category name or color").build();
    }
    AnnouncementCategory announcementCategory = announcementController.createCategory(restModel.getCategory(), restModel.getColor());
    
    return Response
        .ok(toRestModel(announcementCategory))
        .build();
  }
  
  @GET
  @Path("/categories")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listCategories() {
    List<AnnouncementCategory> categories = announcementController.listAnnouncementCategories();
    
    List<AnnouncementCategoryRESTModel> categoriesRestList = new ArrayList<AnnouncementCategoryRESTModel>();
    for (AnnouncementCategory category : categories) {
      categoriesRestList.add(toRestModel(category));
    }
    
    return Response
        .ok(categoriesRestList)
        .build();
  }
  
  @PUT
  @Path("/categories/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateAnnouncementCategory(@PathParam("ID") Long announcementCategoryId, AnnouncementCategoryRESTModel restModel) {
    if (announcementCategoryId == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (restModel.getCategory() == null || restModel.getColor() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing category name or color").build();
    }
    
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update announcement categories").build();
    }
    
    AnnouncementCategory announcementCategory = announcementController.findAnnouncementCategoryById(announcementCategoryId);
    
    if (announcementCategory == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    return Response
        .ok(toRestModel(announcementController.updateAnnouncementCategory(announcementCategory, restModel.getCategory(), restModel.getColor())))
        .build();
        
  }
  
  @DELETE
  @Path("/categories/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteAnnouncementCategory(@PathParam("ID") Long announcementCategoryId) {
    AnnouncementCategory announcementCategory = announcementController.findAnnouncementCategoryById(announcementCategoryId);
    
    if (announcementCategory == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    announcementController.deleteAnnouncementCategory(announcementCategory);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/announcements/{ANNOUNCEMENTID}/pin")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response pinAnnouncementByReader(@PathParam("ANNOUNCEMENTID") Long announcementId) {
    
    Announcement announcement = announcementController.findById(announcementId);
    
    if (announcement == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid announcementId").build();
    }
    
    AnnouncementRecipient announcementRecipient = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(announcement, sessionController.getLoggedUserEntity().getId());
    
    if (announcementRecipient == null) {
      announcementRecipient = announcementController.createAnnouncementRecipient(announcement, sessionController.getLoggedUserEntity().getId(), null, true);
    } else {
      announcementRecipient = announcementController.updateAnnouncementRecipient(announcementRecipient, announcementRecipient.getReadDate(), !announcementRecipient.isPinned());
    }
    
    AnnouncementRecipientRESTModel restModel = new AnnouncementRecipientRESTModel();
    
    if (announcementRecipient != null) {
      restModel.setAnnouncementId(announcementRecipient.getAnnouncement().getId());
      restModel.setReadDate(announcementRecipient.getReadDate());
      restModel.setUserEntityId(announcementRecipient.getUserEntityId());
      restModel.setId(announcementRecipient.getId());
    }

    return Response
        .ok(restModel)
        .build();
  }

  private AnnouncementCategoryRESTModel toRestModel(AnnouncementCategory category) {
    AnnouncementCategoryRESTModel restModel = new AnnouncementCategoryRESTModel();
    
    restModel.setCategory(category.getCategoryName());
    restModel.setId(category.getId());
    restModel.setColor(category.getColor());
    
    return restModel;
  }
  
  private boolean canSeeAnnouncement(Announcement announcement, SchoolDataIdentifier userIdentifier) {
    /**
     * This is not very efficient, but things needed to be checked are
     * - Is the user in a group the announcement is published for
     * - Is the user member of a workspace the announcement is for
     * - Is the announcement public
     */
    
    // hasOrganizationAccess returns false anyways if the user doesn't exist, so just shortcut it here too
    if (userIdentifier == null) {
      return false;
    }

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (!hasOrganizationAccess(announcement, userSchoolDataIdentifier)) {
      return false;
    }
    
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
    Set<Long> userGroupIds = userGroups.stream().map(userGroup -> userGroup.getId()).collect(Collectors.toSet());
    
    List<AnnouncementUserGroup> announcementGroups = announcementController.listAnnouncementUserGroups(announcement);
    Set<Long> announcementGroupIds = announcementGroups.stream().map(announcementGroup -> announcementGroup.getUserGroupEntityId()).collect(Collectors.toSet());

    if (CollectionUtils.containsAny(announcementGroupIds, userGroupIds)) {
      return true;
    }
    
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspacesSortByUserFirst(announcement, userIdentifier);
    if (CollectionUtils.isNotEmpty(announcementWorkspaces)) {
      /**
       * If announcement is tied to any workspace, the user needs to have access to a workspace to find
       * the announcement.
       */

      for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(announcementWorkspace.getWorkspaceEntityId());
        
        if (sessionController.hasWorkspacePermission(AnnouncerPermissions.LIST_WORKSPACE_ANNOUNCEMENTS, workspaceEntity)) {
          return true;
        }
      }
      
      return false;
    }
    
    if (Boolean.TRUE.equals(announcement.getPubliclyVisible())) {
      return true;
    }
    
    // No common groups nor workspaces, return false
    return false;
  }

  private boolean hasOrganizationAccess(Announcement announcement, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    if (announcement == null || userSchoolDataIdentifier == null) {
      return false;
    }
    
    Long announcementOrganizationId = announcement.getOrganizationEntityId();
    Long userOrganizationId = userSchoolDataIdentifier.getOrganization() != null ? userSchoolDataIdentifier.getOrganization().getId() : null;

    if (userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return true;
    }
    
    if (announcementOrganizationId == null || userOrganizationId == null) {
      return false;
    }
    
    return Objects.equals(announcementOrganizationId, userOrganizationId);
  }

  private AnnouncementRESTModel createRESTModel(Announcement announcement, List<AnnouncementUserGroup> announcementUserGroups, List<AnnouncementWorkspace> announcementWorkspaces, boolean pinnedByLoggedUser) {
    AnnouncementRESTModel restModel = new AnnouncementRESTModel();
    restModel.setPublisherUserEntityId(announcement.getPublisherUserEntityId());
    restModel.setCaption(announcement.getCaption());
    restModel.setContent(announcement.getContent());
    restModel.setCreated(announcement.getCreated());
    restModel.setStartDate(announcement.getStartDate());
    restModel.setEndDate(announcement.getEndDate());
    restModel.setId(announcement.getId());
    restModel.setPubliclyVisible(announcement.getPubliclyVisible());
    restModel.setArchived(announcement.getArchived());
    restModel.setPinned(announcement.isPinned());
    restModel.setPinnedByLoggedUser(pinnedByLoggedUser);

    List<Long> userGroupEntityIds = new ArrayList<>();
    for (AnnouncementUserGroup announcementUserGroup : announcementUserGroups) {
      // #5170: Skip archived user groups 
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(announcementUserGroup.getUserGroupEntityId());
      if (userGroupEntity == null || Boolean.TRUE.equals(userGroupEntity.getArchived())) {
        continue;
      }
      userGroupEntityIds.add(announcementUserGroup.getUserGroupEntityId());
    }
    restModel.setUserGroupEntityIds(userGroupEntityIds);

    List<Long> workspaceEntityIds = new ArrayList<>();
    List<WorkspaceBasicInfo> workspaceBasicInfos = new ArrayList<>();
    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
      workspaceEntityIds.add(announcementWorkspace.getWorkspaceEntityId());
      
      WorkspaceBasicInfo workspaceBasicInfo = workspaceRESTModelController.workspaceBasicInfo(announcementWorkspace.getWorkspaceEntityId());
      if (workspaceBasicInfo != null)
        workspaceBasicInfos.add(workspaceBasicInfo);
      else
        logger.warning(String.format("Logged user couldn't find workspace basic info for workspace"));
    }
    restModel.setWorkspaceEntityIds(workspaceEntityIds);
    restModel.setWorkspaces(workspaceBasicInfos);
    
    Date date = currentDate();
    if (date.before(announcement.getStartDate())) {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.UPCOMING);
    } else if (date.after(announcement.getEndDate())) {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.ENDED);
    } else {
      restModel.setTemporalStatus(AnnouncementTemporalStatus.ACTIVE);
    }
    
    boolean unread = announcementController.findAnnouncementRecipientByAnnouncementAndUserEntityId(announcement, sessionController.getLoggedUserEntity().getId()) == null;
    
    restModel.setUnread(unread);
    
    // categories
    List<AnnouncementCategoryRESTModel> categories = new ArrayList<AnnouncementCategoryRESTModel>();
    List<AnnouncementCategory> announcementCategories = announcement.getCategories();
    
    for (AnnouncementCategory announcementCategory : announcementCategories) {
      categories.add(toRestModel(announcementCategory));
    }
    
    restModel.setCategories(categories);

    return restModel;
  }

  private boolean canEdit(Announcement announcement, List<AnnouncementWorkspace> announcementWorkspaces, SchoolDataIdentifier userIdentifier) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);
    if (!hasOrganizationAccess(announcement, userSchoolDataIdentifier)) {
      return false;
    }
    
    // You can edit your own announcements
    UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
    if (announcement.getPublisherUserEntityId() == userEntity.getId()) {
      return true;
    }
    
    if (CollectionUtils.isEmpty(announcementWorkspaces)) {
      // Environment announcement
      return sessionController.hasEnvironmentPermission(AnnouncerPermissions.UPDATE_ANNOUNCEMENT);
    } else {
      // Workspace(s)-tied announcement, needs to have permission to update in all workspaces.
      for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(announcementWorkspace.getWorkspaceEntityId());
  
        if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.UPDATE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
          return false;
        }
      }
      return true;
    }
  }
  
  private boolean canEdit(Announcement announcement, SchoolDataIdentifier userIdentifier) {
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspaces(announcement);
    return canEdit(announcement, announcementWorkspaces, userIdentifier);
  }

  @DELETE
  @Path("/announcements/{ID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteAnnouncement(@PathParam("ID") Long announcementId) {
    Announcement announcement = announcementController.findById(announcementId);
    if (announcement == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    if (!hasOrganizationAccess(announcement, userSchoolDataIdentifier)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    List<AnnouncementWorkspace> announcementWorkspaces = announcementController.listAnnouncementWorkspaces(announcement);

    if (announcementWorkspaces.isEmpty() && !sessionController.hasEnvironmentPermission(AnnouncerPermissions.DELETE_ANNOUNCEMENT)) {
      return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update environment announcements").build();
    }

    for (AnnouncementWorkspace announcementWorkspace : announcementWorkspaces) {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(announcementWorkspace.getWorkspaceEntityId());

      if (workspaceEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceEntityId").build();
      }

      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.DELETE_WORKSPACE_ANNOUNCEMENT, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).entity("You don't have the permission to update workspace announcement").build();
      }
    }

    announcementController.archive(announcement);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path("/attachment/{ATTACHMENTNAME}")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response getMessageAttachment(@PathParam ("ATTACHMENTNAME") String attachmentName, @Context Request request) {
    if (StringUtils.isBlank(attachmentName)) {
      return Response.status(Response.Status.BAD_REQUEST).build();
    }
    
    AnnouncementAttachment announcementAttachment = announcementController.findAttachmentByName(attachmentName);
    if (announcementAttachment == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    EntityTag tag = new EntityTag(announcementAttachment.getName());
    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    
    return Response.ok(announcementAttachment.getContent())
        .cacheControl(cacheControl)
        .tag(tag)
        .type(announcementAttachment.getContentType())
        .build();
  }
  
}

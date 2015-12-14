package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.rest.model.Student;
import fi.muikku.rest.model.UserBasicInfo;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/user")
@Produces("application/json")
@Consumes("application/json")
public class UserRESTService extends AbstractRESTService {

  @Inject
  private Logger logger;
  
	@Inject
	private UserController userController;

	@Inject
	private UserEntityController userEntityController;

  @Inject
  private UserGroupEntityController userGroupEntityController; 
  
	@Inject
	private UserEmailEntityController userEmailEntityController;
	
	@Inject
	private SessionController sessionController;
	
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
	
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController; 
  
  @Inject
	@Any
	private Instance<SearchProvider> searchProviders;
  
  @GET
  @Path("/students")
  @RESTPermit (handling = Handling.INLINE)
  public Response searchStudents(
      @QueryParam("searchString") String searchString,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults,
      @QueryParam("userGroupIds") List<Long> userGroupIds,
      @QueryParam("myUserGroups") Boolean myUserGroups,
      @QueryParam("workspaceIds") List<Long> workspaceIds,
      @QueryParam("myWorkspaces") Boolean myWorkspaces) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    if (CollectionUtils.isNotEmpty(userGroupIds) && Boolean.TRUE.equals(myUserGroups)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (CollectionUtils.isNotEmpty(workspaceIds) && Boolean.TRUE.equals(myWorkspaces)) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    List<fi.muikku.rest.model.Student> students = new ArrayList<>();

    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    
    Set<Long> userGroupFilters = null;
    Set<Long> workspaceFilters = new HashSet<Long>();

    if ((myUserGroups != null) && myUserGroups) {
      userGroupFilters = new HashSet<Long>();

      // Groups where user is a member
      
      List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUser(loggedUser);
      for (UserGroupEntity userGroup : userGroups) {
        userGroupFilters.add(userGroup.getId());
      }
    } else if (!CollectionUtils.isEmpty(userGroupIds)) {
      userGroupFilters = new HashSet<Long>();
      
      // Defined user groups
      userGroupFilters.addAll(userGroupIds);
    }

    if ((myWorkspaces != null) && myWorkspaces) {
      // Workspaces where user is a member
      List<WorkspaceEntity> workspaces = workspaceUserEntityController.listWorkspaceEntitiesByUserEntity(loggedUser);
      Set<Long> myWorkspaceIds = new HashSet<Long>();
      for (WorkspaceEntity ws : workspaces)
        myWorkspaceIds.add(ws.getId());

      workspaceFilters.addAll(myWorkspaceIds);
    } else if (!CollectionUtils.isEmpty(workspaceIds)) {
      // Defined workspaces
      workspaceFilters.addAll(workspaceIds);
    }

    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      String[] fields = new String[] { "firstName", "lastName" };

      SearchResult result = elasticSearchProvider.searchUsers(searchString, fields, EnvironmentRoleArchetype.STUDENT, userGroupFilters, workspaceFilters, firstResult, maxResults);
      
      List<Map<String, Object>> results = result.getResults();
      boolean hasImage = false;

      if (results != null && !results.isEmpty()) {
        for (Map<String, Object> o : results) {
          String studentId = (String) o.get("id");
          if (StringUtils.isBlank(studentId)) {
            logger.severe("Could not process user found from search index because it had a null id");
            continue;
          }
          
          String[] studentIdParts = studentId.split("/", 2);
          SchoolDataIdentifier studentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
          if (studentIdentifier == null) {
            logger.severe(String.format("Could not process user found from search index with id %s", studentId));
            continue;
          }
          
          UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
          String emailAddress = userEntity != null ? userEmailEntityController.getUserEmailAddress(userEntity, true) : null;
            
          @SuppressWarnings("unchecked")
          HashMap<String, Object> studyStartDate = (HashMap<String, Object>)o.get("studyStartDate");
          @SuppressWarnings("unchecked")
          HashMap<String, Object> studyTimeEnd = (HashMap<String, Object>)o.get("studyTimeEnd");
          Date studyStartDateDate = null;
          Date studyTimeEndDate = null;
          
          if (studyStartDate != null) {
            studyStartDateDate = new Date((Long)studyStartDate.get("millis"));
          }
          
          if (studyTimeEnd != null) {
            studyTimeEndDate = new Date((Long)studyTimeEnd.get("millis"));
          }
          
          students.add(new fi.muikku.rest.model.Student(
            studentIdentifier.toId(), 
            (String) o.get("firstName"),
            (String) o.get("lastName"), 
            hasImage,
            (String) o.get("nationality"), 
            (String) o.get("language"), 
            (String) o.get("municipality"), 
            (String) o.get("school"), 
            emailAddress,
            studyStartDateDate,
            studyTimeEndDate));
        }
      }
    }

    return Response.ok(students).build();
  }

  @GET
  @Path("/students/{ID}")
  @RESTPermit (handling = Handling.INLINE)
  public Response findUser(@Context Request request, @PathParam("ID") String id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(id);
    if (studentIdentifier == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity(String.format("Invalid studentIdentifier %s", id)).build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("UserEntity not found").build();
    }

    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(userEntity.getVersion())));

    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    
    User user = userController.findUserByIdentifier(studentIdentifier);
    if (user == null) {
      return Response.status(Status.NOT_FOUND).entity("User not found").build();
    }
    
    String emailAddress = userEmailEntityController.getUserEmailAddress(userEntity, true); 
    Date startDate = user.getStudyStartDate() != null ? user.getStudyStartDate().toDate() : null;
    Date endDate = user.getStudyTimeEnd() != null ? user.getStudyTimeEnd().toDate() : null;
    
    Student student = new Student(
        studentIdentifier.toId(), 
        user.getFirstName(), 
        user.getLastName(), 
        false, 
        user.getNationality(), 
        user.getLanguage(), 
        user.getMunicipality(), 
        user.getSchool(), 
        emailAddress, 
        startDate, 
        endDate);
    
    return Response
        .ok(student)
        .cacheControl(cacheControl)
        .tag(tag)
        .build();
  }

	@GET
	@Path("/users")
	@RESTPermitUnimplemented
	@SuppressWarnings("unchecked")
	public Response searchUsers(
			@QueryParam("searchString") String searchString,
			@QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
			@QueryParam("maxResults") @DefaultValue("10") Integer maxResults,
			@QueryParam("userGroupIds") List<Long> userGroupIds,
      @QueryParam("myUserGroups") Boolean myUserGroups,
			@QueryParam("workspaceIds") List<Long> workspaceIds,
      @QueryParam("myWorkspaces") Boolean myWorkspaces,
			@QueryParam("archetype") String archetype) {
	  
	  // TODO: Add new endpoint for listing staff members and deprecate this.
	  
	  if (!sessionController.isLoggedIn()) {
	    return Response.status(Status.FORBIDDEN).build();
	  }

	  if (CollectionUtils.isNotEmpty(userGroupIds) && Boolean.TRUE.equals(myUserGroups))
	    return Response.status(Status.BAD_REQUEST).build();
	  
    if (CollectionUtils.isNotEmpty(workspaceIds) && Boolean.TRUE.equals(myWorkspaces))
      return Response.status(Status.BAD_REQUEST).build();
    
	  UserEntity loggedUser = sessionController.getLoggedUserEntity();
	  
	  EnvironmentRoleArchetype roleArchetype = archetype != null ? EnvironmentRoleArchetype.valueOf(archetype) : null;

    Set<Long> userGroupFilters = null;
    Set<Long> workspaceFilters = new HashSet<Long>();

	  if ((myUserGroups != null) && myUserGroups) {
	    userGroupFilters = new HashSet<Long>();

	    // Groups where user is a member
	    
	    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUser(loggedUser);
	    for (UserGroupEntity userGroup : userGroups) {
	      userGroupFilters.add(userGroup.getId());
	    }
	  } else if (!CollectionUtils.isEmpty(userGroupIds)) {
	    userGroupFilters = new HashSet<Long>();
	    
      // Defined user groups
	    userGroupFilters.addAll(userGroupIds);
	  }

    if ((myWorkspaces != null) && myWorkspaces) {
      // Workspaces where user is a member
      List<WorkspaceEntity> workspaces = workspaceUserEntityController.listWorkspaceEntitiesByUserEntity(loggedUser);
      Set<Long> myWorkspaceIds = new HashSet<Long>();
      for (WorkspaceEntity ws : workspaces)
        myWorkspaceIds.add(ws.getId());

      workspaceFilters.addAll(myWorkspaceIds);
    } else if (!CollectionUtils.isEmpty(workspaceIds)) {
      // Defined workspaces
      workspaceFilters.addAll(workspaceIds);
    }

    SearchProvider elasticSearchProvider = getProvider("elastic-search");
		if (elasticSearchProvider != null) {
			String[] fields = new String[] { "firstName", "lastName" };

			SearchResult result = elasticSearchProvider.searchUsers(searchString, fields, roleArchetype, userGroupFilters, workspaceFilters, firstResult, maxResults);
			
			List<Map<String, Object>> results = result.getResults();
			boolean hasImage = false;

			List<fi.muikku.rest.model.User> ret = new ArrayList<fi.muikku.rest.model.User>();

			if (!results.isEmpty()) {
				for (Map<String, Object> o : results) {
					String[] id = ((String) o.get("id")).split("/", 2);
					UserEntity userEntity = userEntityController
							.findUserEntityByDataSourceAndIdentifier(id[1],
									id[0]);
					
					if (userEntity != null) {
					  String emailAddress = userEmailEntityController.getUserEmailAddress(userEntity, true);
					  
					  HashMap<String, Object> studyStartDate = (HashMap<String, Object>)o.get("studyStartDate");
					  HashMap<String, Object> studyTimeEnd = (HashMap<String, Object>)o.get("studyTimeEnd");
					  Date studyStartDateDate = null;
					  Date studyTimeEndDate = null;
					  
					  if (studyStartDate != null) {
					    studyStartDateDate = new Date((Long)studyStartDate.get("millis"));
					  }
					  
					  if (studyTimeEnd != null) {
					    studyTimeEndDate = new Date((Long)studyTimeEnd.get("millis"));
					  }
					  
						ret.add(new fi.muikku.rest.model.User(userEntity
								.getId(), (String) o.get("firstName"),
								(String) o.get("lastName"), hasImage,
								(String) o.get("nationality"), (String) o
										.get("language"), (String) o
										.get("municipality"), (String) o
										.get("school"), emailAddress,
										studyStartDateDate,
										studyTimeEndDate));
					}
				}

				return Response.ok(ret).build();
			} else
				return Response.noContent().build();
		}

		return Response.status(Status.INTERNAL_SERVER_ERROR).build();
	}

  @GET
	@Path("/users/{ID}")
  @RESTPermitUnimplemented
	public Response findUser(@Context Request request, @PathParam("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

		UserEntity userEntity = userEntityController.findUserEntityById(id);
		if (userEntity == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(userEntity.getVersion())));

    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);

		User user = userController.findUserByDataSourceAndIdentifier(
				userEntity.getDefaultSchoolDataSource(),
				userEntity.getDefaultIdentifier());
		if (user == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

		return Response
		    .ok(createRestModel(userEntity, user))
        .cacheControl(cacheControl)
        .tag(tag)
		    .build();
	}

  @GET
  @Path("/users/{ID}/basicinfo")
  @RESTPermitUnimplemented
  public Response findUserBasicInfo(@Context Request request, @PathParam("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    UserEntity userEntity = userEntityController.findUserEntityById(id);
    if (userEntity == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(userEntity.getVersion())));

    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }

    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);

    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByDataSourceAndIdentifier(
          userEntity.getDefaultSchoolDataSource(),
          userEntity.getDefaultIdentifier());
      if (user == null) {
        return Response.status(Response.Status.NOT_FOUND).build();
      }

      // TODO: User image
      boolean hasImage = false;
      return Response
          .ok(new UserBasicInfo(userEntity.getId(), user.getFirstName(), user.getLastName(), user.getStudyProgrammeName(), hasImage))
          .cacheControl(cacheControl)
          .tag(tag)
          .build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  private fi.muikku.rest.model.User createRestModel(UserEntity userEntity,
			User user) {
		// TODO: User Image
		boolean hasImage = false;
		
		String emailAddress = userEmailEntityController.getUserEmailAddress(userEntity, true); 
		
		Date startDate = user.getStudyStartDate() != null ? user.getStudyStartDate().toDate() : null;
		Date endDate = user.getStudyTimeEnd() != null ? user.getStudyTimeEnd().toDate() : null;
		
		return new fi.muikku.rest.model.User(userEntity.getId(),
				user.getFirstName(), user.getLastName(), hasImage,
				user.getNationality(), user.getLanguage(),
				user.getMunicipality(), user.getSchool(), emailAddress,
				startDate, endDate);
	}

	//
	// FIXME: Re-enable this service
	//
	// // @GET
	// // @Path ("/listEnvironmentUsers")
	// // public Response listEnvironmentUsers() {
	// // List<EnvironmentUser> users = userController.listEnvironmentUsers();
	// //
	// // TranquilityBuilder tranquilityBuilder =
	// tranquilityBuilderFactory.createBuilder();
	// // Tranquility tranquility = tranquilityBuilder.createTranquility()
	// //
	// .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
	// //
	// // return Response.ok(
	// // tranquility.entities(users)
	// // ).build();
	// // }
	//

	private SearchProvider getProvider(String name) {
		Iterator<SearchProvider> i = searchProviders.iterator();
		while (i.hasNext()) {
			SearchProvider provider = i.next();
			if (name.equals(provider.getName())) {
				return provider;
			}
		}
		return null;
	}

}

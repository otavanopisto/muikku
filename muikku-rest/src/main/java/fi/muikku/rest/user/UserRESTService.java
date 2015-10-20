package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.rest.model.UserBasicInfo;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.WorkspaceUserEntityController;

@Stateful
@RequestScoped
@Path("/user")
@Produces("application/json")
@Consumes("application/json")
public class UserRESTService extends AbstractRESTService {

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
    Set<Long> workspaceFilters = null;
	  
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
      workspaceFilters = new HashSet<Long>();
      
      // Workspaces where user is a member
      
      List<WorkspaceEntity> workspaces = workspaceUserEntityController.listWorkspaceEntitiesByUserEntity(loggedUser);
      for (WorkspaceEntity workspace : workspaces) {
        workspaceFilters.add(workspace.getId());
      }
    } else if (!CollectionUtils.isEmpty(workspaceIds)) {
      workspaceFilters = new HashSet<Long>();
      
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
					  String emailAddress = getUserEmailAddress(userEntity);

					  emailAddress = secret(emailAddress);
					  
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
	public Response findUser(@PathParam("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

		UserEntity userEntity = userEntityController.findUserEntityById(id);
		if (userEntity == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

		User user = userController.findUserByDataSourceAndIdentifier(
				userEntity.getDefaultSchoolDataSource(),
				userEntity.getDefaultIdentifier());
		if (user == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}

		return Response.ok(createRestModel(userEntity, user)).build();
	}

  @GET
  @Path("/users/{ID}/basicinfo")
  @RESTPermitUnimplemented
  public Response findUserBasicInfo(@PathParam("ID") Long id) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    UserEntity userEntity = userEntityController.findUserEntityById(id);
    if (userEntity == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

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
      return Response.ok(new UserBasicInfo(userEntity.getId(), user.getFirstName(), user.getLastName(), hasImage )).build();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  private String secret(String emailAddress) {
    if (emailAddress == null)
      return null;

    emailAddress = emailAddress.toLowerCase();
    
    int atIndex = emailAddress.indexOf('@');
    
    if (atIndex != -1) {
      String user = emailAddress.substring(0, atIndex);
      
      if (user.length() > 3) {
        String domain = emailAddress.substring(atIndex);
    
        return user.substring(0, 2) + "..." + domain;
      } else
        return null;
    } else
      return null;
  }

  private String getUserEmailAddress(UserEntity userEntity) {
    String emailAddress = null;
    List<String> addressesByUserEntity = userEmailEntityController.listAddressesByUserEntity(userEntity);
    
    if ((addressesByUserEntity != null) && (addressesByUserEntity.size() > 0))
      emailAddress = addressesByUserEntity.get(0);
    
    return emailAddress;
  }
  
	private fi.muikku.rest.model.User createRestModel(UserEntity userEntity,
			User user) {
		// TODO: User Image
		boolean hasImage = false;
		
		String emailAddress = getUserEmailAddress(userEntity);
		
		emailAddress = secret(emailAddress);
		
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

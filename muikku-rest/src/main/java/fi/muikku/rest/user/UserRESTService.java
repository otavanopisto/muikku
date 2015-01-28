package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@Path("/user")
@Produces ("application/json")
@Consumes ("application/json")
public class UserRESTService extends AbstractRESTService {

  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @GET
  @Path ("/users")
  public Response searchUsers(@QueryParam("searchString") String searchString, @QueryParam("firstResult") @DefaultValue ("0") Integer firstResult, @QueryParam("maxResults") @DefaultValue ("10") Integer maxResults) {
    try {
      SearchProvider elasticSearchProvider = getProvider("elastic-search");
      if (elasticSearchProvider != null) {
        String[] fields = new String[] { "firstName", "lastName" };
        SearchResult result = null;
        
        if (StringUtils.isBlank(searchString)) {
          result = elasticSearchProvider.matchAllSearch(firstResult, maxResults, User.class);
        } else {
          result = elasticSearchProvider.search(searchString, fields, firstResult, maxResults, User.class);
        }
        
        List<Map<String, Object>> results = result.getResults();
        boolean hasImage = false;
        
        List<fi.muikku.rest.model.User> ret = new ArrayList<fi.muikku.rest.model.User>();
  
        if (!results.isEmpty()) {
          for (Map<String, Object> o : results) {
            String[] id = ((String) o.get("id")).split("/", 2);
            UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(id[1], id[0]);
    
            if (userEntity != null)
              ret.add(new fi.muikku.rest.model.User(userEntity.getId(), (String) o.get("firstName"), (String) o.get("lastName"), hasImage));
          }
          
          return Response.ok(ret).build();
        } else
          return Response.noContent().build();
      }
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
    
    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
  }
  
  @GET
  @Path ("/users/{ID}")
  public Response findUser(@PathParam ("ID") Long id) {
    UserEntity userEntity = userEntityController.findUserEntityById(id);
    if (userEntity == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    User user = userController.findUserByDataSourceAndIdentifier(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
    if (user == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    return Response.ok(createRestModel(userEntity, user)).build();
  }

  private fi.muikku.rest.model.User createRestModel(UserEntity userEntity, User user) {
    // TODO: User Image
    boolean hasImage = false;
    return new fi.muikku.rest.model.User(userEntity.getId(), user.getFirstName(), user.getLastName(), hasImage);
  }
  
//
// FIXME: Re-enable this service  
//  
////  @GET
////  @Path ("/listEnvironmentUsers")
////  public Response listEnvironmentUsers() {
////    List<EnvironmentUser> users = userController.listEnvironmentUsers(); 
////
////    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
////    Tranquility tranquility = tranquilityBuilder.createTranquility()
////      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
////    
////    return Response.ok(
////      tranquility.entities(users)
////    ).build();
////  }
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

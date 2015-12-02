package fi.muikku.rest.user;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.rest.AbstractRESTService;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserGroupEntityController;

@Stateful
@RequestScoped
@Path("/usergroup")
@Produces ("application/json")
public class UserGroupRESTService extends AbstractRESTService {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserGroupEntityController userGroupEntityController; 
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @GET
  @Path("/groups")
  @RESTPermitUnimplemented
  public Response searchUserGroups(
      @QueryParam("searchString") String searchString,
      @QueryParam("firstResult") @DefaultValue("0") Integer firstResult,
      @QueryParam("maxResults") @DefaultValue("10") Integer maxResults) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      String[] fields = new String[] { "name" };
      SearchResult result = null;

      if (StringUtils.isBlank(searchString)) {
        result = elasticSearchProvider.matchAllSearch(firstResult,
            maxResults, UserGroup.class);
      } else {
        result = elasticSearchProvider.search(searchString, fields,
            firstResult, maxResults, UserGroup.class);
      }

      List<Map<String, Object>> results = result.getResults();

      List<fi.muikku.rest.model.UserGroup> ret = new ArrayList<fi.muikku.rest.model.UserGroup>();

      if (!results.isEmpty()) {
        for (Map<String, Object> o : results) {
          String[] id = ((String) o.get("id")).split("/", 2);

          UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityByDataSourceAndIdentifier(id[1], id[0]);
          if (userGroupEntity != null) {
            Long userCount = userGroupEntityController.getGroupUserCount(userGroupEntity);
            ret.add(new fi.muikku.rest.model.UserGroup(
                userGroupEntity.getId(), 
                (String) o.get("name"),
                userCount));
          }
        }

        return Response.ok(ret).build();
      } else
        return Response.noContent().build();
    }

    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
  }

  @GET
  @Path("/groups/{ID}")
  public Response findById(@PathParam("ID") Long groupId) {
    return null;
  }

  @GET
  @Path("/groups/{ID}/users")
  public Response listGroupUsersByGroup(@PathParam("ID") Long groupId) {
    return null;
  }

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

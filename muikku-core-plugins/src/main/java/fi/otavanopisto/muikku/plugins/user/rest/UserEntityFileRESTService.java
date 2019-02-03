package fi.otavanopisto.muikku.plugins.user.rest;

import java.io.IOException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityFile;
import fi.otavanopisto.muikku.model.users.UserEntityFileVisibility;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/user/files")
@Stateful
@Produces("application/json")
public class UserEntityFileRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8589224539219569240L;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private SessionController sessionController;
  
  @POST
  @Path("/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createUserEntityFile(RestUserEntityFile entity) {
    
    // Entity validation
    
    if (StringUtils.isBlank(entity.getContentType())) {
      return Response.status(Status.BAD_REQUEST).entity("contentType is missing").build();
    }
    if (StringUtils.isBlank(entity.getFileId()) && StringUtils.isBlank(entity.getBase64Data())) {
      return Response.status(Status.BAD_REQUEST).entity("fileId or base64Data is missing").build();
    }
    if (StringUtils.isBlank(entity.getIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("identifier is missing").build();
    }
    if (StringUtils.isBlank(entity.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("name is missing").build();
    }
    if (entity.getVisibility() == null) {
      return Response.status(Status.BAD_REQUEST).entity("visibility is missing").build();
    }
    
    // File data (fileId)
    
    byte[] content = null;
    if (StringUtils.isNotBlank(entity.getFileId())) {
      try {
        content = TempFileUtils.getTempFileData(entity.getFileId());
      }
      catch (IOException e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
      }
    }
    else if (StringUtils.isNotBlank(entity.getBase64Data())) {
      String base64Image = entity.getBase64Data().split(",")[1];
      content = DatatypeConverter.parseBase64Binary(base64Image);
    }
    if (content == null) {
      return Response.status(Status.BAD_REQUEST).entity("fileId is invalid").build();
    }
    
    // Store file
    
    UserEntityFile userEntityFile = userEntityFileController.storeUserEntityFile(entity.getIdentifier(), entity.getName(), entity.getContentType(), content, entity.getVisibility());
    if (userEntityFile == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    else {
      return Response.ok(createRestModel(userEntityFile)).build();
    }
  }
  
  @GET
  @Path("/user/{USERENTITYID}/identifier/{IDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getFileContent(@PathParam("USERENTITYID") Long userEntityId, @PathParam("IDENTIFIER") String identifier, @Context Request request) {
    
    // Check if the file exists
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntityFile userEntityFile = userEntityFileController.findByUserEntityAndIdentifier(userEntity, identifier);
    if (userEntityFile == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Check if the caller has access to the file
    
    if (userEntityFile.getVisibility() != UserEntityFileVisibility.PUBLIC) {
      UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
      if (loggedUserEntity == null) {
        return Response.status(Status.NOT_FOUND).build(); 
      }
      else if (!userEntityFile.getUserEntity().getId().equals(loggedUserEntity.getId())) {
        if (userEntityFile.getVisibility() == UserEntityFileVisibility.STAFF) {
          EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
          if (roleEntity == null || roleEntity.getArchetype() == EnvironmentRoleArchetype.STUDENT) {
            return Response.status(Status.NOT_FOUND).build();
          }
        }
        else {
          return Response.status(Status.NOT_FOUND).build();
        }
      }
    }
    
    // Serve the content

    String tagIdentifier = String.format("%d-%s-%d", userEntityFile.getUserEntity().getId(), userEntityFile.getIdentifier(), userEntityFile.getLastModified().getTime());
    EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(tagIdentifier)));
    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }
    CacheControl cacheControl = new CacheControl();
    cacheControl.setMustRevalidate(true);
    byte[] data = userEntityFile.getData();
    return Response.ok(data)
      .cacheControl(cacheControl)
      .tag(tag)
      .header("Content-Length", data.length)
      .header("Content-Disposition", String.format("attachment; filename=\"%s\"", userEntityFile.getName()))
      .type(userEntityFile.getContentType())
      .build();
  }
  
  @DELETE
  @Path("/{USERENTITYID}/identifier/{IDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteFile(@PathParam("USERENTITYID") Long userEntityId, @PathParam("IDENTIFIER") String identifier, @Context Request request) {
    // Check if the file exist
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    UserEntityFile userEntityFile = userEntityFileController.findByUserEntityAndIdentifier(userEntity, identifier);
    if (userEntityFile == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    //Check wheter the logged in user is the same as this user or whether it's an administrator
    UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
    UserEntity loggedUserEntity = userSchoolDataIdentifier != null ? userSchoolDataIdentifier.getUserEntity() : null;
    if (userSchoolDataIdentifier == null || loggedUserEntity == null) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userSchoolDataIdentifier);
    boolean isOwnerOfTheFile = userEntity.getId().equals(loggedUserEntity.getId());
    boolean isAdministrator = roleEntity != null && roleEntity.getArchetype() == EnvironmentRoleArchetype.ADMINISTRATOR;
    boolean isStaff = roleEntity != null && roleEntity.getArchetype() != EnvironmentRoleArchetype.STUDENT;
    boolean isStaffAndFileIsAccessibleByStaff = isStaff && (
        userEntityFile.getVisibility() == UserEntityFileVisibility.STAFF || userEntityFile.getVisibility() == UserEntityFileVisibility.PUBLIC);
    if (!isOwnerOfTheFile && !isAdministrator && !isStaffAndFileIsAccessibleByStaff) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    userEntityFileController.deleteUserEntityFile(userEntityFile);
  
    return Response.noContent().build();
  }

  private RestUserEntityFile createRestModel(UserEntityFile userEntityFile) {
    RestUserEntityFile restUserEntityFile = new RestUserEntityFile();
    restUserEntityFile.setContentType(userEntityFile.getContentType());
    restUserEntityFile.setId(userEntityFile.getId());
    restUserEntityFile.setIdentifier(userEntityFile.getIdentifier());
    restUserEntityFile.setName(userEntityFile.getName());
    restUserEntityFile.setUserEntityId(userEntityFile.getUserEntity().getId());
    restUserEntityFile.setVisibility(userEntityFile.getVisibility());
    return restUserEntityFile;
  }
  
}

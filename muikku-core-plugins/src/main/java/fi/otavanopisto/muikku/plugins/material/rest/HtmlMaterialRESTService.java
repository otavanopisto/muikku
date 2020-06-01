package fi.otavanopisto.muikku.plugins.material.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
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

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;

import fi.foyt.coops.CoOpsApi;
import fi.foyt.coops.CoOpsForbiddenException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.foyt.coops.CoOpsNotFoundException;
import fi.foyt.coops.CoOpsNotImplementedException;
import fi.foyt.coops.CoOpsUsageException;
import fi.foyt.coops.model.File;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/materials/html")
@Stateful
@Produces("application/json")
public class HtmlMaterialRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 5678403648328971273L;

  @Inject
  private Logger logger;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private LocaleController localeController;

  @Inject
  private CoOpsApi coOpsApi;
  
  @Inject
  private SessionController sessionController;
  
  @POST
  @Path("/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createMaterial(HtmlRestMaterial entity) {
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }

    if (StringUtils.isBlank(entity.getContentType())) {
      return Response.status(Status.BAD_REQUEST).entity("contentType is missing").build();
    }
    
    if (StringUtils.isBlank(entity.getTitle())) {
      return Response.status(Status.BAD_REQUEST).entity("title is missing").build();
    }
    
    HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(entity.getTitle(), entity.getHtml(), entity.getContentType(), 0l, entity.getLicense());
    return Response.ok(createRestModel(htmlMaterial)).build();
  }

  @GET
  @Path("/{id}")
  @RESTPermitUnimplemented
  public Response findMaterial(@PathParam("id") Long id, @QueryParam ("revision") Long revision, @Context Request request) {
    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(id);
    if (htmlMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(revision == null ? htmlMaterial.getRevisionNumber() : revision)));
      ResponseBuilder builder = request.evaluatePreconditions(tag);
      if (builder != null) {
        return builder.build();
      }
      
      CacheControl cacheControl = new CacheControl();
      cacheControl.setMustRevalidate(true);
      
      if (revision == null) {
        return Response.ok(createRestModel(htmlMaterial)).build();
      } else {
        File fileRevision;
        try {
          fileRevision = coOpsApi.fileGet(id.toString(), revision);
        } catch (CoOpsNotImplementedException | CoOpsNotFoundException | CoOpsUsageException | CoOpsInternalErrorException | CoOpsForbiddenException e) {
          return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }

        if (fileRevision == null) {
          return Response.status(Status.NOT_FOUND).build();
        }
        
        return Response.ok(createRestModel(htmlMaterial, fileRevision)).build();
      }
    }
  }
  
  @POST
  @Path("/{id}/publish/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response publishMaterial(@PathParam("id") Long id, HtmlRestMaterialPublish entity) {
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }

    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(id);
    if (htmlMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!htmlMaterial.getRevisionNumber().equals(entity.getFromRevision())) {
      return Response.status(Status.CONFLICT)
          .entity(new HtmlRestMaterialPublishError(HtmlRestMaterialPublishError.Reason.CONCURRENT_MODIFICATIONS)).build();
    }

    try {
      File fileRevision = coOpsApi.fileGet(id.toString(), entity.getToRevision());
      if (fileRevision == null) {
        return Response.status(Status.NOT_FOUND).build();
      }
      
      if (Boolean.TRUE.equals(entity.getRemoveAnswers())) {
        logger.log(Level.WARNING, String.format("Publish material %d by user %d with forced answer removal", id, sessionController.getLoggedUserEntity().getId()));
      }
      
      htmlMaterialController.updateHtmlMaterialToRevision(htmlMaterial, fileRevision.getContent(), entity.getToRevision(), false, entity.getRemoveAnswers() != null ? entity.getRemoveAnswers() : false);
    }
    catch (WorkspaceMaterialContainsAnswersExeption e) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.REMOVE_ANSWERS) && workspaceMaterialController.isUsedInPublishedWorkspaces(htmlMaterial)) {
        logger.log(Level.WARNING, String.format("Publish material %d by user %d denied due to material containing answers", id, sessionController.getLoggedUserEntity().getId()));
        return Response.status(Status.FORBIDDEN).entity(localeController.getText(sessionController.getLocale(), "plugin.workspace.management.cannotRemoveAnswers")).build();
      }
      else {
        return Response.status(Status.CONFLICT).entity(new HtmlRestMaterialPublishError(HtmlRestMaterialPublishError.Reason.CONTAINS_ANSWERS)).build();
      }
    }
    catch (CoOpsNotImplementedException | CoOpsNotFoundException | CoOpsUsageException | CoOpsInternalErrorException | CoOpsForbiddenException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    return Response.noContent().build();
  }
  
  @PUT
  @Path("/{id}/revert/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response revertMaterial(@PathParam("id") Long id, HtmlRestMaterialRevert entity) {
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }

    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(id);
    if (htmlMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Long currentRevision = htmlMaterialController.lastHtmlMaterialRevision(htmlMaterial);
    if (!currentRevision.equals(entity.getFromRevision())) {
      return Response.status(Status.CONFLICT)
          .entity(new HtmlRestMaterialPublishError(HtmlRestMaterialPublishError.Reason.CONCURRENT_MODIFICATIONS)).build();
    }

    try {
      File fileRevision = coOpsApi.fileGet(id.toString(), entity.getToRevision());
      if (fileRevision == null) {
        return Response.status(Status.NOT_FOUND).entity("Specified revision could not be found").build(); 
      }

      if (Boolean.TRUE.equals(entity.getRemoveAnswers())) {
        logger.log(Level.WARNING, String.format("Revert material %d by user %d with forced answer removal", id, sessionController.getLoggedUserEntity().getId()));
      }
      
      htmlMaterialController.updateHtmlMaterialToRevision(htmlMaterial, fileRevision.getContent(), entity.getToRevision(), true, entity.getRemoveAnswers() != null ? entity.getRemoveAnswers() : false);
    }
    catch (WorkspaceMaterialContainsAnswersExeption e) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.REMOVE_ANSWERS) && workspaceMaterialController.isUsedInPublishedWorkspaces(htmlMaterial)) {
        logger.log(Level.WARNING, String.format("Revert material %d by user %d denied due to material containing answers", id, sessionController.getLoggedUserEntity().getId()));
        return Response.status(Status.FORBIDDEN).entity(localeController.getText(sessionController.getLocale(), "plugin.workspace.management.cannotRemoveAnswers")).build();
      }
      else {
        return Response.status(Status.CONFLICT).entity(new HtmlRestMaterialPublishError(HtmlRestMaterialPublishError.Reason.CONTAINS_ANSWERS)).build();
      }
    }
    catch (CoOpsNotImplementedException | CoOpsNotFoundException | CoOpsUsageException | CoOpsInternalErrorException | CoOpsForbiddenException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    return Response.noContent().build();
  }

  private HtmlRestMaterial createRestModel(HtmlMaterial htmlMaterial, File fileRevision) {
    return new HtmlRestMaterial(htmlMaterial.getId(), 
      htmlMaterial.getTitle(), 
      htmlMaterial.getContentType(), 
      fileRevision.getContent(), 
      fileRevision.getRevisionNumber(), 
      htmlMaterial.getRevisionNumber(), 
      htmlMaterial.getLicense(),
      htmlMaterial.getViewRestrict());
  }
  
  private HtmlRestMaterial createRestModel(HtmlMaterial htmlMaterial) {
    Long currentRevision = htmlMaterialController.lastHtmlMaterialRevision(htmlMaterial);
    
    return new HtmlRestMaterial(htmlMaterial.getId(),
      htmlMaterial.getTitle(),
      htmlMaterial.getContentType(),
      htmlMaterial.getHtml(),
      currentRevision,
      htmlMaterial.getRevisionNumber(),
      htmlMaterial.getLicense(),
      htmlMaterial.getViewRestrict());
  }
  
}

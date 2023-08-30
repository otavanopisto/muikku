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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

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
    
    HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(entity.getTitle(), entity.getHtml(), entity.getContentType(), entity.getLicense());
    return Response.ok(createRestModel(htmlMaterial)).build();
  }

  @GET
  @Path("/{id}")
  @RESTPermitUnimplemented
  public Response findMaterial(@PathParam("id") Long id, @Context Request request) {
    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(id);
    return htmlMaterial == null ? Response.status(Status.NOT_FOUND).build() : Response.ok(createRestModel(htmlMaterial)).build();  
  }

  @PUT
  @Path("/{id}/content")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateMaterialContent(@PathParam("id") Long id, HtmlRestMaterialContent entity) {
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }

    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(id);
    if (htmlMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (entity.getRemoveAnswers()) {
      logger.log(Level.WARNING, String.format("Update material %d by user %d with forced answer removal", id, sessionController.getLoggedUserEntity().getId()));
    }
    
    try {
      
      // #6638: When remove answers flag is on, refuse update for non-admins if material is published or has student answers
      
      if (entity.getRemoveAnswers() && !sessionController.hasEnvironmentPermission(MuikkuPermissions.REMOVE_ANSWERS)) {
        if (workspaceMaterialController.isUsedInPublishedWorkspaces(htmlMaterial) || htmlMaterialController.hasStudentAnswers(htmlMaterial)) {
          logger.log(Level.WARNING, String.format("Update material %d by user %d denied due to material containing student answers", id, sessionController.getLoggedUserEntity().getId()));
          return Response.status(Status.FORBIDDEN).entity(localeController.getText(sessionController.getLocale(), "plugin.workspace.management.cannotRemoveAnswers")).build();
        }
      }
      
      // Actual update
      
      htmlMaterial = htmlMaterialController.updateHtmlMaterialHtml(htmlMaterial, entity.getContent(), entity.getRemoveAnswers());
    }
    catch (WorkspaceMaterialContainsAnswersExeption e) {
      
      // #6638: When remove answers flag is off, either refuse update for non-admins dealing with materials in published workspaces, or notify frontend of the conflict
      
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.REMOVE_ANSWERS) && workspaceMaterialController.isUsedInPublishedWorkspaces(htmlMaterial)) {
        logger.log(Level.WARNING, String.format("Update material %d by user %d denied due to material containing answers", id, sessionController.getLoggedUserEntity().getId()));
        return Response.status(Status.FORBIDDEN).entity(localeController.getText(sessionController.getLocale(), "plugin.workspace.management.cannotRemoveAnswers")).build();
      }
      else {
        return Response.status(Status.CONFLICT).entity(new HtmlRestMaterialPublishError(HtmlRestMaterialPublishError.Reason.CONTAINS_ANSWERS)).build();
      }
    }
    catch (Exception e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    return Response.ok(createRestModel(htmlMaterial)).build();
  }

  private HtmlRestMaterial createRestModel(HtmlMaterial htmlMaterial) {
    return new HtmlRestMaterial(htmlMaterial.getId(),
      htmlMaterial.getTitle(),
      htmlMaterial.getContentType(),
      htmlMaterial.getHtml(),
      htmlMaterial.getLicense(),
      htmlMaterial.getViewRestrict());
  }
  
}

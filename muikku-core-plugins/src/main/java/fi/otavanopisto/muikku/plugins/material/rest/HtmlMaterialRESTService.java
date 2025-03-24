package fi.otavanopisto.muikku.plugins.material.rest;

import java.util.List;
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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.dao.FaultyMaterialDAO;
import fi.otavanopisto.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.otavanopisto.muikku.plugins.material.model.FaultyMaterial;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialContainsAnswersExeption;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;
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
  private HtmlMaterialDAO htmlMaterialDAO;

  @Inject
  private FaultyMaterialDAO faultyMaterialDAO;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;

  @Inject
  private WorkspaceRootFolderDAO workspaceRootFolderDAO;
  
  @Inject
  private WorkspaceMaterialDAO workspaceMaterialDAO;

  @Inject
  private WorkspaceNodeDAO workspaceNodeDAO;

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
  
  @GET
  @Path("/deleteFaultyMaterial/{ID}")
  @Produces("text/html")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteFaultyMaterial(@PathParam("ID") Long id) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    FaultyMaterial faultyMaterial = faultyMaterialDAO.findById(id);
    if (faultyMaterial != null) {
      faultyMaterialDAO.delete(faultyMaterial);
    }
    return Response.noContent().build();
  }

  @GET
  @Path("/fixFaultyMaterials")
  @Produces("text/html")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response fixFaultyMaterials(@QueryParam("from") Long fromId, @QueryParam("count") Integer count) {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    long totalDocuments = faultyMaterialDAO.count();
    int documentCount = count == null ? 10 : count;
    StringBuffer response = new StringBuffer();
    response.append(String.format("<p>%d faulty documents</p><hr/>", totalDocuments));

    List<FaultyMaterial> faultyMaterials = faultyMaterialDAO.list(fromId, documentCount);
    for (FaultyMaterial faultyMaterial : faultyMaterials) {
      response.append(String.format("<p>Html material %d (<a href=\"/rest/materials/html/deleteFaultyMaterial/%d\" target=\"_blank\">Dismiss</a>)</p>",
          faultyMaterial.getId(),
          faultyMaterial.getId()));

      HtmlMaterial htmlMaterial = htmlMaterialDAO.findById(faultyMaterial.getId());
      if (htmlMaterial == null) {
        response.append("<p>Html material not found</p><hr/>");
        continue;
      }
      String html = htmlMaterial.getHtml();
      boolean changesMade = false;
      boolean everythingsFine = true;
      boolean workspacesPrinted = false;
      List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialDAO.listByMaterialId(htmlMaterial.getId());
      if (workspaceMaterials.isEmpty()) {
        response.append("<p><b><font color=\"green\">Html material not used in any workspace</font></b></p><hr/>");
        faultyMaterialDAO.delete(faultyMaterial);
        continue;
      }
      int failsafe = 0;
      while (everythingsFine) {
        
        failsafe++;
        if (failsafe >= 100) {
          everythingsFine = false;
          response.append("<p>While loop failsafe triggered</p>");
          break; // out of the while loop
        }
        
        if (!workspacesPrinted) {
          for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
            String materialTitle = workspaceMaterial.getTitle();
            WorkspaceNode rootNode = workspaceMaterial;
            int failsafe2 = 0;
            while (rootNode.getParent() != null) {
              failsafe2++;
              if (failsafe2 >= 10) {
                everythingsFine = false;
                response.append(String.format("<p>Root folder while loop failsafe triggered for workspace material %d</p>", workspaceMaterial.getId()));
              }
              rootNode = rootNode.getParent();
            }
            WorkspaceRootFolder rootFolder = workspaceRootFolderDAO.findById(rootNode.getId());
            if (rootFolder == null) {
              response.append(String.format("<p>Workspace root folder not found for workspace material %d</p>", workspaceMaterial.getId()));
              everythingsFine = false;
              break; // out of the for loop
            }
            WorkspaceEntity workspaceEntity = workspaceEntityDAO.findById(rootFolder.getWorkspaceEntityId());
            if (workspaceEntity == null) {
              response.append(String.format("<p>Workspace entity not found for workspace material %d</p>", workspaceMaterial.getId()));
              everythingsFine = false;
              break; // out of the for loop
            }
            String workspacePath = String.format("/workspace/%s/materials#p-%d", workspaceEntity.getUrlName(), workspaceMaterial.getId());
            WorkspaceEntityName workspaceName = workspaceEntityController.getName(workspaceEntity);
            response.append(String.format("<p>Workspace material %d <a href=\"%s\" target=\"_blank\">%s</a> (%s)</p>", workspaceMaterial.getId(), workspacePath, workspaceName.getDisplayName(), materialTitle));
          }
          workspacesPrinted = true;
        }
        if (!everythingsFine) {
          break; // out of the while loop
        }
        
        // Start going through the faulty stuff
        
        int linkIndex = html.indexOf("src=\"/workspace/");
        if (linkIndex == -1) {
          linkIndex = html.indexOf("href=\"/workspace/");
        }
        if (linkIndex == -1) {
          // No more faulty links found \o/
          break; // out of the while loop
        }
        int linkStart = html.indexOf("\"", linkIndex) + 1; // src="/workspace/ or href="/workspace/ -> the first /
        int linkEnd = html.indexOf("\"", linkStart); // hopefully the " ending the attribute
        if (linkEnd <= linkStart) {
          response.append("<p>Failed to parse faulty link</p>");
          everythingsFine = false;
          break; // out of the while loop
        }
        String faultyLink = html.substring(linkStart, linkEnd); // now we perhaps have something like /workspace/workspace-name/materials/folder-name/page-name/attachment.jpg
        response.append(String.format("<p>Faulty link %s</p>", StringUtils.substring(html, linkIndex, linkEnd + 1)));
        String attachmentName = StringUtils.substringAfterLast(faultyLink, "/"); // attachment.jpg
        if (StringUtils.contains(attachmentName, "?")) {
          attachmentName = StringUtils.substringBefore(attachmentName, "?"); // get rid of query parameters
        }
        
        // Let's check every workspace material that uses this html and make sure they have the attachment
        
        for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
          WorkspaceNode attachmentNode = workspaceNodeDAO.findByParentAndUrlName(workspaceMaterial, attachmentName);
          if (attachmentNode == null) {
            response.append(String.format("<p>Workspace material %d has no attachment %s</p>", workspaceMaterial.getId(), attachmentName));
            everythingsFine = false;
            break; // out of the for loop
          }
        }
        if (!everythingsFine) {
          break; // out of the while loop
        }
        // All workspace materials have the attachment, so the link can be changed
        html = StringUtils.replace(html, faultyLink, attachmentName);
        changesMade = true;
      }
      if (everythingsFine && changesMade) {
        htmlMaterialDAO.updateData(htmlMaterial, html);
        faultyMaterialDAO.delete(faultyMaterial);
        response.append("<p><b><font color=\"green\">Fixed</font></b></p>");
      }
      else if (!everythingsFine) {
        response.append("<p><b><font color=\"red\">Fix manually or dismiss</font></b></p>");
      }
      response.append("<hr/>");
    }
    if (!faultyMaterials.isEmpty()) {
      response.append(String.format("<p><a href=\"/rest/materials/html/fixFaultyMaterials?from=%d\">Next batch</a></p>", faultyMaterials.get(faultyMaterials.size() - 1).getId()));
    }

    return Response.ok(response.toString()).build();  
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

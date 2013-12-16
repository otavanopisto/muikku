package fi.muikku.plugins.dnm;

import javax.faces.context.FacesContext;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.dnm.parser.content.DeusNexEmbeddedItemElementHandler;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocument;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocumentUtils;
import fi.muikku.plugins.dnm.parser.structure.model.Binary;
import fi.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.workspace.WorkspaceMaterialUtils;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

class EmbeddedItemHandler implements DeusNexEmbeddedItemElementHandler {
	
	/**
   * 
   */
  private final DeusNexMachinaController deusNexMachinaController;
  public EmbeddedItemHandler(DeusNexMachinaController deusNexMachinaController, WorkspaceRootFolder rootFolder, DeusNexDocument deusNexDocument) {
		this.deusNexMachinaController = deusNexMachinaController;
    this.rootFolder = rootFolder;
		this.deusNexDocument = deusNexDocument;
	}
	
	@Override
	public Node handleEmbeddedDocument(org.w3c.dom.Document ownerDocument, String title, Integer queryType, Integer resourceNo, Integer embeddedResourceNo) {
		// TODO: This is just for show, real implementation depends on HtmlMaterial implementation
		
		String relativePath = getResourcePath(resourceNo);
		if (relativePath != null) {
			Element iframeElement = ownerDocument.createElement("iframe");
			iframeElement.setAttribute("src", relativePath);
			iframeElement.setAttribute("title", title);
			iframeElement.setAttribute("seamless", "seamless");
			iframeElement.setAttribute("border", "0");
			iframeElement.setAttribute("frameborder", "0");
			iframeElement.setAttribute("width", "100%");
			iframeElement.setTextContent("Browser does not support iframes");
			return iframeElement;
		} else {
			System.out.println("Warning: Embedded document " + resourceNo + " could not be found.");
		}
		
		return null;
	}

	@Override
	public Node handleEmbeddedImage(org.w3c.dom.Document ownerDocument, String title, String alt, Integer width, Integer height, Integer hspace, String align, Integer resourceNo) {
		String relativePath = getResourcePath(resourceNo);
		if (relativePath != null) {
			Element imgElement = ownerDocument.createElement("img");
			imgElement.setAttribute("src", relativePath);
			imgElement.setAttribute("title", title);
			imgElement.setAttribute("alt", alt);
			imgElement.setAttribute("width", String.valueOf(width));
			imgElement.setAttribute("height", String.valueOf(height));
			imgElement.setAttribute("hspace", String.valueOf(hspace));
			imgElement.setAttribute("align", align);
			return imgElement;
		} else {
			System.out.println("Warning: Embedded image " + resourceNo + " could not be found.");
		}

		return null;
	}
	
	@Override
	public Node handleEmbeddedAudio(org.w3c.dom.Document ownerDocument, Integer resourceNo, Boolean showAsLink, String fileName, String linkText, Boolean autoStart, Boolean loop) {
		String path = getResourcePath(resourceNo);
		if (path != null) {
			Element audioElement = ownerDocument.createElement("audio");
			
			String contentType = getResorceContentType(resourceNo);
			if (StringUtils.isNotBlank(contentType)) {
  			Element sourceElement = ownerDocument.createElement("source");
  			sourceElement.setAttribute("src", path + "?embed=true");
  			sourceElement.setAttribute("type", contentType);
			} else {
				System.out.println("Warning: Embedded audio " + resourceNo + " content type could not be resolved.");
			}
			
			if (autoStart) {
			  audioElement.setAttribute("autoplay", "autoplay");
			}

			if (loop) {
			  audioElement.setAttribute("loop", "loop");
			}

			return audioElement;
		} else {
			System.out.println("Warning: Embedded audio " + resourceNo + " could not be found.");
		}

		return null;
	}
	
	@Override
	public Node handleEmbeddedHyperlink(Document ownerDocument, Integer resourceNo, String target, String fileName, String linkText) {
	  String path = getResourcePath(resourceNo);
    if (path != null) {
      Element hyperLinkElement = ownerDocument.createElement("a");
      hyperLinkElement.setAttribute("href", path);
      if (StringUtils.isNotBlank(target)) {
        hyperLinkElement.setAttribute("target", target);
      }
      
      hyperLinkElement.setTextContent(linkText);
      
      return hyperLinkElement;
    } else {
      System.out.println("Warning: Embedded hyperlink " + resourceNo + " could not be found.");
    }

    return null;
	}
	
	private String getResourcePath(Integer resourceNo) {
		String contextPath = FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath();
		String path = null;
		String type = null;
		
		Resource resource = deusNexDocument.getResourceByNo(resourceNo);
		if (resource != null) {
			path = contextPath + WorkspaceMaterialUtils.getCompletePath(rootFolder) + "/materials/" + DeusNexDocumentUtils.getRelativePath(deusNexDocument, resource, deusNexDocument.getRootFolder()); 
			type = "DND";
		} else {
			Long workspaceNodeId = this.deusNexMachinaController.getResourceWorkspaceNodeId(resourceNo);
			if (workspaceNodeId != null) {
				// Resource has been imported before
				WorkspaceMaterial workspaceMaterial = this.deusNexMachinaController.workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
				if (workspaceMaterial != null) {
					path = contextPath + WorkspaceMaterialUtils.getCompletePath(workspaceMaterial);
	  			type = "POOL";
				} 
			}
		}
		
		if (path != null) {
			path += "?embed=true&on=" + resourceNo + "&rt=" + type;
		}
		
		return path;
	}
	
	private String getResorceContentType(Integer resourceNo) {
		Resource resource = deusNexDocument.getResourceByNo(resourceNo);
		if (resource != null) {
			if (resource instanceof Binary) {
				return ((Binary) resource).getContentType();
			}
		}
		
		Long workspaceNodeId = this.deusNexMachinaController.getResourceWorkspaceNodeId(resourceNo);
		if (workspaceNodeId != null) {
			WorkspaceMaterial workspaceMaterial = this.deusNexMachinaController.workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
			if (workspaceMaterial != null) {
				if (workspaceMaterial.getMaterial() instanceof BinaryMaterial) {
					return ((BinaryMaterial) workspaceMaterial.getMaterial()).getContentType();
				}
			}
		}
		
		return null;
	}

	private WorkspaceRootFolder rootFolder;
	private DeusNexDocument deusNexDocument;

}
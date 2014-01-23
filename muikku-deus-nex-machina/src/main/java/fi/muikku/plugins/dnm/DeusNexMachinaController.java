package fi.muikku.plugins.dnm;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.plugins.dnm.parser.DeusNexInternalException;
import fi.muikku.plugins.dnm.parser.content.DeusNexContentParser;
import fi.muikku.plugins.dnm.parser.content.DeusNexEmbeddedItemElementHandler;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocument;
import fi.muikku.plugins.dnm.parser.structure.DeusNexDocumentUtils;
import fi.muikku.plugins.dnm.parser.structure.DeusNexStructureParser;
import fi.muikku.plugins.dnm.parser.structure.model.Binary;
import fi.muikku.plugins.dnm.parser.structure.model.Document;
import fi.muikku.plugins.dnm.parser.structure.model.Folder;
import fi.muikku.plugins.dnm.parser.structure.model.Query;
import fi.muikku.plugins.dnm.parser.structure.model.Resource;
import fi.muikku.plugins.dnm.parser.structure.model.ResourceContainer;
import fi.muikku.plugins.dnm.parser.structure.model.Type;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.WorkspaceMaterialUtils;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

@ApplicationScoped
@Stateful
public class DeusNexMachinaController {

  @Inject 
  private Logger logger;
  
  private class EmbeddedItemHandler implements DeusNexEmbeddedItemElementHandler {
  	
    public EmbeddedItemHandler(DeusNexMachinaController deusNexMachinaController, WorkspaceRootFolder rootFolder, DeusNexDocument deusNexDocument) {
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
  		  logger.warning("Embedded document " + resourceNo + " could not be found.");
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
  		  logger.warning("Embedded image " + resourceNo + " could not be found.");
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
  			  logger.warning("Embedded audio " + resourceNo + " content type could not be resolved.");
  			}
  			
  			if (autoStart) {
  			  audioElement.setAttribute("autoplay", "autoplay");
  			}
  
  			if (loop) {
  			  audioElement.setAttribute("loop", "loop");
  			}
  
  			return audioElement;
  		} else {
  		  logger.warning("Embedded audio " + resourceNo + " could not be found.");
  		}
  
  		return null;
  	}
  	
  	@Override
  	public Node handleEmbeddedHyperlink(org.w3c.dom.Document ownerDocument, Integer resourceNo, String target, String fileName, String linkText) {
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
        logger.warning("Embedded hyperlink " + resourceNo + " could not be found.");
      }
  
      return null;
  	}
  	
  	private String getResourcePath(Integer resourceNo) {
  		String contextPath = FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath();
  		String path = null;
  		String type = null;
  		
  		Long workspaceNodeId = getResourceWorkspaceNodeId(resourceNo);
  		if (workspaceNodeId != null) {
  		  // Resource has been imported before
  		  WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
  		  if (workspaceMaterial != null) {
  		    path = contextPath + WorkspaceMaterialUtils.getCompletePath(workspaceMaterial);
  		    type = "POOL";
  		  } 
  		} else {
  		  Resource resource = deusNexDocument.getResourceByNo(resourceNo);
  		  if (resource != null) {
  		    path = contextPath + WorkspaceMaterialUtils.getCompletePath(rootFolder) + "/materials/" + DeusNexDocumentUtils.getRelativePath(deusNexDocument, resource, deusNexDocument.getRootFolder());
  		    type = "DND";
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
  		
  		Long workspaceNodeId = getResourceWorkspaceNodeId(resourceNo);
  		if (workspaceNodeId != null) {
  		  // TODO: This reference is a bit strange
  			WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceNodeId);
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

	
	private final static String LOOKUP_MATERIAL_URLNAME = "[_DEUS_NEX_MACHINA_LOOKUP_]";
	
	@Inject
	private HtmlMaterialController htmlMaterialController; 
	
	@Inject
	private BinaryMaterialController binaryMaterialController;

	@Inject 
	WorkspaceMaterialController workspaceMaterialController;
	
	@PostConstruct
	public void init() throws IOException {
		deusNexStructureParser = new DeusNexStructureParser();
		loadLookup();
	}

	public DeusNexDocument parseDeusNexDocument(InputStream inputStream) throws DeusNexException {
		return deusNexStructureParser.parseDocument(inputStream);
	}
	
	public void importDeusNexDocument(WorkspaceNode parentNode, InputStream inputStream) throws DeusNexException {
		DeusNexDocument desNexDocument = parseDeusNexDocument(inputStream);
		WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(parentNode);

		for (Resource resource : desNexDocument.getRootFolder().getResources()) {
		  importResource(rootFolder, parentNode, resource, desNexDocument);
		}
	}
	
	private void importResource(WorkspaceRootFolder rootFolder, WorkspaceNode parent, Resource resource, DeusNexDocument deusNexDocument) throws DeusNexException {
	  WorkspaceNode node = findNode(parent, resource);
		
		if (resource.getType() == Type.FOLDER) {
			Folder folderResource = (Folder) resource;
			WorkspaceFolder folder = null;
			if (node instanceof WorkspaceFolder) {
				folder = (WorkspaceFolder) node;
			}
			
			if (folder == null) {
				folder = createFolder(parent, folderResource);
				try {
					setResourceWorkspaceNodeId(resource.getNo(), folder.getId());
				} catch (IOException e) {
					throw new DeusNexInternalException("Failed to store resourceNo lookup file", e);
				}
			}
			
			for (Resource childResource : folderResource.getResources()) {
				importResource(rootFolder, folder, childResource, deusNexDocument);
			}
		} else {
			if (node == null) {
			  logger.fine("importting " + resource.getPath());
			  
    		Material material = createMaterial(rootFolder, resource, deusNexDocument);
    		if (material != null) {
    			WorkspaceNode workspaceNode = workspaceMaterialController.createWorkspaceMaterial(parent, material, material.getUrlName());
    			
    			try {
  					setResourceWorkspaceNodeId(resource.getNo(), workspaceNode.getId());
  				} catch (IOException e) {
  					throw new DeusNexInternalException("Failed to store resourceNo lookup file", e);
  				}
    			
    			if (resource instanceof ResourceContainer) {
      			for (Resource childResource : ((ResourceContainer) resource).getResources()) {
      				importResource(rootFolder, workspaceNode, childResource, deusNexDocument);
      			}
      		}
    		}
			} else {
			  logger.info(node.getPath() + " already exists, skipping");
			}
		}
	}

	private Material createMaterial(WorkspaceRootFolder rootFolder, Resource resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		switch (resource.getType()) {
			case BINARY:
				return createBinaryMaterial((Binary) resource);
			case DOCUMENT:
				return createDocumentMaterial(rootFolder, (Document) resource, deusNexDocument);
			case QUERY:
				return createQueryMaterial(rootFolder, (Query) resource, deusNexDocument);
			default:
			break;
		}
		
		return null;
	}

	private Material createDocumentMaterial(WorkspaceRootFolder rootFolder, Document resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		String title = resource.getTitle();
		String urlName = resource.getName();
		String html = parseDocumentContent(rootFolder, resource.getDocument(), deusNexDocument);
		
		return htmlMaterialController.createHtmlMaterial(urlName, title, html);
	}

	private Material createQueryMaterial(WorkspaceRootFolder rootFolder, Query resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		// TODO: Replace with query implementation when the implementation itself is ready for it
		
		String title = resource.getTitle();
		String urlName = resource.getName();
		String html = parseQueryContent(rootFolder, resource.getDocument(), deusNexDocument);
		
		return htmlMaterialController.createHtmlMaterial(urlName, title, html);
	}

	private BinaryMaterial createBinaryMaterial(Binary resource) {
		String title = resource.getTitle();
		String urlName = resource.getName();
		String contentType = resource.getContentType();
		byte[] content = resource.getContent();

		return binaryMaterialController.createBinaryMaterial(title, urlName, contentType, content);
	}
	
	private String parseDocumentContent(WorkspaceRootFolder rootFolder, Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
		Map<String, String> localeContents = new DeusNexContentParser()
		  .setEmbeddedItemElementHandler(new EmbeddedItemHandler(this, rootFolder, deusNexDocument))
		  .parseContent(document);
		String contentFi = localeContents.get("fi");
		return contentFi;
	}
	
	private String parseQueryContent(WorkspaceRootFolder rootFolder, Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
		Map<String, String> localeContents = new DeusNexContentParser()
		  .setEmbeddedItemElementHandler(new EmbeddedItemHandler(this, rootFolder, deusNexDocument))
		  .setFieldElementHandler(new FieldElementsHandler(deusNexDocument))
		  .parseContent(document);
		String contentFi = localeContents.get("fi");
		return contentFi;
	}

	private WorkspaceFolder createFolder(WorkspaceNode parent, Folder resource) {
		return workspaceMaterialController.createWorkspaceFolder(parent, resource.getTitle(), resource.getName());
	}
	
	private WorkspaceNode findNode(WorkspaceNode parent, Resource resource) {
		return workspaceMaterialController.findWorkspaceNodeByParentAndUrlName(parent, resource.getName());
	}
	
	private void setResourceWorkspaceNodeId(Integer resourceNo, Long workspaceNodeId) throws IOException {
		lookupProperties.put(String.valueOf(resourceNo), String.valueOf(workspaceNodeId));
		storeLookup();
	}
	
	Long getResourceWorkspaceNodeId(Integer resourceNo) {
		return NumberUtils.createLong(lookupProperties.getProperty(String.valueOf(resourceNo)));
	}
	
	private void loadLookup() throws IOException {
		lookupProperties = new Properties();

		BinaryMaterial lookupMaterial = binaryMaterialController.findBinaryMaterialdByUrlName(LOOKUP_MATERIAL_URLNAME);
		if (lookupMaterial != null) {
			InputStream lookupStream = new ByteArrayInputStream(lookupMaterial.getContent());
			lookupProperties.load(lookupStream);
			lookupStream.close();
		}
	}
	
	private void storeLookup() throws IOException {
		ByteArrayOutputStream lookupStream = new ByteArrayOutputStream();
		lookupProperties.store(lookupStream, null);
		lookupStream.close();
		
		BinaryMaterial lookupMaterial = binaryMaterialController.findBinaryMaterialdByUrlName(LOOKUP_MATERIAL_URLNAME);
		if (lookupMaterial == null) {
			binaryMaterialController.createBinaryMaterial(LOOKUP_MATERIAL_URLNAME, LOOKUP_MATERIAL_URLNAME, "text/x-java-properties", lookupStream.toByteArray());
		} else {
			binaryMaterialController.updateBinaryMaterialContent(lookupMaterial, lookupStream.toByteArray());
		}
	}

	private DeusNexStructureParser deusNexStructureParser;
	private Properties lookupProperties;
}

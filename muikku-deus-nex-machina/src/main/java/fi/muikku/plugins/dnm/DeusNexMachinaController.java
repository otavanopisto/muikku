package fi.muikku.plugins.dnm;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.parser.DeusNexException;
import fi.muikku.plugins.dnm.parser.content.ConnectFieldOption;
import fi.muikku.plugins.dnm.parser.content.DeusNexContentParser;
import fi.muikku.plugins.dnm.parser.content.DeusNexEmbeddedItemElementHandler;
import fi.muikku.plugins.dnm.parser.content.DeusNexFieldElementHandler;
import fi.muikku.plugins.dnm.parser.content.OptionListOption;
import fi.muikku.plugins.dnm.parser.content.RightAnswer;
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
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

@Dependent
@Stateful
public class DeusNexMachinaController {
	
	@Inject
	private HtmlMaterialController htmlMaterialController; 
	
	@Inject
	private BinaryMaterialController binaryMaterialController;

	@Inject
	private WorkspaceMaterialController workspaceMaterialController;
	
	@PostConstruct
	public void init() {
		deusNexStructureParser = new DeusNexStructureParser();
	}
	
	public DeusNexDocument parseDeusNexDocument(InputStream inputStream) throws DeusNexException {
		return deusNexStructureParser.parseDocument(inputStream);
	}
	
	public void importDeusNexDocument(WorkspaceEntity workspaceEntity, InputStream inputStream) throws DeusNexException {
		DeusNexDocument desNexDocument = parseDeusNexDocument(inputStream);
		WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);

		for (Resource resource : desNexDocument.getRootFolder().getResources()) {
		  importResource(rootFolder, resource, desNexDocument);
		}
	}
	
	private void importResource(WorkspaceNode parent, Resource resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		if (resource.getType() == Type.FOLDER) {
			Folder folderResource = (Folder) resource;
			
			WorkspaceFolder folder = (WorkspaceFolder) findNode(parent, folderResource);
			if (folder == null) {
				folder = createFolder(parent, folderResource);
			}
			
			for (Resource childResource : folderResource.getResources()) {
				importResource(folder, childResource, deusNexDocument);
			}
		} else {
  		Material material = createMaterial(resource, deusNexDocument);
  		if (material != null) {
  			WorkspaceNode workspaceNode = workspaceMaterialController.createWorkspaceMaterial(parent, material, material.getUrlName());
  			
  			if (resource instanceof ResourceContainer) {
    			for (Resource childResource : ((ResourceContainer) resource).getResources()) {
    				importResource(workspaceNode, childResource, deusNexDocument);
    			}
    		}
  		}
		}
	}

	private Material createMaterial(Resource resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		switch (resource.getType()) {
			case BINARY:
				return createBinaryMaterial((Binary) resource);
			case DOCUMENT:
				return createDocumentMaterial((Document) resource, deusNexDocument);
			case QUERY:
				return createQueryMaterial((Query) resource, deusNexDocument);
			default:
			break;
		}
		
		return null;
	}

	private Material createDocumentMaterial(Document resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		String title = resource.getTitle();
		String urlName = resource.getName();
		String html = parseDocumentContent(resource.getDocument(), deusNexDocument);
		
		return htmlMaterialController.createHtmlMaterial(urlName, title, html);
	}

	private Material createQueryMaterial(Query resource, DeusNexDocument deusNexDocument) throws DeusNexException {
		// TODO: Replace with query implementation when the implementation itself is ready for it
		
		String title = resource.getTitle();
		String urlName = resource.getName();
		String html = parseQueryContent(resource.getDocument(), deusNexDocument);
		
		return htmlMaterialController.createHtmlMaterial(urlName, title, html);
	}

	private BinaryMaterial createBinaryMaterial(Binary resource) {
		String title = resource.getTitle();
		String urlName = resource.getName();
		String contentType = resource.getContentType();
		byte[] content = resource.getContent();

		return binaryMaterialController.createBinaryMaterial(title, urlName, contentType, content);
	}
	
	private String parseDocumentContent(Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
		Map<String, String> localeContents = new DeusNexContentParser()
		  .setEmbeddedItemElementHandler(new EmbeddedItemHandler(deusNexDocument))
		  .parseContent(document);
		String contentFi = localeContents.get("fi");
		return contentFi;
	}
	
	private String parseQueryContent(Element document, DeusNexDocument deusNexDocument) throws DeusNexException {
		Map<String, String> localeContents = new DeusNexContentParser()
		  .setEmbeddedItemElementHandler(new EmbeddedItemHandler(deusNexDocument))
		  .setFieldElementHandler(new FieldElementsHandler(deusNexDocument))
		  .parseContent(document);
		String contentFi = localeContents.get("fi");
		return contentFi;
	}

	private WorkspaceFolder createFolder(WorkspaceNode parent, Folder resource) {
		return workspaceMaterialController.createWorkspaceFolder(parent, resource.getName());
	}
	
	private WorkspaceNode findNode(WorkspaceNode parent, Folder folderResource) {
		return workspaceMaterialController.findWorkspaceNodeByParentAndUrlName(parent, folderResource.getName());
	}

	private DeusNexStructureParser deusNexStructureParser;
	
	private class FieldElementsHandler implements DeusNexFieldElementHandler {
		
		public FieldElementsHandler(DeusNexDocument deusNexDocument) {
			this.deusNexDocument = deusNexDocument;
		}
		
		@Override
		public Node handleTextField(org.w3c.dom.Document ownerDocument, String paramName, Integer columns, List<RightAnswer> rightAnswers) {
			// TODO: This is just for show, real implementation depends on QueryMaterial implementation

			Element inputElement = ownerDocument.createElement("input");
			inputElement.setAttribute("type", "text");
			inputElement.setAttribute("name", paramName);
			inputElement.setAttribute("size", String.valueOf(columns));
			
			return inputElement;
		}
		
		@Override
		public Node handleOptionList(org.w3c.dom.Document ownerDocument, String paramName, String type, List<OptionListOption> options) {
			// TODO: This is just for show, real implementation depends on QueryMaterial implementation

			Element selectElement = ownerDocument.createElement("select");
			selectElement.setAttribute("name", paramName);
			
			for (OptionListOption option : options) {
				Element optionElement = ownerDocument.createElement("option");
				optionElement.setAttribute("value", option.getName());
				optionElement.setTextContent(option.getText());
				selectElement.appendChild(optionElement);
			}
			
			return selectElement;
		}
		
		@Override
		public Node handleConnectField(org.w3c.dom.Document ownerDocument, String paramName, List<ConnectFieldOption> options) {
			return null;
		}
		
		@SuppressWarnings("unused")
		private DeusNexDocument deusNexDocument;
	}
	
	private class EmbeddedItemHandler implements DeusNexEmbeddedItemElementHandler {
		
		public EmbeddedItemHandler(DeusNexDocument deusNexDocument) {
			this.deusNexDocument = deusNexDocument;
		}
		
		@Override
		public Node handleEmbeddedDocument(org.w3c.dom.Document ownerDocument, String title, Integer queryType, Integer resourceNo, Integer embeddedResourceNo) {
			// TODO: iframe can not be the final solution for this.
			Resource resource = deusNexDocument.getResourceByNo(resourceNo);
			if (resource != null) {
				Resource parentResource = deusNexDocument.getAncestorByType(resource, Type.FOLDER);
  			String relativePath = parentResource != null ? DeusNexDocumentUtils.getRelativePath(deusNexDocument, resource, parentResource) : resource.getName();
  			
  			Element iframeElement = ownerDocument.createElement("iframe");
  			
  			iframeElement.setAttribute("src", relativePath + "?embed=true");
  			iframeElement.setAttribute("title", title);
  			iframeElement.setAttribute("seamless", "seamless");
  			iframeElement.setAttribute("border", "0");
  			iframeElement.setAttribute("frameborder", "0");
  			iframeElement.setAttribute("width", "100%");
  			return iframeElement;
			}
			
			return null;
		}

		@Override
		public Node handleEmbeddedImage(org.w3c.dom.Document ownerDocument, String title, String alt, Integer width, Integer height, Integer hspace, String align, Integer resourceno) {
			Element imgElement = ownerDocument.createElement("img");
			Resource resource = deusNexDocument.getResourceByNo(resourceno);
			if (resource != null) {
				Resource parentResource = deusNexDocument.getAncestorByType(resource, Type.FOLDER);
  			String relativePath = parentResource != null ? DeusNexDocumentUtils.getRelativePath(deusNexDocument, resource, parentResource) : resource.getName();
  			imgElement.setAttribute("src", relativePath + "?embed=true");
  			imgElement.setAttribute("title", title);
  			imgElement.setAttribute("alt", alt);
  			imgElement.setAttribute("width", String.valueOf(width));
  			imgElement.setAttribute("height", String.valueOf(height));
  			imgElement.setAttribute("hspace", String.valueOf(hspace));
  			imgElement.setAttribute("align", align);
  			return imgElement;
			}
			
			return null;
		}
		
		@Override
		public Node handleEmbeddedAudio(org.w3c.dom.Document ownerDocument, Integer resourceNo, Boolean showAsLink, String fileName, String linkText, Boolean autoStart, Boolean loop) {
			return null;
		}
		
		private DeusNexDocument deusNexDocument;
	}
}

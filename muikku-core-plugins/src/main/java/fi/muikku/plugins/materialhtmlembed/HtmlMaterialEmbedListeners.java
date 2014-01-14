package fi.muikku.plugins.materialhtmlembed;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.processing.HtmlMaterialBeforeSerializeContext;
import fi.muikku.plugins.material.processing.HtmlMaterialProcessingContext;
import fi.muikku.plugins.material.processing.MaterialProcessorAdapter;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.servlet.ContextPath;

@RequestScoped
public class HtmlMaterialEmbedListeners extends MaterialProcessorAdapter {
  
private static final boolean ADD_DEBUG_MARKERS = false;
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;
   
  @Inject 
  @ContextPath
  private String contextPath;
  
  @PostConstruct
  public void init() {
  }
  
  public void processMaterial(HtmlMaterialProcessingContext event) {
    Document document = event.getDocument();
    String fieldPrefix = event.getFieldPrefix();

    NodeList iframes = document.getElementsByTagName("iframe");
    for (int i = iframes.getLength() - 1; i >= 0; i--) {
      Node iframeNode = iframes.item(i);
      if (iframeNode instanceof Element) {
        Element iframeElement = (Element) iframeNode;
        String src = iframeElement.getAttribute("src");
        if (StringUtils.isNotBlank(src)) {
          int queryIndex = src.lastIndexOf('?');
          String[] pathEntries = StringUtils.removeStart(queryIndex > -1 ? src.substring(0, queryIndex) : src, contextPath + "/workspace/").split("/", 3);
          if (pathEntries.length > 2) {
            String workspaceUrlName = pathEntries[0];
            String materialPath = pathEntries[2];
            
            WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
            if (workspaceEntity != null) {
              WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialByWorkspaceEntityAndPath(workspaceEntity, materialPath);
              if (workspaceMaterial != null) {
                if (workspaceMaterial.getMaterial() instanceof HtmlMaterial) {
                  try {
                    Document embeddedDocument = htmlMaterialController.getProcessedHtmlDocument(fieldPrefix, (HtmlMaterial) workspaceMaterial.getMaterial());
                    for (Element formElement : getDocumentFormElements(embeddedDocument)) {
                      // If form elements have "id" -attribute specified, we remove it
                      formElement.removeAttribute("id"); 
                      String originalName = formElement.getAttribute("name");
                      String assignedName = assignFormElementName(workspaceMaterial.getMaterial().getId(), originalName);
                      formElement.setAttribute("name", assignedName); 
                    }

                    Node parent = iframeElement.getParentNode();
                    Node nextSibling = iframeElement.getNextSibling();

                    if (ADD_DEBUG_MARKERS) {
                      Element iframeStartMarker = createIframeMarker(iframeElement.getOwnerDocument(), "#" + workspaceMaterial.getMaterial().getId() + " / " + workspaceMaterial.getMaterial().getTitle() + " >>>>>>>>>>", "background: green; color: #fff; border: 1px dotted #000; text-align: center;");
                      parent.insertBefore(iframeStartMarker, iframeElement);
                    }
                    
                    event.replaceWithForeignDocumentBody(iframeElement, embeddedDocument);
                    
                    if (ADD_DEBUG_MARKERS) {
                      Element iframeEndMarker = createIframeMarker(iframeElement.getOwnerDocument(), "<<<<<<<<<< #" + workspaceMaterial.getMaterial().getId() + " / " + workspaceMaterial.getMaterial().getTitle(), "background: red; color: #fff; border: 1px dotted #000; text-align: center;");
                      if (nextSibling != null) {
                        parent.insertBefore(iframeEndMarker, nextSibling);
                      } else {
                        parent.appendChild(iframeEndMarker);
                      }
                    }
                    
                  } catch (SAXException | IOException e) {
                    // Processing failed, let iframe to be as-is and log the failure.
                    logger.log(Level.SEVERE, "iframe processing failed", e);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private Element createIframeMarker(Document ownerDocument, String text, String style) {
    Element result = ownerDocument.createElement("div");
    result.setAttribute("style", style);
    result.appendChild(ownerDocument.createTextNode(text));
    return result;
  }

  private String assignFormElementName(Long materialId, String originalName) {
    return new StringBuilder()
      .append(materialId)
      .append(':')
      .append(originalName)
      .toString();
  }

  public void beforeSerializeMaterial(HtmlMaterialBeforeSerializeContext event) {
    Document document = event.getDocument();
    String formName = "material-form"; 
    
    List<String> assignedNames = new ArrayList<>();
    List<Element> formElements = getDocumentFormElements(document);
    for (Element formElement : formElements) {
      String formElementName = formElement.getAttribute("name");
      int index = 0;
      do {
        StringBuilder assignedNameBuilder = new StringBuilder();
        if (StringUtils.isNotBlank(event.getFieldPrefix())) {
          assignedNameBuilder.append(event.getFieldPrefix());
          assignedNameBuilder.append(':');
        }
            
        assignedNameBuilder.append(formElementName);
        assignedNameBuilder.append(':');
        assignedNameBuilder.append(index);
        
        String assignedName = DigestUtils.md5Hex(assignedNameBuilder.toString());

        formElement.setAttribute("name", assignedName);
        index++;
      } while (assignedNames.contains(formElementName));
    }
    
    attachToForm(formName, formElements);
  }

  private List<Element> getDocumentFormElements(Document document) {
    List<Element> result = new ArrayList<>();
    result.addAll(nodeListAsList(document.getElementsByTagName("input")));
    result.addAll(nodeListAsList(document.getElementsByTagName("textarea")));
    result.addAll(nodeListAsList(document.getElementsByTagName("select")));
    return result;
  }

  private List<Element> nodeListAsList(NodeList nodeList) {
    List<Element> result = new ArrayList<>();
    
    for (int i = 0, l = nodeList.getLength(); i < l; i++) {
      Node node = nodeList.item(i);
      if (node instanceof Element) {
        result.add((Element) node); 
      }
    }
    
    return result;
  }

  private void attachToForm(String formName, List<Element> elements) {
    for (Element element : elements) {
      element.setAttribute("form", formName);
      String name = new StringBuilder()
        .append(formName)
        .append(":queryform:")
        .append(element.getAttribute("name"))
        .toString();
      element.setAttribute("name", name);
    }
  }
}

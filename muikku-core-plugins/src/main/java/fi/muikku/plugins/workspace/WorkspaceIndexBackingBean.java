package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;

import org.apache.commons.lang3.StringUtils;
import org.apache.xerces.parsers.DOMParser;
import org.cyberneko.html.HTMLConfiguration;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;
import org.xml.sax.SAXNotRecognizedException;
import org.xml.sax.SAXNotSupportedException;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}", to = "/workspaces/workspace.jsf")
public class WorkspaceIndexBackingBean {

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @Inject
  private WorkspaceVisitController workspaceVisitController;
  
  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);

    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    setWorkspaceEntityId(workspaceEntity.getId());
    
    contentNodes = new ArrayList<>();
    DOMParser parser = new DOMParser(new HTMLConfiguration());
    try {
      parser.setProperty("http://cyberneko.org/html/properties/names/elems", "lower");

      TransformerFactory transformerFactory = TransformerFactory.newInstance();
      Transformer transformer = transformerFactory.newTransformer();
      transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
      transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
      transformer.setOutputProperty(OutputKeys.METHOD, "xml");
      transformer.setOutputProperty(OutputKeys.INDENT, "no");
  
      WorkspaceMaterial frontPage = workspaceMaterialController.findFrontPage(workspaceEntity);
      ContentNode node = workspaceMaterialController.createContentNode(frontPage, parser, transformer);
      contentNodes.add(node);
    } catch (SAXNotRecognizedException | SAXNotSupportedException | TransformerConfigurationException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);

    schoolDataBridgeSessionController.startSystemSession();
    try {
      workspaceId = workspaceEntity.getId();
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      workspaceName = workspace.getName();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    return null;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  private WorkspaceEntity getWorkspaceEntity() {
    return workspaceController.findWorkspaceEntityById(workspaceId);
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void visit() {
    workspaceVisitController.visit(getWorkspaceEntity());
  }
  
  public Long getNumVisits() {
    return workspaceVisitController.getNumVisits(getWorkspaceEntity());
  }
  
  public long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }

  private Long workspaceId;
  private String workspaceName;
  private Long workspaceEntityId;

  private List<ContentNode> contentNodes;

}

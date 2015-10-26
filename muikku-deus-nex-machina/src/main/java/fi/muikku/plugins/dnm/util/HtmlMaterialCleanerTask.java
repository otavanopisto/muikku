package fi.muikku.plugins.dnm.util;

import org.w3c.dom.Document;

import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public interface HtmlMaterialCleanerTask {

  public boolean process(Document document, WorkspaceMaterial material);
  
}

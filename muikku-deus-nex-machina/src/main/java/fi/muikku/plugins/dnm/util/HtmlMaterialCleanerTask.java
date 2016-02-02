package fi.muikku.plugins.dnm.util;

import org.w3c.dom.Document;

import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public interface HtmlMaterialCleanerTask {

  public static final Integer PRIORITY_HIGH = 1;
  public static final Integer PRIORITY_NORMAL = 5;
  public static final Integer PRIORITY_LOW = 10;

  public boolean process(Document document, WorkspaceMaterial material);

  public Integer getPriority();

}

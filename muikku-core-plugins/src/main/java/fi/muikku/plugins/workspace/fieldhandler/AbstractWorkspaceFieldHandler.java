package fi.muikku.plugins.workspace.fieldhandler;

public abstract class AbstractWorkspaceFieldHandler implements WorkspaceFieldHandler {

  private static final String FORM_ID = "material-form"; 
  private static final String FIELD_PREFIX = FORM_ID + ":queryform:";
  
  protected String getHtmlFieldName(String fieldName) {
    return FIELD_PREFIX + fieldName;
  }

}

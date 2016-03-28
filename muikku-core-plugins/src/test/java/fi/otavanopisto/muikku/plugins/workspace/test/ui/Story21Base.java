package fi.otavanopisto.muikku.plugins.workspace.test.ui;

public abstract class Story21Base extends SeleniumTestBase {
// FIXME: Re-enable this test
//  
//  private static final String WORKSPACE_DATASOURCE = "MOCK";
//  private static final String WORKSPACE_URLNAME = "selenium-tests";
//  private static final String WORKSPACE_DESCRIPTION = "Workspace for selenium tests";
//  private static final String WORKSPACE_TYPE_ID = "2";
//  private static final String WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER = "2";
//  
//  private static final String MATERIAL_HTML = "<html><body><p>Testimateriaali k&auml;ytt&auml;j&auml;tarinalle #21: Opiskeljana haluan voida vastata yksivalinta -tyyppisiin teht&auml;viin</p><p><strong>Alaspudotus</strong></p><p><object type='application/vnd.muikku.field.select'><param name='type' value='application/json'><param name='content' value='{&quot;name&quot;:&quot;param1&quot;,&quot;listType&quot;:&quot;dropdown&quot;,&quot;size&quot;:null,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}'><select name='param1'><option value='1'>Valinta 1</option><option value='2'>Valinta 2</option><option value='3'>Valinta 3</option></select></object></p><p><strong>Pystysuora radionappilista</strong></p><p><object type='application/vnd.muikku.field.select'><param name='type' value='application/json'><param name='content' value='{&quot;name&quot;:&quot;param2&quot;,&quot;listType&quot;:&quot;radio&quot;,&quot;size&quot;:null,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}'><input name='param2' type='radio' value='1'><label>Valinta 1</label><br><input name='param2' type='radio' value='2'><label>Valinta 2</label><br><input name='param2' type='radio' value='3'><label>Valinta 3</label><br></object></p><p><strong>Vaakasuora radionappilista</strong></p><p><object type='application/vnd.muikku.field.select'><param name='type' value='application/json'><param name='content' value='{&quot;name&quot;:&quot;param3&quot;,&quot;listType&quot;:&quot;radio_horz&quot;,&quot;size&quot;:null,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}'><input name='param3' type='radio' value='1'><label>Valinta 1</label><input name='param3' type='radio' value='2'><label>Valinta 2</label><input name='param3' type='radio' value='3'><label>Valinta 3</label></object></p><p><strong>Lista</strong></p><p><object type='application/vnd.muikku.field.select'><param name='type' value='application/json'><param name='content' value='{&quot;name&quot;:&quot;param4&quot;,&quot;listType&quot;:&quot;list&quot;,&quot;size&quot;:3,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 1&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 2&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;points&quot;:null,&quot;text&quot;:&quot;Valinta 3&quot;}]}'><select name='param4' size='3'><option value='1'>Valinta 1</option><option value='2'>Valinta 2</option><option value='3'>Valinta 3</option></select></object></p><p>&nbsp;</p></body></html>";
//  private static final String MATERIAL_TITLE = "User Story #21 - select field";
//  private static final String MATERIAL_URLNAME = "us21-textfield";
//  private static final String TEXTFIELD_TEST_URL = "/workspace/" + WORKSPACE_URLNAME + "/materials.html/" + MATERIAL_URLNAME;
//
//  @Test
//  public void testDropdownSave() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(MATERIAL_URLNAME, MATERIAL_TITLE, MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By dropdownFieldBy = By.cssSelector("#material-form p:nth-child(3) select");
//          By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");
//
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          loginStudent1();
//          
//          // Test saving
//          
//          new Select(getDriver().findElement(dropdownFieldBy)).selectByValue("2");
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("2", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("2", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
//
//          // Test changing
//          
//          new Select(getDriver().findElement(dropdownFieldBy)).selectByValue("3");
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("3", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("3", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
//        } finally {
//          deleteWorkspaceMaterial(workspaceMaterial);
//        }
//      } finally {
//        deleteHtmlMaterial(htmlMaterial);
//      }
//    } finally {
//      deleteWorkspace(workspace);
//    }
//  }
//  
//  @Test
//  public void testRadioHorizontalSave() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(MATERIAL_URLNAME, MATERIAL_TITLE, MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");
//
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          loginStudent1();
//          
//          // Test saving
//
//          getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[value=\"2\"]")).click();
//         
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
//          
//          // Test changing
//
//          getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[value=\"3\"]")).click();
//          
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
//        } finally {
//          deleteWorkspaceMaterial(workspaceMaterial);
//        }
//      } finally {
//        deleteHtmlMaterial(htmlMaterial);
//      }
//    } finally {
//      deleteWorkspace(workspace);
//    }
//  }
//  
//  @Test
//  public void testRadioVerticalSave() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(MATERIAL_URLNAME, MATERIAL_TITLE, MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");
//
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          loginStudent1();
//          
//          // Test saving
//
//          getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[value=\"2\"]")).click();
//          
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
//          
//          // Test changing
//
//          getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[value=\"3\"]")).click();
//          
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
//        } finally {
//          deleteWorkspaceMaterial(workspaceMaterial);
//        }
//      } finally {
//        deleteHtmlMaterial(htmlMaterial);
//      }
//    } finally {
//      deleteWorkspace(workspace);
//    }
//  }
//  
//  @Test
//  public void testListSave() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(MATERIAL_URLNAME, MATERIAL_TITLE, MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By listFieldBy = By.cssSelector("#material-form select[size=\"3\"]");
//          By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");
//
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          loginStudent1();
//          
//          // Test saving
//          
//          new Select(getDriver().findElement(listFieldBy)).selectByValue("2");
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("2", getDriver().findElement(listFieldBy).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("2", getDriver().findElement(listFieldBy).getAttribute("value"));
//
//          // Test changing
//          
//          new Select(getDriver().findElement(listFieldBy)).selectByValue("3");
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals("3", getDriver().findElement(listFieldBy).getAttribute("value"));
//          
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals("3", getDriver().findElement(listFieldBy).getAttribute("value"));
//        } finally {
//          deleteWorkspaceMaterial(workspaceMaterial);
//        }
//      } finally {
//        deleteHtmlMaterial(htmlMaterial);
//      }
//    } finally {
//      deleteWorkspace(workspace);
//    }
//  }
//  
//  private void loginStudent1() throws InterruptedException {
//    WebElement usernameInput = getDriver().findElement(By.cssSelector(".loginWidget input[type=\"text\"]"));
//    assertNotNull(usernameInput);
//
//    WebElement passwordInput = getDriver().findElement(By.cssSelector(".loginWidget input[type=\"password\"]"));
//    assertNotNull(passwordInput);
//
//    WebElement loginButton = getDriver().findElement(By.cssSelector(".loginWidget input[type=\"submit\"]"));
//    assertNotNull(loginButton);
//
//    usernameInput.click();
//    usernameInput.sendKeys(getStudent1Username());
//
//    passwordInput.click();
//    passwordInput.sendKeys(getStudent1Password());
//
//    loginButton.click();
//  }
}

package fi.otavanopisto.muikku.plugins.workspace.test.ui;


public abstract class Story20Base extends SeleniumTestBase {
//FIXME: Re-enable this test
//
//  private static final String WORKSPACE_DATASOURCE = "MOCK";
//  private static final String WORKSPACE_URLNAME = "selenium-tests";
//  private static final String WORKSPACE_DESCRIPTION = "Workspace for selenium tests";
//  private static final String WORKSPACE_TYPE_ID = "2";
//  private static final String WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER = "2";
//  
//  private static final String TEXTFIELD_MATERIAL_HTML = "<html><body><p>Testi k&auml;ytt&auml;j&auml;tarinalle #100020: Opiskeljana haluan voida vastata tekstimuotoiseen kentt&auml;&auml;n</p><p><strong>Yksirivinen tekstikentt&auml;:</strong></p><p><object type='application/vnd.muikku.field.text'><param name='type' value='application/json'><param name='content' value='{&quot;name&quot;:&quot;param1&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:20,&quot;hint&quot;:&quot;Vihjeteksti&quot;,&quot;help&quot;:&quot;Ohjeteksti&quot;}'><input name='param1' size='20' type='text'></object></body></html>";
//  private static final String TEXTFIELD_MATERIAL_TITLE = "User Styoe #20 - textfield";
//  private static final String TEXTFIELD_MATERIAL_URLNAME = "us20-textfield";
//  private static final String TEXTFIELD_TEST_URL = "/workspace/" + WORKSPACE_URLNAME + "/materials.html/" + TEXTFIELD_MATERIAL_URLNAME;
//  private static final String TEXTFIELD_HINT_TEXT = "Vihjeteksti";
//  private static final String TEXTFIELD_HELP_TEXT = "Ohjeteksti";
//  
//  private static final String MEMOFIELD_MATERIAL_HTML = "<html><body><p>Testi k&auml;ytt&auml;j&auml;tarinalle #100020: Opiskeljana haluan voida vastata tekstimuotoiseen kentt&auml;&auml;n</p><p><strong>Yksirivinen tekstikentt&auml;:</strong></p><p><object type='application/vnd.muikku.field.memo'><param name='type' value='application/json'><param name='content' value='{&quot;name&quot;:&quot;param2&quot;,&quot;columns&quot;:20,&quot;rows&quot;:2,&quot;help&quot;:&quot;Ohjeteksti&quot;,&quot;hint&quot;:&quot;Vihjeteksti&quot;}'><textarea cols='20' name='param2' placeholder='Ohjeteksti' rows='2' title='Vihjeteksti'></textarea></object></body></html>";
//  private static final String MEMOFIELD_MATERIAL_TITLE = "User Styoe #20 - memofield";
//  private static final String MEMOFIELD_MATERIAL_URLNAME = "us20-memofield";
//  private static final String MEMOFIELD_TEST_URL = "/workspace/" + WORKSPACE_URLNAME + "/materials.html/" + MEMOFIELD_MATERIAL_URLNAME;
//  private static final String MEMOFIELD_HINT_TEXT = "Vihjeteksti";
//  private static final String MEMOFIELD_HELP_TEXT = "Ohjeteksti";
//  private static final String MEMOFIELD_COLUMNS = "20";
//  private static final String MEMOFIELD_ROWS = "2";
//
//  @Test
//  public void testTextFieldAttributes() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(TEXTFIELD_MATERIAL_URLNAME, TEXTFIELD_MATERIAL_TITLE, TEXTFIELD_MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By textInputBy = By.cssSelector("#material-form input[type=\"text\"]");
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//  
//          // Can we find the text input?
//          assertNotNull(getDriver().findElement(textInputBy));
//          assertEquals("text", getDriver().findElement(textInputBy).getAttribute("type"));
//          assertEquals(TEXTFIELD_HINT_TEXT, getDriver().findElement(textInputBy).getAttribute("title"));
//          assertEquals(TEXTFIELD_HELP_TEXT, getDriver().findElement(textInputBy).getAttribute("placeholder"));
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
//  public void testMemoFieldAttributes() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(MEMOFIELD_MATERIAL_URLNAME, MEMOFIELD_MATERIAL_TITLE, MEMOFIELD_MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By memoFieldBy = By.cssSelector("#material-form textarea");
//          getDriver().get(getAppUrl(MEMOFIELD_TEST_URL).toString());
//          
//          // Can we find the text input?
//          assertNotNull(getDriver().findElement(memoFieldBy));
//          assertEquals(MEMOFIELD_HINT_TEXT, getDriver().findElement(memoFieldBy).getAttribute("title"));
//          assertEquals(MEMOFIELD_HELP_TEXT, getDriver().findElement(memoFieldBy).getAttribute("placeholder"));
//          assertEquals(MEMOFIELD_COLUMNS, getDriver().findElement(memoFieldBy).getAttribute("cols"));
//          assertEquals(MEMOFIELD_ROWS, getDriver().findElement(memoFieldBy).getAttribute("rows"));
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
//  public void testTextFieldSave() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(TEXTFIELD_MATERIAL_URLNAME, TEXTFIELD_MATERIAL_TITLE, TEXTFIELD_MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By textFieldBy = By.cssSelector("#material-form input[type=\"text\"]");
//          By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");
//
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          loginStudent1();
//
//          // Can we find the text input?
//          assertNotNull(getDriver().findElement(textFieldBy));
//
//          // Can we find the submit button ?
//          assertNotNull(getDriver().findElement(saveButtonBy));
//
//          // Lets to some text into it
//
//          getDriver().findElement(textFieldBy).click();
//          getDriver().findElement(textFieldBy).clear();
//          getDriver().findElement(textFieldBy).sendKeys(PANGRAM_FINNISH);
//
//          // Save and check value
//
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals(PANGRAM_FINNISH, getDriver().findElement(textFieldBy).getAttribute("value"));
//
//          // Reload & check value
//
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_FINNISH, getDriver().findElement(textFieldBy).getAttribute("value"));
//
//          // Change value, save, check, reload and check
//
//          getDriver().findElement(textFieldBy).click();
//          getDriver().findElement(textFieldBy).clear();
//          getDriver().findElement(textFieldBy).sendKeys(PANGRAM_ENGLISH);
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals(PANGRAM_ENGLISH, getDriver().findElement(textFieldBy).getAttribute("value"));
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_ENGLISH, getDriver().findElement(textFieldBy).getAttribute("value"));
//
//          // Test unicode (Japanese, Russian)
//
//          getDriver().findElement(textFieldBy).click();
//          getDriver().findElement(textFieldBy).clear();
//          getDriver().findElement(textFieldBy).sendKeys(PANGRAM_JAPANESE);
//          getDriver().findElement(saveButtonBy).click();
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_JAPANESE, getDriver().findElement(textFieldBy).getAttribute("value"));
//
//          getDriver().findElement(textFieldBy).click();
//          getDriver().findElement(textFieldBy).clear();
//          getDriver().findElement(textFieldBy).sendKeys(PANGRAM_RUSSIAN);
//          getDriver().findElement(saveButtonBy).click();
//          getDriver().get(getAppUrl(TEXTFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_RUSSIAN, getDriver().findElement(textFieldBy).getAttribute("value"));
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
//  public void testMemoFieldSave() throws Exception {
//    WorkspaceCompact workspace = createWorkspace(WORKSPACE_DATASOURCE, WORKSPACE_URLNAME, WORKSPACE_DESCRIPTION, WORKSPACE_TYPE_ID, WORKSPACE_COURSE_IDENTIFIER_IDENTIFIER);
//    try {
//      HtmlMaterialCompact htmlMaterial = createHtmlMaterial(MEMOFIELD_MATERIAL_URLNAME, MEMOFIELD_MATERIAL_TITLE, MEMOFIELD_MATERIAL_HTML);
//      try {
//        WorkspaceMaterialCompact workspaceMaterial = createWorkspaceMaterial(workspace, htmlMaterial.getId(), htmlMaterial.getUrlName());
//        try {
//          By memoFieldBy = By.cssSelector("#material-form textarea");
//          By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");
//
//          getDriver().get(getAppUrl(MEMOFIELD_TEST_URL).toString());
//          loginStudent1();
//
//          // Can we find the text input?
//          assertNotNull(getDriver().findElement(memoFieldBy));
//
//          // Can we find the submit button ?
//          assertNotNull(getDriver().findElement(saveButtonBy));
//
//          // Lets to some text into it
//
//          getDriver().findElement(memoFieldBy).click();
//          getDriver().findElement(memoFieldBy).clear();
//          getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_FINNISH);
//
//          // Save and check value
//
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals(PANGRAM_FINNISH, getDriver().findElement(memoFieldBy).getAttribute("value"));
//
//          // Reload & check value
//
//          getDriver().get(getAppUrl(MEMOFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_FINNISH, getDriver().findElement(memoFieldBy).getAttribute("value"));
//
//          // Change value, save, check, reload and check
//
//          getDriver().findElement(memoFieldBy).click();
//          getDriver().findElement(memoFieldBy).clear();
//          getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_ENGLISH);
//          getDriver().findElement(saveButtonBy).click();
//          assertEquals(PANGRAM_ENGLISH, getDriver().findElement(memoFieldBy).getAttribute("value"));
//          getDriver().get(getAppUrl(MEMOFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_ENGLISH, getDriver().findElement(memoFieldBy).getAttribute("value"));
//
//          // Test unicode (Japanese, Russian)
//
//          getDriver().findElement(memoFieldBy).click();
//          getDriver().findElement(memoFieldBy).clear();
//          getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_JAPANESE);
//          getDriver().findElement(saveButtonBy).click();
//          getDriver().get(getAppUrl(MEMOFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_JAPANESE, getDriver().findElement(memoFieldBy).getAttribute("value"));
//
//          getDriver().findElement(memoFieldBy).click();
//          getDriver().findElement(memoFieldBy).clear();
//          getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_RUSSIAN);
//          getDriver().findElement(saveButtonBy).click();
//          getDriver().get(getAppUrl(MEMOFIELD_TEST_URL).toString());
//          assertEquals(PANGRAM_RUSSIAN, getDriver().findElement(memoFieldBy).getAttribute("value"));
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

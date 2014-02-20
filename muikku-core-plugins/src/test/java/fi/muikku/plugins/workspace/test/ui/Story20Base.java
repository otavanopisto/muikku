package fi.muikku.plugins.workspace.test.ui;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import fi.muikku.plugins.material.model.HtmlMaterialCompact;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialCompact;
import fi.muikku.schooldata.entity.WorkspaceCompact;
import fi.muikku.test.TestSqlFiles;

public abstract class Story20Base extends SeleniumTestBase {

  private static final String TEST_PAGE = "/workspace/selenium-tests/materials.html/selenium/teht/us20";
  
  private static final String TEXTFIELD_HINT_TEXT = "Vihjeteksti";
  private static final String TEXTFIELD_HELP_TEXT = "Ohjeteksti";
  private static final String MEMOFIELD_HINT_TEXT = "Vihjeteksti";
  private static final String MEMOFIELD_HELP_TEXT = "Ohjeteksti";
  private static final String MEMOFIELD_COLUMNS = "20";
  private static final String MEMOFIELD_ROWS = "2";
  
  @Test
  @TestSqlFiles({
    "generic/selenium-school-data-source", 
    "generic/workspace-selenium",
    "workspace-material/workspace-material",
  })
  public void testMemoFieldAttributes() throws Exception {
    By memoFieldBy = By.cssSelector("#material-form textarea");

    getDriver().get(getAppUrl(TEST_PAGE).toString());

    // Can we find the text input?
    assertNotNull(getDriver().findElement(memoFieldBy));
    assertEquals(MEMOFIELD_HINT_TEXT, getDriver().findElement(memoFieldBy).getAttribute("title"));
    assertEquals(MEMOFIELD_HELP_TEXT, getDriver().findElement(memoFieldBy).getAttribute("placeholder"));
    assertEquals(MEMOFIELD_COLUMNS, getDriver().findElement(memoFieldBy).getAttribute("cols"));
    assertEquals(MEMOFIELD_ROWS, getDriver().findElement(memoFieldBy).getAttribute("rows"));
  }

  @Test
  @TestSqlFiles({
    "generic/selenium-school-data-source", 
    "generic/workspace-selenium",
    "workspace-material/workspace-material",
  })
  public void testTextFieldSave() throws Exception {
    By textFieldBy = By.cssSelector("#material-form input[type=\"text\"]");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();

    // Can we find the text input?
    assertNotNull(getDriver().findElement(textFieldBy));

    // Can we find the submit button ?
    assertNotNull(getDriver().findElement(saveButtonBy));

    // Lets to some text into it

    getDriver().findElement(textFieldBy).click();
    getDriver().findElement(textFieldBy).clear();
    getDriver().findElement(textFieldBy).sendKeys(PANGRAM_FINNISH);

    // Save and check value

    getDriver().findElement(saveButtonBy).click();
    assertEquals(PANGRAM_FINNISH, getDriver().findElement(textFieldBy).getAttribute("value"));

    // Reload & check value

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_FINNISH, getDriver().findElement(textFieldBy).getAttribute("value"));

    // Change value, save, check, reload and check

    getDriver().findElement(textFieldBy).click();
    getDriver().findElement(textFieldBy).clear();
    getDriver().findElement(textFieldBy).sendKeys(PANGRAM_ENGLISH);
    getDriver().findElement(saveButtonBy).click();
    assertEquals(PANGRAM_ENGLISH, getDriver().findElement(textFieldBy).getAttribute("value"));
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_ENGLISH, getDriver().findElement(textFieldBy).getAttribute("value"));

    // Test unicode (Japanese, Russian)

    getDriver().findElement(textFieldBy).click();
    getDriver().findElement(textFieldBy).clear();
    getDriver().findElement(textFieldBy).sendKeys(PANGRAM_JAPANESE);
    getDriver().findElement(saveButtonBy).click();
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_JAPANESE, getDriver().findElement(textFieldBy).getAttribute("value"));

    getDriver().findElement(textFieldBy).click();
    getDriver().findElement(textFieldBy).clear();
    getDriver().findElement(textFieldBy).sendKeys(PANGRAM_RUSSIAN);
    getDriver().findElement(saveButtonBy).click();
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_RUSSIAN, getDriver().findElement(textFieldBy).getAttribute("value"));
  }

  @Test
  @TestSqlFiles({
    "generic/selenium-school-data-source", 
    "generic/workspace-selenium",
    "workspace-material/workspace-material",
  })
  public void testMemoFieldSave() throws Exception {
    By memoFieldBy = By.cssSelector("#material-form textarea");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();

    // Can we find the text input?
    assertNotNull(getDriver().findElement(memoFieldBy));

    // Can we find the submit button ?
    assertNotNull(getDriver().findElement(saveButtonBy));

    // Lets to some text into it

    getDriver().findElement(memoFieldBy).click();
    getDriver().findElement(memoFieldBy).clear();
    getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_FINNISH);

    // Save and check value

    getDriver().findElement(saveButtonBy).click();
    assertEquals(PANGRAM_FINNISH, getDriver().findElement(memoFieldBy).getAttribute("value"));

    // Reload & check value

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_FINNISH, getDriver().findElement(memoFieldBy).getAttribute("value"));

    // Change value, save, check, reload and check

    getDriver().findElement(memoFieldBy).click();
    getDriver().findElement(memoFieldBy).clear();
    getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_ENGLISH);
    getDriver().findElement(saveButtonBy).click();
    assertEquals(PANGRAM_ENGLISH, getDriver().findElement(memoFieldBy).getAttribute("value"));
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_ENGLISH, getDriver().findElement(memoFieldBy).getAttribute("value"));

    // Test unicode (Japanese, Russian)

    getDriver().findElement(memoFieldBy).click();
    getDriver().findElement(memoFieldBy).clear();
    getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_JAPANESE);
    getDriver().findElement(saveButtonBy).click();
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_JAPANESE, getDriver().findElement(memoFieldBy).getAttribute("value"));

    getDriver().findElement(memoFieldBy).click();
    getDriver().findElement(memoFieldBy).clear();
    getDriver().findElement(memoFieldBy).sendKeys(PANGRAM_RUSSIAN);
    getDriver().findElement(saveButtonBy).click();
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_RUSSIAN, getDriver().findElement(memoFieldBy).getAttribute("value"));
  }

  private void loginStudent1() throws InterruptedException {
    WebElement usernameInput = getDriver().findElement(By.cssSelector(".loginWidget input[type=\"text\"]"));
    assertNotNull(usernameInput);

    WebElement passwordInput = getDriver().findElement(By.cssSelector(".loginWidget input[type=\"password\"]"));
    assertNotNull(passwordInput);

    WebElement loginButton = getDriver().findElement(By.cssSelector(".loginWidget input[type=\"submit\"]"));
    assertNotNull(loginButton);

    usernameInput.click();
    usernameInput.sendKeys(getStudent1Username());

    passwordInput.click();
    passwordInput.sendKeys(getStudent1Password());

    loginButton.click();
  }

}

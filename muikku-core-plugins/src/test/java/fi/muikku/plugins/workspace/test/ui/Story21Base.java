package fi.muikku.plugins.workspace.test.ui;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.Select;

import fi.muikku.test.TestSqlFiles;

public abstract class Story21Base extends SeleniumTestBase {

  private static final String TEST_PAGE = "/workspace/pool/materials.html/selenium/teht/us21";
  @Test
  @TestSqlFiles({
    "generic/selenium-school-data-source", 
    "generic/workspace-selenium",
    "workspace-material/workspace-material",
  })
  public void testDropdownSave() throws Exception {
    By dropdownFieldBy = By.cssSelector("#material-form p:nth-child(3) select");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving
    
    new Select(getDriver().findElement(dropdownFieldBy)).selectByValue("2");
    getDriver().findElement(saveButtonBy).click();
    assertEquals("2", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", getDriver().findElement(dropdownFieldBy).getAttribute("value"));

    // Test changing
    
    new Select(getDriver().findElement(dropdownFieldBy)).selectByValue("3");
    getDriver().findElement(saveButtonBy).click();
    assertEquals("3", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", getDriver().findElement(dropdownFieldBy).getAttribute("value"));
  }

  @Test
  public void testRadioHorizontalSave() throws Exception {
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving

    getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[value=\"2\"]")).click();
   
    getDriver().findElement(saveButtonBy).click();
    assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    // Test changing

    getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[value=\"3\"]")).click();
    
    getDriver().findElement(saveButtonBy).click();
    assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
  }

  @Test
  public void testRadioVerticalSave() throws Exception {
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving

    getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[value=\"2\"]")).click();
    
    getDriver().findElement(saveButtonBy).click();
    assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    // Test changing

    getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[value=\"3\"]")).click();
    
    getDriver().findElement(saveButtonBy).click();
    assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", getDriver().findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
  }
  
  @Test
  @TestSqlFiles({
    "generic/selenium-school-data-source", 
    "generic/workspace-selenium",
    "workspace-material/workspace-material",
  })
  public void testListSave() throws Exception {
    By listFieldBy = By.cssSelector("#material-form select[size=\"3\"]");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    getDriver().get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving
    
    new Select(getDriver().findElement(listFieldBy)).selectByValue("2");
    getDriver().findElement(saveButtonBy).click();
    assertEquals("2", getDriver().findElement(listFieldBy).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", getDriver().findElement(listFieldBy).getAttribute("value"));

    // Test changing
    
    new Select(getDriver().findElement(listFieldBy)).selectByValue("3");
    getDriver().findElement(saveButtonBy).click();
    assertEquals("3", getDriver().findElement(listFieldBy).getAttribute("value"));
    
    getDriver().get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", getDriver().findElement(listFieldBy).getAttribute("value"));
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

package fi.muikku.plugins.workspace.test.ui;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;

public class Story21 extends SeleniumTest {

  private static final String TEST_PAGE = "/workspace/pool/materials.html/selenium/teht/us21";

  protected void setDriver(RemoteWebDriver driver) {
    this.driver = driver;
  }

  protected RemoteWebDriver getDriver() {
    return driver;
  }

  @Test
  public void testSanity() throws Exception {
    assertNotNull(driver);
    assertTrue("Server down", checkServerUp());
  }
  
  @Test
  public void testDropdownSave() throws Exception {
    By dropdownFieldBy = By.cssSelector("#material-form p:nth-child(3) select");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving
    
    new Actions(driver)
      .click(driver.findElement(dropdownFieldBy))
      .click(driver.findElement(By.cssSelector("#material-form p:nth-child(3) select option[value=\"2\"]")))
      .perform();
    
    driver.findElement(saveButtonBy).click();
    assertEquals("2", driver.findElement(dropdownFieldBy).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", driver.findElement(dropdownFieldBy).getAttribute("value"));

    // Test changing
    
    new Actions(driver)
      .click(driver.findElement(dropdownFieldBy))
      .click(driver.findElement(By.cssSelector("#material-form p:nth-child(3) select option[value=\"3\"]")))
      .perform();
    
    driver.findElement(saveButtonBy).click();
    assertEquals("3", driver.findElement(dropdownFieldBy).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", driver.findElement(dropdownFieldBy).getAttribute("value"));
  }

  @Test
  public void testRadioHorizontalSave() throws Exception {
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving

    driver.findElement(By.cssSelector("#material-form p:nth-child(5) input[value=\"2\"]")).click();
    
    driver.findElement(saveButtonBy).click();
    assertEquals("2", driver.findElement(By.cssSelector("#material-form p:nth-child(5) input:selected")).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", driver.findElement(By.cssSelector("#material-form p:nth-child(5) input:selected")).getAttribute("value"));
  }
  
  private void loginStudent1() throws InterruptedException {
    WebElement usernameInput = driver.findElement(By.cssSelector(".loginWidget input[type=\"text\"]"));
    assertNotNull(usernameInput);

    WebElement passwordInput = driver.findElement(By.cssSelector(".loginWidget input[type=\"password\"]"));
    assertNotNull(passwordInput);

    WebElement loginButton = driver.findElement(By.cssSelector(".loginWidget input[type=\"submit\"]"));
    assertNotNull(loginButton);

    usernameInput.click();
    usernameInput.sendKeys(getStudent1Username());

    passwordInput.click();
    passwordInput.sendKeys(getStudent1Password());

    loginButton.click();
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
  }

  private RemoteWebDriver driver;
}

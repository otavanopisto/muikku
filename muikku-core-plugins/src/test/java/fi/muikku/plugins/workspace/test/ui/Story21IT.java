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

public class Story21IT extends SeleniumTestBase {

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
    
    new Select(driver.findElement(dropdownFieldBy)).selectByValue("2");
    driver.findElement(saveButtonBy).click();
    assertEquals("2", driver.findElement(dropdownFieldBy).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", driver.findElement(dropdownFieldBy).getAttribute("value"));

    // Test changing
    
    new Select(driver.findElement(dropdownFieldBy)).selectByValue("3");
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
    assertEquals("2", driver.findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", driver.findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    // Test changing

    driver.findElement(By.cssSelector("#material-form p:nth-child(5) input[value=\"3\"]")).click();
    
    driver.findElement(saveButtonBy).click();
    assertEquals("3", driver.findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", driver.findElement(By.cssSelector("#material-form p:nth-child(5) input[type=\"radio\"]:checked")).getAttribute("value"));
  }

  @Test
  public void testRadioVerticalSave() throws Exception {
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving

    driver.findElement(By.cssSelector("#material-form p:nth-child(7) input[value=\"2\"]")).click();
    
    driver.findElement(saveButtonBy).click();
    assertEquals("2", driver.findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", driver.findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    // Test changing

    driver.findElement(By.cssSelector("#material-form p:nth-child(7) input[value=\"3\"]")).click();
    
    driver.findElement(saveButtonBy).click();
    assertEquals("3", driver.findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", driver.findElement(By.cssSelector("#material-form p:nth-child(7) input[type=\"radio\"]:checked")).getAttribute("value"));
  }
  
  @Test
  public void testListSave() throws Exception {
    By listFieldBy = By.cssSelector("#material-form select[size=\"3\"]");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();
    
    // Test saving
    
    new Select(driver.findElement(listFieldBy)).selectByValue("2");
    driver.findElement(saveButtonBy).click();
    assertEquals("2", driver.findElement(listFieldBy).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("2", driver.findElement(listFieldBy).getAttribute("value"));

    // Test changing
    
    new Select(driver.findElement(listFieldBy)).selectByValue("3");
    driver.findElement(saveButtonBy).click();
    assertEquals("3", driver.findElement(listFieldBy).getAttribute("value"));
    
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals("3", driver.findElement(listFieldBy).getAttribute("value"));
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

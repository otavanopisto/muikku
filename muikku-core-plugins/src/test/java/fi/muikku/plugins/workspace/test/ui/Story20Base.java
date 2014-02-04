package fi.muikku.plugins.workspace.test.ui;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.StringTokenizer;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.RemoteWebDriver;

public class Story20Base extends SeleniumTestBase {

  private static final String TEST_PAGE = "/workspace/pool/materials.html/selenium/teht/us20";
  
  private static final String TEXTFIELD_HINT_TEXT = "Vihjeteksti";
  private static final String TEXTFIELD_HELP_TEXT = "Ohjeteksti";
  private static final String MEMOFIELD_HINT_TEXT = "Vihjeteksti";
  private static final String MEMOFIELD_HELP_TEXT = "Ohjeteksti";
  private static final String MEMOFIELD_COLUMNS = "20";
  private static final String MEMOFIELD_ROWS = "2";
  

  private static String[] SQL_FILES = new String[] {
    "generic/selenium-school-data-source", 
    "generic/workspace-selenium"
  };

  @Before
  public void setUp() throws Exception {
    Connection connection = getConnection();
    try {
      connection.setAutoCommit(true);
      
      for (String file : SQL_FILES) {
        runSql(connection, "sql/" + file + "-setup.sql");
      }
      
    } finally {
      connection.close();
    }
    
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();

    Connection connection = getConnection();
    try {
      connection.setAutoCommit(true);
      
      for (String file : SQL_FILES) {
        runSql(connection, "sql/" + file + "-teardown.sql");
      }
      
    } finally {
      connection.close();
    }
  }
  
  private Connection getConnection() throws SQLException, ClassNotFoundException {
    String driver = System.getProperty("integrationtest.datasource.jdbc.muikku.driver");
    String url = System.getProperty("integrationtest.datasource.jdbc.muikku.url");
    String username = System.getProperty("integrationtest.datasource.jdbc.muikku.username");
    String password = System.getProperty("integrationtest.datasource.jdbc.muikku.password");
    
    Class.forName(driver);
    return DriverManager.getConnection(url, username, password);
  }
  
  private void runSql(Connection connection, String file) throws IOException, SQLException {
    ClassLoader classLoader = getClass().getClassLoader();
    InputStream sqlStream = classLoader.getResourceAsStream(file);
    if (sqlStream != null) {
      try {
        String sqlString = IOUtils.toString(sqlStream);
        
        StringTokenizer sqlTokenizer = new StringTokenizer(sqlString, ";");
        while (sqlTokenizer.hasMoreTokens()) {
          String sql = StringUtils.trim(sqlTokenizer.nextToken());
          if (StringUtils.isNotBlank(sql)) {
            Statement statement = connection.createStatement();
            statement.execute(sql);
          }
        }
      } finally {
        sqlStream.close();
      }
    } else {
      throw new FileNotFoundException(file);
    }
  }
  

  protected void setDriver(RemoteWebDriver driver) {
    this.driver = driver;
  }

  protected RemoteWebDriver getDriver() {
    return driver;
  }

  @Test
  public void testTextFieldAttributes() throws Exception {
    By textInputBy = By.cssSelector("#material-form input[type=\"text\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());

    // Can we find the text input?
    assertNotNull(driver.findElement(textInputBy));
    assertEquals("text", driver.findElement(textInputBy).getAttribute("type"));
    assertEquals(TEXTFIELD_HINT_TEXT, driver.findElement(textInputBy).getAttribute("title"));
    assertEquals(TEXTFIELD_HELP_TEXT, driver.findElement(textInputBy).getAttribute("placeholder"));
  }

  @Test
  public void testMemoFieldAttributes() throws Exception {
    By memoFieldBy = By.cssSelector("#material-form textarea");

    driver.get(getAppUrl(TEST_PAGE).toString());

    // Can we find the text input?
    assertNotNull(driver.findElement(memoFieldBy));
    assertEquals(MEMOFIELD_HINT_TEXT, driver.findElement(memoFieldBy).getAttribute("title"));
    assertEquals(MEMOFIELD_HELP_TEXT, driver.findElement(memoFieldBy).getAttribute("placeholder"));
    assertEquals(MEMOFIELD_COLUMNS, driver.findElement(memoFieldBy).getAttribute("cols"));
    assertEquals(MEMOFIELD_ROWS, driver.findElement(memoFieldBy).getAttribute("rows"));
  }

  @Test
  public void testTextFieldSave() throws Exception {
    By textFieldBy = By.cssSelector("#material-form input[type=\"text\"]");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();

    // Can we find the text input?
    assertNotNull(driver.findElement(textFieldBy));

    // Can we find the submit button ?
    assertNotNull(driver.findElement(saveButtonBy));

    // Lets to some text into it

    driver.findElement(textFieldBy).click();
    driver.findElement(textFieldBy).clear();
    driver.findElement(textFieldBy).sendKeys(PANGRAM_FINNISH);

    // Save and check value

    driver.findElement(saveButtonBy).click();
    assertEquals(PANGRAM_FINNISH, driver.findElement(textFieldBy).getAttribute("value"));

    // Reload & check value

    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_FINNISH, driver.findElement(textFieldBy).getAttribute("value"));

    // Change value, save, check, reload and check

    driver.findElement(textFieldBy).click();
    driver.findElement(textFieldBy).clear();
    driver.findElement(textFieldBy).sendKeys(PANGRAM_ENGLISH);
    driver.findElement(saveButtonBy).click();
    assertEquals(PANGRAM_ENGLISH, driver.findElement(textFieldBy).getAttribute("value"));
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_ENGLISH, driver.findElement(textFieldBy).getAttribute("value"));

    // Test unicode (Japanese, Russian)

    driver.findElement(textFieldBy).click();
    driver.findElement(textFieldBy).clear();
    driver.findElement(textFieldBy).sendKeys(PANGRAM_JAPANESE);
    driver.findElement(saveButtonBy).click();
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_JAPANESE, driver.findElement(textFieldBy).getAttribute("value"));

    driver.findElement(textFieldBy).click();
    driver.findElement(textFieldBy).clear();
    driver.findElement(textFieldBy).sendKeys(PANGRAM_RUSSIAN);
    driver.findElement(saveButtonBy).click();
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_RUSSIAN, driver.findElement(textFieldBy).getAttribute("value"));
  }

  @Test
  public void testMemoFieldSave() throws Exception {
    By memoFieldBy = By.cssSelector("#material-form textarea");
    By saveButtonBy = By.cssSelector("#material-form input[type=\"submit\"]");

    driver.get(getAppUrl(TEST_PAGE).toString());
    loginStudent1();

    // Can we find the text input?
    assertNotNull(driver.findElement(memoFieldBy));

    // Can we find the submit button ?
    assertNotNull(driver.findElement(saveButtonBy));

    // Lets to some text into it

    driver.findElement(memoFieldBy).click();
    driver.findElement(memoFieldBy).clear();
    driver.findElement(memoFieldBy).sendKeys(PANGRAM_FINNISH);

    // Save and check value

    driver.findElement(saveButtonBy).click();
    assertEquals(PANGRAM_FINNISH, driver.findElement(memoFieldBy).getAttribute("value"));

    // Reload & check value

    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_FINNISH, driver.findElement(memoFieldBy).getAttribute("value"));

    // Change value, save, check, reload and check

    driver.findElement(memoFieldBy).click();
    driver.findElement(memoFieldBy).clear();
    driver.findElement(memoFieldBy).sendKeys(PANGRAM_ENGLISH);
    driver.findElement(saveButtonBy).click();
    assertEquals(PANGRAM_ENGLISH, driver.findElement(memoFieldBy).getAttribute("value"));
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_ENGLISH, driver.findElement(memoFieldBy).getAttribute("value"));

    // Test unicode (Japanese, Russian)

    driver.findElement(memoFieldBy).click();
    driver.findElement(memoFieldBy).clear();
    driver.findElement(memoFieldBy).sendKeys(PANGRAM_JAPANESE);
    driver.findElement(saveButtonBy).click();
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_JAPANESE, driver.findElement(memoFieldBy).getAttribute("value"));

    driver.findElement(memoFieldBy).click();
    driver.findElement(memoFieldBy).clear();
    driver.findElement(memoFieldBy).sendKeys(PANGRAM_RUSSIAN);
    driver.findElement(saveButtonBy).click();
    driver.get(getAppUrl(TEST_PAGE).toString());
    assertEquals(PANGRAM_RUSSIAN, driver.findElement(memoFieldBy).getAttribute("value"));
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

  private RemoteWebDriver driver;
}

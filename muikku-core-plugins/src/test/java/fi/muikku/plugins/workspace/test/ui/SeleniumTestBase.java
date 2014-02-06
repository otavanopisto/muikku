package fi.muikku.plugins.workspace.test.ui;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.StringTokenizer;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.openqa.selenium.remote.RemoteWebDriver;

import fi.muikku.test.TestSqlFiles;

public class SeleniumTestBase {
  
  @Rule
  public TestName testName; // MUST BE PUBLIC

  // Source: http://en.wikipedia.org/wiki/Pangram
  public static final String PANGRAM_ENGLISH = "The quick brown fox jumps over the lazy dog";
  public static final String PANGRAM_POLISH = "Mężny bądź, chroń pułk twój i sześć flag";
  public static final String PANGRAM_DUTCH = "Lynx c.q. vos prikt bh: dag zwemjuf!";
  public static final String PANGRAM_GERMAN = "Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich";
  public static final String PANGRAM_FRENCH = "Portez ce vieux whisky au juge blond qui fume";
  public static final String PANGRAM_TURKISH = "Pijamalı hasta yağız şoföre çabucak güvendi";
  public static final String PANGRAM_SPANISH = "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.";
  public static final String PANGRAM_SWEDISH = "Flygande bäckasiner söka strax hwila på mjuka tuvor.";
  public static final String PANGRAM_RUSSIAN = "Любя, съешь щипцы, — вздохнёт мэр, — кайф жгуч";
  public static final String PANGRAM_CZECH = "Nechť již hříšné saxofony ďáblů rozzvučí síň úděsnými tóny waltzu, tanga a quickstepu.";
  public static final String PANGRAM_GREEK = "Ξεσκεπάζω την ψυχοφθόρα βδελυγμία.";
  public static final String PANGRAM_LITHUANIAN = "Įlinkusi fechtuotojo špaga blykčiodama gręžė apvalų arbūzą.";
  public static final String PANGRAM_HEBREW = "עטלף אבק נס דרך מזגן שהתפוצץ כי חם.‎";
  public static final String PANGRAM_CATALAN = "Jove xef, porti whisky amb quinze glaçons d'hidrogen, coi!";
  public static final String PANGRAM_IGBO = "Nne, nna, wepụ he'l'ụjọ dum n'ime ọzụzụ ụmụ, vufesi obi nye Chukwu, ṅụrịanụ, gbakọọnụ kpaa, kwee ya ka o guzoshie ike; ọ ghaghị ito, nwapụta ezi agwa.";
  public static final String PANGRAM_YORUBA = "Ìwò̩fà ń yò̩ séji tó gbojúmó̩, ó hàn pákànpò̩ gan-an nis̩é̩ rè̩ bó dò̩la.";
  public static final String PANGRAM_AFRIKAANS = "Jong Xhosas of Zoeloes wil hou by die status quo vir chemie in die Kaap";
  public static final String PANGRAM_JAPANESE = "いろはにほへと ちりぬるを わかよたれそ つねならむ うゐのおくやま けふこえて あさきゆめみし ゑひもせすん";
  public static final String PANGRAM_INDONESIAN = "Hafiz mengendarai bajaj payah-payah ke warnet-x untuk mencetak lembar verifikasi dalam kertas quarto";
  // Source: http://fi.wikipedia.org/wiki/Pangrammi#Suomi
  public static final String PANGRAM_FINNISH = "Charles Darwin jammaili Åken hevixylofonilla Qatarin yöpub Zeligissä.";

  private static final String PROTOCOL = "http";
  private static final String STUDENT1_USERNAME = "st1@oo.fi";
  private static final String STUDENT1_PASSWORD = "qwe";
  
  protected String getHostname() {
    return System.getProperty("integrationtest.serverhost");
  }
  
  protected String getContextPath() {
    return "/" + System.getProperty("integrationtest.contextpath");
  }
  
  protected int getPort() {
    return Integer.parseInt(System.getProperty("integrationtest.serverport"), 10);
  }
  
  protected URL getAppUrl(String path) throws MalformedURLException {
    return new URL(PROTOCOL, getHostname(), getPort(), getContextPath() + path);
  }
 
  protected boolean checkServerUp() {
    try {
      URL indexUrl = getAppUrl("/");
      HttpURLConnection httpUrlConnection = (HttpURLConnection) indexUrl.openConnection();
      return httpUrlConnection.getResponseCode() == HttpURLConnection.HTTP_OK;
    } catch (IOException e) {
      return false;
    }
  }
  
  protected String getStudent1Username() {
    return STUDENT1_USERNAME;
  }
  
  protected String getStudent1Password() {
    return STUDENT1_PASSWORD;
  }

  @Before
  public void setUp() throws Exception {
    Connection connection = getConnection();
    try {
      connection.setAutoCommit(true);
      
      String[] files = new String[] {};
      
      for (Method method : getClass().getMethods()) {
        if (method.getName() == testName.getMethodName()) {
          files = method.getAnnotation(TestSqlFiles.class).value();
          break;
        }
      }
      
      for (String file : files) {
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
      
      String[] files = new String[] {};
      
      for (Method method : getClass().getMethods()) {
        if (method.getName() == testName.getMethodName()) {
          files = method.getAnnotation(TestSqlFiles.class).value();
          break;
        }
      }
      
      for (String file : files) {
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
  
  private RemoteWebDriver driver;
}

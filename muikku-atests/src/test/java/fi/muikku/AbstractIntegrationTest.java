package fi.muikku;

import static com.jayway.restassured.RestAssured.given;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.joda.time.DateTime;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.junit.rules.TestWatcher;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;

public abstract class AbstractIntegrationTest extends TestWatcher {

  @Rule
  public TestName testName = new TestName();

  @Before
  public void baseSetupSql() throws Exception {
    String methodName = testName.getMethodName();
    int paramIndex = methodName.indexOf('[');
    if (paramIndex > 0) {
      methodName = methodName.substring(0, paramIndex);
    }
    Method method = getClass().getMethod(methodName, new Class<?>[] {});
    SqlBefore annotation = method.getAnnotation(SqlBefore.class);
    if (annotation != null) {
      String[] sqlFiles = annotation.value();

      if (sqlFiles != null && sqlFiles.length > 0) {
        Connection connection = getConnection();
        try {
          for (String sqlFile : sqlFiles) {
            runSql(connection, sqlFile);
          }
          connection.commit();
        } finally {
          connection.close();
        }
      }
    }
  }
  
  @After
  public void baseTearDownSql() throws Exception {
    String methodName = testName.getMethodName();
    int paramIndex = methodName.indexOf('[');
    if (paramIndex > 0) {
      methodName = methodName.substring(0, paramIndex);
    }
    Method method = getClass().getMethod(methodName, new Class<?>[] {});
    SqlAfter annotation = method.getAnnotation(SqlAfter.class);
    if (annotation != null) {
      String[] sqlFiles = annotation.value();

      if (sqlFiles != null && sqlFiles.length > 0) {
        Connection connection = getConnection();
        try {
          for (String sqlFile : sqlFiles) {
            runSql(connection, sqlFile);
          }
          connection.commit();
        } finally {
          connection.close();
        }
      }
    }
  }

  private void runSql(Connection connection, String file) throws IOException, SQLException {
    ClassLoader classLoader = getClass().getClassLoader();
    InputStream sqlStream = classLoader.getResourceAsStream(file);
    if (sqlStream != null) {
      try {
        String sqlString = IOUtils.toString(sqlStream);
        Pattern commentPattern = Pattern.compile("--.*$", Pattern.MULTILINE);
        sqlString = commentPattern.matcher(sqlString).replaceAll("");
        String[] sqls = sqlString.split(";(?=([^\']*\'[^\']*\')*[^\']*$)"); // Quote-aware split on ';'
        for (String sql : sqls) {
          sql = sql.trim();
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

  protected Boolean webhookCall(String url, String payload) throws Exception {
    String signature = "38c6cbd28bf165070d070980dd1fb595";
    CloseableHttpClient client = HttpClients.createDefault();
    try {
      HttpPost httpPost = new HttpPost(url);
      try {
        StringEntity dataEntity = new StringEntity(payload);
        try {
          httpPost.addHeader("X-Pyramus-Signature", signature);
          httpPost.setEntity(dataEntity);
          client.execute(httpPost);
          return true;
        } finally {
          EntityUtils.consume(dataEntity);
        }
      } finally {
        httpPost.releaseConnection();
      }
    } finally {
      client.close();
    }
  }
  
  private Connection getConnection() throws SQLException, ClassNotFoundException {
    Class.forName(getJdbcDriver());
    return DriverManager.getConnection(getJdbcUrl(), getJdbcUsername(), getJdbcPassword());
  }

  protected String getAppUrl() {
    return getAppUrl(false);
  }

  protected String getAppUrl(boolean secure) {
    return (secure ? "https://" : "http://") + getHost() + ':' + (secure ? getPortHttps() : getPortHttp());
  }

  protected String getJdbcDriver() {
    return System.getProperty("it.jdbc.driver");
  }

  protected String getJdbcUrl() {
    return System.getProperty("it.jdbc.url");
  }

  protected String getJdbcJndi() {
    return System.getProperty("it.jdbc.jndi");
  }

  protected String getJdbcUsername() {
    return System.getProperty("it.jdbc.username");
  }

  protected String getJdbcPassword() {
    return System.getProperty("it.jdbc.password");
  }

  protected String getHost() {
    return System.getProperty("it.host");
  }

  protected int getPortHttp() {
    return Integer.parseInt(System.getProperty("it.port.http"));
  }

  protected int getPortHttps() {
    return Integer.parseInt(System.getProperty("it.port.https"));
  }

  protected String getKeystoreFile() {
    return System.getProperty("it.keystore.file");
  }

  protected String getKeystoreAlias() {
    return System.getProperty("it.keystore.alias");
  }

  protected String getKeystorePass() {
    return System.getProperty("it.keystore.storepass");
  }
  
  protected String getSauceUsername() {
    return System.getProperty("it.sauce.username");
  }

  protected String getSauceAccessKey() {
    return System.getProperty("it.sauce.accessKey");
  }

  protected String getSauceTunnelId() {
    return System.getProperty("it.sauce.tunnelId");
  }
  
  public String getProjectVersion() {
    return System.getProperty("it.project.version");
  }

  protected DateTime getDate(int year, int monthOfYear, int dayOfMonth) {
    return new DateTime(year, monthOfYear, dayOfMonth, 0, 0, 0, 0);
  }
  
  protected RequestSpecification asAdmin() {
    RequestSpecification request = RestAssured.given();
    if (adminSessionId == null) {
      adminSessionId = loginAs(RoleType.ENVIRONMENT, "ADMINISTRATOR");
    }
    
    return request.cookie("JSESSIONID", adminSessionId);
  }
  
  protected RequestSpecification asManager() {
    RequestSpecification request = RestAssured.given();
    if (managerSessionId == null) {
      managerSessionId = loginAs(RoleType.ENVIRONMENT, "MANAGER");
    }
    
    return request.cookie("JSESSIONID", managerSessionId);
  }

  protected RequestSpecification asTeacher() {
    RequestSpecification request = RestAssured.given();
    if (teacherSessionId == null) {
      teacherSessionId = loginAs(RoleType.ENVIRONMENT, "TEACHER");
    }
    
    return request.cookie("JSESSIONID", teacherSessionId);
  }

  protected RequestSpecification asStudent() {
    RequestSpecification request = RestAssured.given();
    if (studentSessionId == null) {
      studentSessionId = loginAs(RoleType.ENVIRONMENT, "STUDENT");
    }
    
    return request.cookie("JSESSIONID", studentSessionId);
  }
  
  private static String loginAs(RoleType type, String role) {
    Response response = given()
      .contentType("application/json")
      .get("/test/login?role=" + getFullRoleName(type, role));
    return response.getCookie("JSESSIONID");
  }

  private static String getFullRoleName(RoleType roleType, String role) {
    return roleType.name() + "-" + role;
  }
  
  enum RoleType {
    PSEUDO,
    ENVIRONMENT,
    WORKSPACE
  }

  private String adminSessionId;
  private String managerSessionId;
  private String teacherSessionId;
  private String studentSessionId;
}

package fi.otavanopisto.muikku;

import static io.restassured.RestAssured.given;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

public abstract class AbstractIntegrationTest {

  public AbstractIntegrationTest() {
    this.tools = new MuikkuTestTools(this);
  }
  
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
  
  public Date date(int year, int month, int date) {
    Calendar calendar = Calendar.getInstance();
    calendar.set(1900 + year, month, date, 0, 0, 0);
    return calendar.getTime();
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

  protected long getUserIdByEmail(String email) throws SQLException, ClassNotFoundException{
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(
          String.format(
              "SELECT usdi.userEntity_id AS result "
                  + "FROM UserEmailEntity uee "
                  + "INNER JOIN UserSchoolDataIdentifier usdi "
                  + "ON uee.userSchoolDataIdentifier_id = usdi.id "
                  + "WHERE uee.address = '%s'",
                  email));
      ResultSet results = statement.getResultSet();
      long user_id = 0;
      while (results.next()) {              
        user_id = results.getLong("result");
      }
      return user_id;
    } finally {
      connection.close();
    }
  }
  
  protected String getWorkspaceUserEntityIdByPyramusId(String pyramusId) throws SQLException, ClassNotFoundException{
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(
          String.format(
              "SELECT id AS result "
                  + "FROM workspaceUserEntity "
                  + "WHERE identifier = '%s'",
                  pyramusId));
      ResultSet results = statement.getResultSet();
      String user_id = "";
      while (results.next()) {              
        user_id = results.getString("result");
      }
      return user_id;
    } finally {
      connection.close();
    }
  }
  
  protected String getLatestCeeposOrderId() throws SQLException, ClassNotFoundException {
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute("SELECT id AS result "
                  + "FROM CeeposOrder "
                  + "ORDER BY id DESC "
                  + "LIMIT 1");
      ResultSet results = statement.getResultSet();
      String orderId = "";
      while (results.next()) {              
        orderId = results.getString("result");
      }
      return orderId;
    } finally {
      connection.close();
    }
  }
  
  protected String getNextCeeposOrderId() throws ClassNotFoundException, SQLException {
    String orderId = getLatestCeeposOrderId();
    if (orderId == "") {
      orderId = "1";
    } else {
      orderId = String.valueOf(Long.parseLong(orderId) + 1);
    }
    return orderId;  
  }
  
  protected void updateWorkspaceAccess(WorkspaceAccess access, String urlName) throws SQLException, ClassNotFoundException{
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(
          String.format(
              "UPDATE WorkspaceEntity "
                  + "SET access = '%s'"
                  + "WHERE urlName = '%s'",
                  access, urlName));
    } finally {
      connection.close();
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
  
  protected Connection getConnection() throws SQLException, ClassNotFoundException {
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

  public File getTestFile() {
    return new File(System.getProperty("it.test.file"));
  }
  
  protected String getTestStudent() {
    return System.getProperty("it.test.student");
  }
  
  protected String getTestStudentPassword() {
    return System.getProperty("it.test.student.password");
  }
  
  protected String getTestAdmin() {
    return System.getProperty("it.test.admin");
  }
  
  protected String getTestAdminPassword() {
    return System.getProperty("it.test.admin.password");
  }
  
  protected OffsetDateTime getDate(int year, int monthOfYear, int dayOfMonth) {
    return OffsetDateTime.of(year, monthOfYear, dayOfMonth, 0, 0, 0, 0, ZoneOffset.UTC);
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
  
  protected RequestSpecification asEveryone() {
    RequestSpecification request = RestAssured.given();
    if (everyoneSessionId == null) {
      everyoneSessionId = loginAs(RoleType.PSEUDO, "EVERYONE");
    }
    
    return request.cookie("JSESSIONID", everyoneSessionId);
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
  
  protected Long getUserEntityIdForIdentifier(String identifier) throws SQLException, ClassNotFoundException {
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(String.format("select userEntity_id from UserSchoolDataIdentifier where identifier = '%s'", identifier));
      ResultSet results = statement.getResultSet();
      if (results.next()) {              
        Long id = results.getLong(1);
        return id;
      }
    } finally {
      connection.close();
    }
    
    return null;
  }
  
  protected Long getWorkspaceEntityIdForIdentifier(String identifier) throws SQLException, ClassNotFoundException {
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(String.format("select id from WorkspaceEntity where identifier = '%s'", identifier));
      ResultSet results = statement.getResultSet();
      if (results.next()) {              
        Long id = results.getLong(1);
        return id;
      }
    } finally {
      connection.close();
    }
    
    return null;
  }
  
  protected void dumpWorkspaceUsers() throws SQLException, ClassNotFoundException {
    System.out.println("Dumping all workspace users");
    
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(String.format("SELECT id, identifier, workspaceEntity_id, userSchoolDataIdentifier_id, workspaceUserRole_id, archived FROM workspaceuserentity"));
      ResultSet results = statement.getResultSet();
      while (results.next()) {              
        Long id = results.getLong(1);
        String identifier = results.getString(2);
        Long workspaceEntityId = results.getLong(3);
        Long userSchoolDataIdentifierId = results.getLong(4);
        Long workspaceUserRoleId = results.getLong(5);
        Boolean archived = results.getBoolean(6);
        
        System.out.println(String.format("#%d (%s), ws: %d, u: %d, r: %d, a: (%b)", id, identifier, workspaceEntityId, userSchoolDataIdentifierId, workspaceUserRoleId, archived));
      }
    } finally {
      connection.close();
    }
  }
  
  protected void dumpWorkspaces() throws SQLException, ClassNotFoundException {
    System.out.println("Dumping all workspaces");
    
    Connection connection = getConnection();
    try {
      Statement statement = connection.createStatement();
      statement.execute(String.format("SELECT id, identifier, archived FROM workspaceentity"));
      ResultSet results = statement.getResultSet();
      while (results.next()) {              
        Long id = results.getLong(1);
        String identifier = results.getString(2);
        Boolean archived = results.getBoolean(3);
        
        System.out.println(String.format("#%d (%s), ar:%b", id, identifier, archived));
      }
    } finally {
      connection.close();
    }
  }
  
  protected String getResourceContents(String file) throws IOException {
    ClassLoader classLoader = getClass().getClassLoader();
    InputStream inputStream = classLoader.getResourceAsStream(file);
    String content = IOUtils.toString(inputStream, StandardCharsets.UTF_8.name());
    return content;
 }
  
  enum RoleType {
    PSEUDO,
    ENVIRONMENT,
    WORKSPACE
  }

  public MuikkuTestTools tools() {
    return tools;
  }
  
  private String adminSessionId;
  private String managerSessionId;
  private String teacherSessionId;
  private String studentSessionId;
  private String everyoneSessionId;
  private MuikkuTestTools tools;
}

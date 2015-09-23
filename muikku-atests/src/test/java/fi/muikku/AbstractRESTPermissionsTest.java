package fi.muikku;

import static com.jayway.restassured.RestAssured.given;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Before;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;

import fi.muikku.model.users.EnvironmentRoleArchetype;

public abstract class AbstractRESTPermissionsTest extends AbstractRESTTest {
  
  @Before
  public void createRoleAccessToken() {
    Response response = given()
        .contentType("application/json")
        .get("/test/login?role=" + getFullRoleName());

    String accessToken = response.getCookie("JSESSIONID");
    setAccessToken(accessToken);

//    System.out.println("Accesstoken: " + accessToken);
//    System.out.println("Admin accesstoken: " + adminAccessToken);
  }
  
  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }
  
  public Long getUserIdForRole(String role) {
    // TODO: could this use the /system/whoami end-point?
    return Common.ROLEUSERS.get(role);
  }
  
  public RequestSpecification asRole() {
    RequestSpecification reSpect = RestAssured.given();
    if (accessToken != null) {
//      System.out.println("Setting request cookie: " + accessToken);
      reSpect = reSpect.cookie("JSESSIONID", accessToken);
    }
    
    return reSpect;
  }
//
//  public boolean roleIsAllowed(MuikkuPermissionCollection permissionCollection, String permission) throws NoSuchFieldException {
//    boolean roleIsAllowed = hasEveryonePermission(permissionCollection, permission);
//    
//    if (!roleIsAllowed) {
//      switch (getRoleType()) {
//        case PSEUDO:
//          String[] defaultPseudoRoles = permissionCollection.getDefaultPseudoRoles(permission);
//          
//          if (defaultPseudoRoles != null) {
//            for (String dpr : defaultPseudoRoles) {
//              if (dpr.equals(getRole())) {
//                roleIsAllowed = true;
//                break;
//              }
//            }
//          }
//        break;
//        
//        case ENVIRONMENT:
//          List<fi.muikku.model.users.EnvironmentRoleArchetype> allowedRoles = asList(permissionCollection.getDefaultEnvironmentRoles(permission));
//  
//          EnvironmentRoleArchetype environmentRoleArchetype = EnvironmentRoleArchetype.valueOf(getRole());
//          
//          if (allowedRoles != null) {
//            for (fi.muikku.model.users.EnvironmentRoleArchetype str : allowedRoles) {
//              if (str.equals(environmentRoleArchetype)) {
//                roleIsAllowed = true;
//                break;
//              }
//            }
//          }
//        break;
//        
//        case WORKSPACE:
//          WorkspaceRoleArchetype[] defaultWorkspaceRoles = permissionCollection.getDefaultWorkspaceRoles(permission);
//  
//          WorkspaceRoleArchetype workspaceRoleArchetype = WorkspaceRoleArchetype.valueOf(getRole());
//          
//          if (defaultWorkspaceRoles != null) {
//            for (WorkspaceRoleArchetype dwr : defaultWorkspaceRoles) {
//              if (dwr.equals(workspaceRoleArchetype)) {
//                roleIsAllowed = true;
//                break;
//              }
//            }
//          }
//        break;
//      }
//    }
//    
//    return roleIsAllowed;
//  }
//
//  public void assertOk(Response response, MuikkuPermissionCollection permissionCollection, String permission) throws NoSuchFieldException {
//    assertOk(response, permissionCollection, permission, 200);
//  }
//  
//  public void assertOk(Response response, MuikkuPermissionCollection permissionCollection, String permission, int successStatusCode) throws NoSuchFieldException {
//    boolean roleIsAllowed = roleIsAllowed(permissionCollection, permission);
//
//    if (roleIsAllowed) {
////      System.out.println(permission + " @ " + getRoleType().name() + '-' + getRole() + " should be " + successStatusCode + " was " + response.statusCode());
//      response.then().assertThat().statusCode(successStatusCode);
//    } else {
////      System.out.println(permission + " @ " + getRoleType().name() + '-' + getRole() + " should be 403 was " + response.statusCode());
//      response.then().assertThat().statusCode(403);
//    }
//  }
//  
//  private boolean hasEveryonePermission(MuikkuPermissionCollection permissionCollection, String permission) throws NoSuchFieldException {
//    String[] defaultPseudoRoles = permissionCollection.getDefaultPseudoRoles(permission);
//    
//    if (defaultPseudoRoles != null) {
//      for (String dpr : defaultPseudoRoles) {
//        if (SystemRoleType.EVERYONE.name().equals(dpr)) {
//          return true;
//        }
//      }
//    }
//    
//    return false;
//  }

  @SafeVarargs
  private static <T> List<T> asList(T... stuff) {
    if (stuff != null)
      return Arrays.asList(stuff);
    else
      return new ArrayList<T>();
  }

  public static List<Object[]> getGeneratedRoleData() {
    // The parameter generator returns a List of
    // arrays. Each array has two elements: { role }.
    
    List<Object[]> data = new ArrayList<Object[]>();
    
    data.add(new Object[] {
      "PSEUDO-EVERYONE"
    });
      
    for (EnvironmentRoleArchetype role : EnvironmentRoleArchetype.values()) {
      if (role != EnvironmentRoleArchetype.CUSTOM) {
        data.add(new Object[] { 
          getFullRoleName(RoleType.ENVIRONMENT, role.name())
        });
      }
    }
    
    return data;
  }
  
  protected String getRole() {
    return role;
  }

  protected void setRole(String role) {
    if (role.startsWith(ROLEPREFIX_PSEUDO)) {
      roleType = RoleType.PSEUDO;
      
      this.role = role.substring(ROLEPREFIX_PSEUDO.length());
    }
    
    if (role.startsWith(ROLEPREFIX_ENVIRONMENT)) {
      roleType = RoleType.ENVIRONMENT;
      
      this.role = role.substring(ROLEPREFIX_ENVIRONMENT.length());
    }

    if (role.startsWith(ROLEPREFIX_WORKSPACE)) {
      roleType = RoleType.WORKSPACE;
      
      this.role = role.substring(ROLEPREFIX_WORKSPACE.length());
    }
  }

  protected RoleType getRoleType() {
    return roleType;
  }
  
  protected String getFullRoleName() {
    return getFullRoleName(getRoleType(), getRole());
  }

  private static String ROLEPREFIX_PSEUDO = "PSEUDO-";
  private static String ROLEPREFIX_ENVIRONMENT = "ENVIRONMENT-";
  private static String ROLEPREFIX_WORKSPACE = "WORKSPACE-";
  
  private String role;
  private RoleType roleType;
  
  private String accessToken;
}

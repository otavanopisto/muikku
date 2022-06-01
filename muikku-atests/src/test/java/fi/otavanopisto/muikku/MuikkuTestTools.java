package fi.otavanopisto.muikku;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertNotNull;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;
import io.restassured.response.Response;

import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.pyramus.rest.model.Course;

public class MuikkuTestTools {

  private AbstractIntegrationTest integrationTest;

  public MuikkuTestTools(AbstractIntegrationTest integrationTest) {
    this.integrationTest = integrationTest;
  }
  
  public Workspace createWorkspace(Course course, Boolean published) throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    Builder mockBuilder = mocker();
    
    mockBuilder
      .addCourse(course)
      .build();
    
    Workspace payload = new Workspace(null, course.getName(), null, "PYRAMUS", String.valueOf(course.getId()), published);
    Response response = integrationTest.asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces");
    
    response.then()
      .statusCode(200);
      
    Workspace workspace = objectMapper.readValue(response.asString(), Workspace.class);
    assertNotNull(workspace);
    assertNotNull(workspace.getId());
    
    return workspace;
  }
  
  public void deleteWorkspace(Workspace workspace) throws Exception {
    Builder mockBuilder = mocker();
    
    mockBuilder
      .removeCourse(workspace.getId())
      .build();
    
    integrationTest.asAdmin()
      .delete("/test/workspaces/{WORKSPACEID}", workspace.getId())
      .then()
      .statusCode(204);
  }
  
}

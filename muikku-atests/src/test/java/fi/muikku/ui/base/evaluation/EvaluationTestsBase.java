package fi.muikku.ui.base.evaluation;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.equalToJson;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static fi.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import org.joda.time.DateTime;
import org.junit.Test;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.TestUtilities;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;
import fi.muikku.mock.PyramusMock.Builder;
import fi.muikku.mock.model.MockCourseStudent;
import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;
import fi.pyramus.rest.model.CourseAssessment;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.UserRole;

public class EvaluationTestsBase extends AbstractUITest {

  @Test
  public void evaluateStudentWorkspaceMaterialTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).build();
      
      Long courseId = 1l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();
      
      try {
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
          "EVALUATED");
        
        Long assessorId = getUserEntityIdForIdentifier(String.format("STAFF-%s", admin.getId()));
        
        logout();
        mockBuilder.mockLogin(student).build();
        login();
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
          assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
          assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
          waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          waitAndClick(String.format("#page-%d .muikku-submit-assignment", htmlMaterial.getId()));
          waitForPresentAndVisible(".notification-queue-item-success");
          waitForElementToBeClickable(String.format("#page-%d .muikku-withdraw-assignment", htmlMaterial.getId()));
          logout();
          mockBuilder.mockLogin(admin).build();
          login();
          navigate(String.format("/evaluation"), true);
          waitAndClick("#filter-students-by-assessment-requested");
          waitAndClick(".assignment-submitted");
          waitAndClick(".cke_contents");
          getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
          selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
          selectOption("select[name='assessor']", assessorId.toString());
          click(".save-evaluation-button");
          waitForPresentAndVisible(".evaluation-assignment-wrapper");
          assertClassPresent(".evaluation-assignment-wrapper", "assignment-evaluated");
          waitAndClick(".assignment-submitted");
          waitForPresent("#grade");
          assertValue("#grade", "1/PYRAMUS@1/PYRAMUS");
          waitForPresent("select[name='assessor']");
          assertValue("select[name='assessor']", assessorId.toString());
          waitForPresent(".cke_contents");
          assertEquals("Test evaluation." ,getCKEditorContent());
        }finally{
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void reEvaluateStudentWorkspaceMaterialTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      Long courseId = 1l;
      
      login();
    
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();
    
      try {
        
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
          "EVALUATED");
        try {
          Long assessorId = getUserEntityIdForIdentifier(String.format("STAFF-%s", admin.getId()));
          
          logout();
          
          mockBuilder
            .mockLogin(student)
            .build();
          
          login();
          
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
          assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
          assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
          waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          waitAndClick(String.format("#page-%d .muikku-submit-assignment", htmlMaterial.getId()));
          waitForPresentAndVisible(".notification-queue-item-success");
          waitForElementToBeClickable(String.format("#page-%d .muikku-withdraw-assignment", htmlMaterial.getId()));
          
          logout();
          
          mockBuilder
            .mockLogin(admin)
            .build();
          login();
          
          navigate(String.format("/evaluation"), true);
          waitAndClick("#filter-students-by-assessment-requested");
          waitAndClick(".assignment-submitted");
          waitAndClick(".cke_contents");
          getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
          selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
          selectOption("select[name='assessor']", assessorId.toString());
          click(".save-evaluation-button");
          waitForPresentAndVisible(".evaluation-assignment-wrapper");
          assertClassPresent(".evaluation-assignment-wrapper", "assignment-evaluated");
          
//        Re-evaluation
          waitAndClick(".assignment-submitted");
          waitForPresent("#grade");
          assertValue("#grade", "1/PYRAMUS@1/PYRAMUS");
          waitForPresent("select[name='assessor']");
          assertValue("select[name='assessor']", assessorId.toString());
          waitForPresent(".cke_contents");
          assertEquals("Test evaluation.", getCKEditorContent());
          
          waitAndClick(".cke_contents");
          getWebDriver().switchTo().activeElement().sendKeys("Test evaluation in re-evaluation.");
          selectOption("#grade", "2/PYRAMUS@1/PYRAMUS");
          selectOption("select[name='assessor']", assessorId.toString());
          click(".save-evaluation-button");
          waitForPresentAndVisible(".evaluation-assignment-wrapper");
          waitAndClick(".assignment-submitted");
          waitForPresent("#grade");
          assertValue("#grade", "2/PYRAMUS@1/PYRAMUS");
          waitForPresent("select[name='assessor']");
          assertValue("select[name='assessor']", assessorId.toString());
          waitForPresent(".cke_contents");
          assertEquals("Test evaluation.Test evaluation in re-evaluation.", getCKEditorContent());
        
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
        
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void evaluateWorkspaceStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      Long courseId = 1l;
      
      login();
    
      Workspace workspace = createWorkspace("testcourse", "test course for testing", courseId.toString(), Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();

      try {
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
          "EVALUATED");
        try {
          Long assessorId = getUserEntityIdForIdentifier(String.format("STAFF-%s", admin.getId()));
          
          logout();
          
          mockBuilder
            .mockLogin(student)
            .build();
          
          login();
          
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
          assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
          assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
          waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          waitAndClick(String.format("#page-%d .muikku-submit-assignment", htmlMaterial.getId()));
          waitForPresentAndVisible(".notification-queue-item-success");
          waitForElementToBeClickable(String.format("#page-%d .muikku-withdraw-assignment", htmlMaterial.getId()));
          
          logout();
          
          mockBuilder
            .mockLogin(admin)
            .build();
          
          login();
          
          ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);
          
          // TODO: Move to new mocker
          DateTime assessmentCreated = new DateTime(2015, 2, 2, 0, 0, 0, 0);
          CourseAssessment courseAssessment = new CourseAssessment(1l, courseStudent.getId(), 1l, 1l, admin.getId(), assessmentCreated, "Test evaluation.");
          stubFor(post(urlMatching(String.format("/1/students/students/%d/courses/%d/assessments/", student.getId(), courseStudent.getCourseId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(objectMapper.writeValueAsString(courseAssessment))
              .withStatus(200)));

          navigate(String.format("/evaluation"), true);
          waitAndClick("#filter-students-by-assessment-requested");
          waitAndClick(".evaluation-student-loaded");
          waitAndClick(".cke_contents");
          getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
          clearElement("#evaluationDate");
          sendKeys("#evaluationDate", "2.12.2015");
          selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
          selectOption("select[name='assessor']", assessorId.toString());
          click(".save-evaluation-button");
  //        There's no JSONComparator that allows different values. And since dev machine and travis testing gives different dates we can not test requestBody with CourseAssessment model.
          
          CourseAssessment cAss = new fi.pyramus.rest.model.CourseAssessment(null, courseStudent.getId(), 1l, 1l, admin.getId(), null, "<p>Test evaluation.</p>\n");
          verify(postRequestedFor(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/", student.getId(), courseId)))
            .withHeader("Content-Type", equalTo("application/json"))
            .withRequestBody(equalToJson(objectMapper.writeValueAsString(cAss), wiremock.org.skyscreamer.jsonassert.JSONCompareMode.LENIENT)));

          PyramusMocks.mockAssessedStudent1Workspace1(courseStudent, assessorId);
          
          waitForPresentAndVisible(".evaluation-assignment-wrapper");
          assertClassPresent(".evaluation-student-wrapper", "workspace-evaluated");
          
          waitAndClick(".evaluation-student-loaded");
          waitForPresent("#grade");
          assertValue("#grade", "1/PYRAMUS@1/PYRAMUS");
          waitForPresent("select[name='assessor']");
          assertValue("select[name='assessor']", assessorId.toString());
          waitForPresent(".cke_contents");
          assertEquals("Test evaluation." ,getCKEditorContent());
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
      
  } finally {
    mockBuilder.wiremockReset();
  }
  }
  
  
}
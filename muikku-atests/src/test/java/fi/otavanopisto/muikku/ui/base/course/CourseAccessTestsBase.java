package fi.otavanopisto.muikku.ui.base.course;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseAccessTestsBase extends AbstractUITest {
  
  @Test
  public void notLoggedInAnyoneCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"ANYONE\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.clearLoginMock();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void loggedInAnyoneCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"ANYONE\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseStudentAnyoneCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"ANYONE\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void notLoggedInLoggedInCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"LOGGED_IN\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.clearLoginMock();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);
        assertNotPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void loggedInLoggedInCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"LOGGED_IN\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseStudentLoggedInCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"LOGGED_IN\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void notLoggedInMembersOnlyCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"MEMBERS_ONLY\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.clearLoginMock();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertNotPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void loggedInMembersOnlyCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"MEMBERS_ONLY\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForVisible(".workspace-management-name input");
        waitForNotVisible(".loading");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertNotPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseStudentMembersOnlyCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), true);
        waitAndClick(".additionalinfo-data div input[value=\"MEMBERS_ONLY\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        waitForVisible(".workspace-management-name input");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), true);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
}

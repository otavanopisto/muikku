package fi.otavanopisto.muikku.ui.base.course;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import org.openqa.selenium.By;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.WorkspaceAccess;
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
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void notLoggedInAnyoneCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      try{
        updateWorkspaceAccess(WorkspaceAccess.ANYONE, workspace.getUrlName());
        logout();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        selectFinnishLocale();
        assertTextIgnoreCase(".panel--workspace-signup .panel__header-title", "Opiskelijaksi kurssille");
        assertTextIgnoreCase(".panel--workspace-signup .panel__body-content--signup", "Haluaisitko suorittaa tämän kurssin? Tutustu opiskeluvaihtoehtoihin Muikun etusivulla.");
        assertTextIgnoreCase(".panel--workspace-signup .button--signup-read-more", "Lue lisää");
        selectEnglishLocale();
        assertTextIgnoreCase(".panel--workspace-signup .panel__header-title", "Attending this course");
        assertTextIgnoreCase(".panel--workspace-signup .panel__body-content--signup", "Would you like to attend this course? You can checkout different studying options from the front page of Muikku.");
        assertTextIgnoreCase(".panel--workspace-signup .button--signup-read-more", "Read more");
        click(".panel--workspace-signup .button--signup-read-more");
        waitForPresent("#studying");
        assertTrue("Read more button did not return to frontpage", getCurrentPath().equals("/"));
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void loggedInAnyoneCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        updateWorkspaceAccess(WorkspaceAccess.ANYONE, workspace.getUrlName());
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void courseStudentAnyoneCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        updateWorkspaceAccess(WorkspaceAccess.ANYONE, workspace.getUrlName());
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void notLoggedInLoggedInCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        updateWorkspaceAccess(WorkspaceAccess.LOGGED_IN, workspace.getUrlName());
        logout();
        mockBuilder.clearLoginMock();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        assertNotPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void loggedInLoggedInCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        updateWorkspaceAccess(WorkspaceAccess.LOGGED_IN, workspace.getUrlName());
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void courseStudentLoggedInCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        updateWorkspaceAccess(WorkspaceAccess.LOGGED_IN, workspace.getUrlName());
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void notLoggedInMembersOnlyCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        updateWorkspaceAccess(WorkspaceAccess.MEMBERS_ONLY, workspace.getUrlName());
        logout();
        mockBuilder.clearLoginMock();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertNotPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void loggedInMembersOnlyCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try{
        updateWorkspaceAccess(WorkspaceAccess.MEMBERS_ONLY, workspace.getUrlName());
        logout();
        mockBuilder.clearLoginMock();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertNotPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void courseStudentMembersOnlyCourseAccessTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        updateWorkspaceAccess(WorkspaceAccess.MEMBERS_ONLY, workspace.getUrlName());
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
        assertPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
}

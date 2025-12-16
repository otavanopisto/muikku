package fi.otavanopisto.muikku.ui.base.course;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
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
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    Course course1 = new CourseBuilder().name("Test").id((long) 1).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addCourse(course1)
    .mockLogin(admin)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        waitForExpectedText(".hero__workspace-title", "Test", 10, 1000 );
        updateWorkspaceAccessInUI("workspaceAccessAnyone", workspace);
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        logout();
        mockBuilder.clearLoginMock();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        selectFinnishLocale();
        assertTextIgnoreCase(".panel--workspace-signup .panel__header-title", "Opiskelijaksi kurssille");
        assertTextIgnoreCase(".panel--workspace-signup .panel__body-content--signup", "Haluaisitko suorittaa tämän kurssin? Tutustu opiskeluvaihtoehtoihin Muikun etusivulla.");
        assertTextIgnoreCase(".panel--workspace-signup .button--signup-read-more", "Lue lisää");
        selectEnglishLocale();
        assertTextIgnoreCase(".panel--workspace-signup .panel__header-title", "Sign up to this course");        
        assertTextIgnoreCase(".panel--workspace-signup .panel__body-content--signup", "Would you like to sign up for this course? see your options to do so on muikku's front page.");
        assertTextIgnoreCase(".panel--workspace-signup .button--signup-read-more", "Read more");
        click(".panel--workspace-signup .button--signup-read-more");
        waitForPresent("#studying");
        assertTrue("Read more button did not return to frontpage", getCurrentPath().equals("/"));
    }finally{
      deleteWorkspace(workspace.getId());
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
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        updateWorkspaceAccessInUI("workspaceAccessAnyone", workspace);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".hero--workspace h1.hero__workspace-title");
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
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
      login();
      

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        updateWorkspaceAccessInUI("workspaceAccessAnyone", workspace);
        logout(); // logout admin
        
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".hero--workspace h1.hero__workspace-title");
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
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    Course course1 = new CourseBuilder().name("Test").id((long) 1).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addCourse(course1)
    .mockLogin(admin)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToAppear(".hero__workspace-title", 10, 1000);
      updateWorkspaceAccessInUI("workspaceAccessLoggedin", workspace);
      logout();
      mockBuilder.clearLoginMock();
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      assertTextIgnoreCase("div#loginRequired", "Kirjaudu sisään");
      assertNotPresent(".hero--workspace h1.hero__workspace-title");
    }finally{
      deleteWorkspace(workspace.getId());
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
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        updateWorkspaceAccessInUI("workspaceAccessLoggedin", workspace);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".hero--workspace h1.hero__workspace-title");
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
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        updateWorkspaceAccessInUI("workspaceAccessLoggedin", workspace);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertPresent(".hero--workspace h1.hero__workspace-title");
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
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    Course course1 = new CourseBuilder().name("Test").id((long) 1).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addCourse(course1)
    .mockLogin(admin)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    try{
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForElementToAppear(".hero__workspace-title", 10, 1000);
      updateWorkspaceAccessInUI("workspaceAccessMembers", workspace);
      logout();
      mockBuilder.clearLoginMock();
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      assertTextIgnoreCase("div#loginRequired", "Kirjaudu sisään");
      assertNotPresent(".hero--workspace h1.hero__workspace-title");
    }finally{
      deleteWorkspace(workspace.getId());
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
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        updateWorkspaceAccessInUI("workspaceAccessMembers", workspace);
        logout();
        mockBuilder.clearLoginMock();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);        
        assertNotPresent(".hero--workspace h1.hero__workspace-title");
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
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForElementToAppear(".hero__workspace-title", 10, 1000);
        updateWorkspaceAccessInUI("workspaceAccessMembers", workspace);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".hero--workspace h1.hero__workspace-title");
        assertPresent(".hero--workspace h1.hero__workspace-title");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
}

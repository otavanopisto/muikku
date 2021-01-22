package fi.otavanopisto.muikku.wcag.course;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Discussion;
import fi.otavanopisto.muikku.atests.DiscussionGroup;
import fi.otavanopisto.muikku.atests.DiscussionThread;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.atests.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseAT extends AbstractWCAGTest{
  
  @Test
  public void materialsViewTest () throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course = new CourseBuilder().name("Test").id((long) 1).description("test course for testing").buildCourse();
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course.getId(), student.getId());
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addStudent(student)
      .addCourse(course)
      .build();
      login();
      Workspace workspace = createWorkspace(course, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course.getId(), courseStaffMember)
        .addCourseStudent(course.getId(), courseStudent)
        .build();
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><h1>Heading</h1><p>Material text.</p></body></html>", 
          "EXERCISE");
      
      WorkspaceHtmlMaterial htmlMaterial2 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "2.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><h1>Heading</h1><p>Material text.</p></body></html>", 
          "EVALUATED");
      try{
//  TODO: Make sure no AC problems introduced in the material
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForVisible(".hero__workspace-title");
        testAccessibility("Workspace frontpage.");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForVisible(".material-page");
        testAccessibility("Workspace materials view");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial2.getId());
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void discussionViewTest () throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id(2l).description("test course for testing").buildCourse();
    MockCourseStudent courseStudent = new MockCourseStudent(2l, course1.getId(), student.getId());
    mockBuilder.addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
    login();

    Workspace workspace = createWorkspace(course1, Boolean.TRUE);   
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    DiscussionThread thread = createWorkspaceDiscussionThread(workspace.getId(), discussion.getGroupId(), discussion.getId(),
        "Workspace discussion title", "Message is here.", false, false);
    try{
      logout();
      mockBuilder.addStudent(student).addCourseStudent(course1.getId(), courseStudent).mockLogin(student).build();
      login();
      navigate(String.format("/workspace/%s/discussions", workspace.getUrlName()), false);
      waitForVisible(".application-panel--discussion");
      testAccessibility("Workspace discussions view");
      waitAndClick(".application-list .message--discussion");
      waitForVisible(".application-list__item--discussion-message");
      testAccessibility("Workspace discussions single message");
      navigate(String.format("/workspace/%s/discussions", workspace.getUrlName()), false);
      waitForVisible(".application-panel--discussion");
      waitAndClick(".application-panel__helper-container--discussion a.button--primary-function");
      waitForVisible(".env-dialog__header");
      testAccessibility("Workspace discussions new message");
    }finally {
      deleteWorkspaceDiscussionThread(workspace.getId(), discussion.getGroupId(), discussion.getId(), thread.getId());
      deleteWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), discussion.getId());
      deleteWorkspaceDiscussionGroup(workspace.getId(), discussionGroup.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void journalViewTest () throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1.getId(), student.getId());
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addStudent(student)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .build();
      WorkspaceJournalEntry journalEntry = createJournalEntry(workspace.getId(), student.getEmail(), "<p>Journal content... Testing testing.</p>", "Title of my entry");
      try{
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
        
        waitForVisible(".application-list__item-header-main--journal-entry");
        testAccessibility("Workspace journal view:");
        
        waitAndClick(".application-list__item-footer--journal-entry span:nth-child(2)");
        waitForVisible(".dialog__window--delete-journal");
        testAccessibility("Workspace journal delete view:");
        
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
        waitForVisible(".application-list__item-header-main--journal-entry");
        waitAndClick(".application-panel--workspace-journal .button--primary-function");
        waitForVisible(".env-dialog--new-edit-journal");
        testAccessibility("Worspace journal create view:");
      } finally {
        deleteJournalEntry(journalEntry);
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
}

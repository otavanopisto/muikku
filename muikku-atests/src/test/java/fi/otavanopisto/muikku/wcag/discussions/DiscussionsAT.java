package fi.otavanopisto.muikku.wcag.discussions;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Discussion;
import fi.otavanopisto.muikku.atests.DiscussionGroup;
import fi.otavanopisto.muikku.atests.DiscussionThread;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class DiscussionsAT extends AbstractWCAGTest{

  @Test
  public void discussionsTest () throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id(2l).description("test course for testing").buildCourse();
    MockCourseStudent courseStudent = new MockCourseStudent(2l, course1.getId(), student.getId());
    mockBuilder.addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
    login();

    Workspace workspace = createWorkspace(course1, Boolean.TRUE);   
    DiscussionGroup discussionGroup = createDiscussionGroup("Test group");
    Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
    DiscussionThread thread = createDiscussionThread(discussion.getGroupId(), discussion.getId(),
        "Discussion title", "Message is here.", false, false);
    try{
      logout();
      mockBuilder.addStudent(student).addCourseStudent(course1.getId(), courseStudent).mockLogin(student).build();
      login();
      navigate("/discussion", false);
      waitForPresentAndVisible(".application-panel--discussion");
      testAccessibility("Discussions view");
      waitAndClick(".application-list .message--discussion");
      waitForPresentAndVisible(".application-list__item--discussion-message");
      testAccessibility("Discussions single message");
      navigate("/discussion", false);
      waitAndClick(".application-panel__helper-container--discussion a.button--primary-function");
      waitForPresentAndVisible(".env-dialog__header");
      testAccessibility("Discussions new message");
    }finally {
      deleteDiscussionThread(discussion.getGroupId(), discussion.getId(), thread.getId());
      deleteDiscussion(discussionGroup.getId(), discussion.getId());
      deleteDiscussionGroup(discussionGroup.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
}

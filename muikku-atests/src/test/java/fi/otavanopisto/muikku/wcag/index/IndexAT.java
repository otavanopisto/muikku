package fi.otavanopisto.muikku.wcag.index;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class IndexAT extends AbstractWCAGTest {

  @Test
  public void frontpage() throws JsonProcessingException, Exception {
    navigate("/", false);
    testAccessibility("Not logged in");
    
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, true, null, null);
      long sender = getUserIdByEmail("admin@example.com");
      long recipient = getUserIdByEmail("student@example.com");
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      Long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, courseId, student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      logout();
      try{
        mockBuilder.mockLogin(student);
        login();
        testAccessibility("Logged in");
        navigate("/profile", false);
        waitForVisible(".profile-element__title");
        testAccessibility("Profile view");
      }finally{
        deleteWorkspace(workspace.getId()); 
        deleteCommunicatorMessages();
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
 
}

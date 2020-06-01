package fi.otavanopisto.muikku.ui.base.announcer;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class AnnouncerTestsBase extends AbstractUITest {

  @Test
  public void createAnnouncementTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/announcer", false);
        waitAndClick("div.application-panel__helper-container.application-panel__helper-container--main-action > a.button--primary-function");
        
        waitForPresent(".cke_contents");
        waitForPresent(".env-dialog__form-element-container--datepicker:nth-child(2) .react-datepicker__input-container input");
        selectAllAndClear(".env-dialog__form-element-container--datepicker:nth-child(2) .react-datepicker__input-container input");
        sendKeys(".env-dialog__form-element-container--datepicker:nth-child(2) .react-datepicker__input-container input", "21.12.2025");
        waitAndClick(".env-dialog__header");
        waitForNotVisible(".react-datepicker");
        sendKeys(".env-dialog__form-element-container--title input", "Test title");
        addTextToCKEditor("Announcer test announcement");
        waitAndClick(".button--dialog-execute");
        waitForNotVisible(".env-dialog");
        waitForPresent(".application-list-document-short-header");
        assertTextIgnoreCase(".application-list-document-short-header", "Test title");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void deleteAnnouncementTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      try{
        login();
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, true, null, null);
        navigate("/announcer", false);
        waitForPresent(".application-list-document-short-header");
        waitAndClick(".announcement__select-container input");
        waitAndClick("span.button-pill__icon.icon-trash");
        waitAndClick("a.button--standard-ok");
        reloadCurrentPage();
        waitForPresent(".application-panel__main-container");
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".text--item-article-header") == false);
        navigate("/", false);
        navigate("/announcer#archived", false);
        
        waitForPresent(".application-list-document-short-header");
        assertTextIgnoreCase(".application-list-document-short-header", "Test title");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void announcementVisibleInFrontpageWidgetTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, true, null, null);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresentAndVisible(".item-list__item--announcements .item-list__announcement-caption");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-caption", "Test title");
        
        waitForPresentAndVisible(".item-list__item--announcements .item-list__announcement-date");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-date", "12.11.2015");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void announcementListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, true, null, null);
        logout();
        mockBuilder.mockLogin(student);
        login();

        waitForPresentAndVisible(".item-list__item--announcements .item-list__announcement-caption");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-caption", "Test title");
        waitAndClick(".item-list__item--announcements .item-list__announcement-caption");
        
        waitForPresent(".reading-panel__main-container header.article__header");
        assertTextIgnoreCase(".reading-panel__main-container header.article__header", "Test title");
        assertTextIgnoreCase(".reading-panel__main-container header.article__header + div", "12.11.2015");
        assertTextIgnoreCase(".reading-panel__main-container .article__body", "announcer test announcement");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void userGroupAnnouncementVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).addStudentGroup(2l, 1l, "Test group", "Test group for users", 1l, false).addStudentToStudentGroup(2l, student).addStaffMemberToStudentGroup(2l, admin).mockLogin(admin).build();
      login();
      try{
        List<Long> userGroups = new ArrayList<>();
        userGroups.add(2l);
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, false, userGroups, null);
        logout();
        mockBuilder.mockLogin(student);
        login();

        waitForPresentAndVisible(".item-list__item--announcements .item-list__announcement-caption");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-caption", "Test title");
        
        waitForPresentAndVisible(".item-list__item--announcements .item-list__announcement-date");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-date", "12.11.2015");
      }finally{
        deleteAnnouncements();
        deleteUserGroup(2l);
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void userGroupAnnouncementNotVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).addStudentGroup(2l, 1l, "Test group", "Test group for users", 1l, false).addStaffMemberToStudentGroup(2l, admin).mockLogin(admin).build();
      login();
      try{
        List<Long> userGroups = new ArrayList<>();
        userGroups.add(2l);
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, false, userGroups, null);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresentAndVisible(".panel--announcements");
        
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".item-list__item--announcements .item-list__announcement-caption") == false);
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void pastAnnnouncementsListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);

    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();    
    createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(115, 10, 15), false, true, null, null);
    try {
      navigate("/announcer", false);
      waitForPresent("div.application-panel__main-container.loader-empty");
      navigate("/", false);
      navigate("/announcer#past", false);
      
      waitForPresent(".application-list-document-short-header");
      assertTextIgnoreCase(".application-list-document-short-header", "Test title");
      navigate("/", false);
      
      waitForPresentAndVisible(".panel--announcements");
      
      assertTrue("Element found even though it shouldn't be there", isElementPresent(".item-list__item--announcements .item-list__announcement-caption") == false);
    }finally{
      deleteAnnouncements();
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void myAnnnouncementsListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStaffMember another = new MockStaffMember(3l, 3l, 1l, "Another", "User", UserRole.ADMINISTRATOR, "121212-1234", "blaablaa@example.com", Sex.MALE);

    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStaffMember(another).addStudent(student).mockLogin(admin).build();
    login();    
    createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), new java.util.Date(), false, true, null, null);
    createAnnouncement(another.getId(), "Another test title", "Another announcer test announcement", date(115, 10, 12), new java.util.Date(), false, true, null, null);
    try {
      navigate("/announcer", false);
      waitForPresent(".application-list-document-short-header");
      assertCount(".application-list-document-short-header" ,2);
      
      navigate("/", false);
      navigate("/announcer#mine", false);
      waitForPresent(".application-list-document-short-header");
      assertTextIgnoreCase(".application-list-document-short-header", "Test title");
      assertCount(".application-list-document-short-header" ,1);
    }finally{
      deleteAnnouncements();
      mockBuilder.wiremockReset();
    }
  }
  
}
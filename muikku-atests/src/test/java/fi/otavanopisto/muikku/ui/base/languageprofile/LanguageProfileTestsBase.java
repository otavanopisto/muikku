package fi.otavanopisto.muikku.ui.base.languageprofile;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.CeeposPaymentConfirmationRestModel;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourse;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.hops.Mandatority;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivity;
import fi.otavanopisto.pyramus.rest.model.CourseActivityAssessment;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseActivitySubject;
import fi.otavanopisto.pyramus.rest.model.CourseModule;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
import fi.otavanopisto.pyramus.rest.model.Curriculum;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.rest.model.hops.StudyActivityItemRestModel;
import fi.otavanopisto.pyramus.rest.model.hops.StudyActivityItemState;
import fi.otavanopisto.pyramus.rest.model.hops.StudyActivityRestModel;

public class LanguageProfileTestsBase extends AbstractUITest {
  
  private static final long DEFAULT_ORGANIZATION_ID = 1L;
  
  @Test
  public void languageProfileTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), null);
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 2l;
      Course course1 = new CourseBuilder().name("testcourses").id(courseId).description("test course for testing").buildCourse();
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      CourseActivity ca = new CourseActivity();
      ca.setCourseId(course1.getId());
      CourseActivitySubject cas = new CourseActivitySubject();
      cas.setCourseModuleId(course1.getCourseModules().iterator().next().getId());
      cas.setSubjectName("Test subject");
      cas.setSubjectCode("tc_12");
      cas.setCourseLength((double) 3);
      cas.setCourseLengthSymbol("ov");
      ca.setSubjects(Arrays.asList(cas));
      String courseName = String.format("%s (%s)", course1.getName(), course1.getNameExtension());
      ca.setCourseName(courseName);
      CourseActivityAssessment caa = new CourseActivityAssessment();
      caa.setCourseModuleId(cas.getCourseModuleId());
      caa.setGrade("Excellent");
      caa.setPassingGrade(true);
      caa.setDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
      caa.setGradeDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
      caa.setText("Test evaluation.");
      caa.setState(CourseActivityState.GRADED_PASS);
      ca.setAssessments(Arrays.asList(caa));
      
      List<CourseActivity> courseActivities = new ArrayList<>();
      courseActivities.add(ca);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), courseActivities);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");
      
      try {
        List<StudyActivityItemRestModel> sairmList = new ArrayList<StudyActivityItemRestModel>();
        StudyActivityItemRestModel sairm = new StudyActivityItemRestModel();
        sairm.setCourseId(course1.getId());
        sairm.setCourseName(course1.getName());
        CourseModule cm = course1.getCourseModules().iterator().next();
        sairm.setCourseNumber(cm.getCourseNumber());
        
        String ops21 = "OPS 2021";
        List<String> curriculums = new ArrayList<String>();
        curriculums.add(ops21);
        sairm.setCurriculums(curriculums);
        sairm.setDate(caa.getDate());
        sairm.setEvaluatorName("Admin User");
        sairm.setGrade(caa.getGrade());
        sairm.setGradeDate(caa.getGradeDate());
        sairm.setLength(3);
        sairm.setLengthSymbol("ov");
        sairm.setMandatority(Mandatority.MANDATORY);
        sairm.setPassing(true);
        sairm.setState(StudyActivityItemState.GRADED);
        sairm.setStudyProgramme("Nettilukio");
        sairm.setSubject("TEST");
        sairm.setSubjectName(cas.getSubjectName());
        sairm.setText(caa.getText());
        sairmList.add(sairm);
        
        StudentMatriculationEligibilityOPS2021 studentMatriculationEligibilityAI = new StudentMatriculationEligibilityOPS2021(true, 10d, 8d);
        StudentMatriculationEligibilityOPS2021 studentMatriculationEligibilityMAA = new StudentMatriculationEligibilityOPS2021(false, 16d, 10d);
        
        mockBuilder
          .mockCompositeGradingScales()
          .mockMatriculationEligibility(student.getId(), true)
          .mockMatriculationExam(true)
          .mockStudentsMatriculationEligibility(studentMatriculationEligibilityAI, "ÄI")
          .mockStudentsMatriculationEligibility(studentMatriculationEligibilityMAA, "MAA")
          .mockStudentCourseStats(student.getId(), 10).build();
        
        logout();
        mockBuilder.mockLogin(student).mockStudyActivity(sairmList);
        login();
        selectFinnishLocale();
        navigate("/language-profile", false);
        waitAndSendKeys("input.language-profile__input", "Swahili");
        waitAndClick(".language-profile__dropdown-item");
        assertText(".table--language-profile__languages .table__data--language-profile-single-column span", "Swahili");
        String lpt = getResourceContents("languageProfileText.txt");
        sendKeys("#languageUsage", "Usage " + lpt);
        sendKeys("#studyMotivation", "Study motivation " + lpt);
        sendKeys("#languageLearning", "Learning " + lpt);
        waitAndClickXPath("//a[contains(text(),'Seuraava')]");
//      Kielitaidon tasot = fieldset:nth-child(1) 
        waitAndClick("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-0\"]");
        waitAndSendKeys("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-0\"] input", "A1.1");
        sendEnter("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-0\"] input");
        waitAndSendKeys("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-1\"] input", "A1.2");
        sendEnter("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-1\"] input");
        waitAndSendKeys("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-2\"] input", "A1.3");
        sendEnter("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-2\"] input");
//      Taidot osa-alueittain = fieldset:nth-child(2)
        waitAndSendKeys("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-0\"] input", "Natiivi");
        sendEnter("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-0\"] input");
        waitAndSendKeys("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-1\"] input", "Erinomainen");
        sendEnter("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-1\"] input");
        waitAndSendKeys("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-2\"] input", "Hyvä");
        sendEnter("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-2\"] input");
        waitAndSendKeys("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-3\"] input", "Kohtalainen");
        sendEnter("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-3\"] input");
        waitAndClickXPath("//a[contains(text(),'Seuraava')]");
        sleep(1000);
        waitAndClick(".language-profile-container .react-select-override--language-profile-form div:first-child");
        waitAndSendKeys(".language-profile-container input", "testcourses");
        sendEnter(".language-profile-container input");
        waitAndClick(".language-profile__languages-wrapper input.language-profile__input[value=\"3\"]");
        waitAndClickXPath("//a[contains(text(),'Seuraava')]");
        waitAndSendKeys("#learningFactors", "Opiskeluun vaikuttavat asiat: " + lpt);
        waitAndSendKeys("#futureUsage", "Tarve tulevaisuudessa: " + lpt);
        waitAndSendKeys("#skillGoals", "Tavoitteet: " + lpt);
        waitAndClickXPath("//a[contains(text(),'Tallenna')]");
        waitForPresent(".button--execute.disabled");
        refresh();
        assertText("#languageUsage", "Usage " + lpt);
        assertText("#studyMotivation", "Study motivation " + lpt);
        assertText("#languageLearning", "Learning " + lpt);
        waitAndClickXPath("//a[contains(text(),'Seuraava')]");
        assertText("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-0\"] .react-select-override__single-value", "A1.1");
        assertText("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-1\"] .react-select-override__single-value", "A1.2");
        assertText("fieldset:nth-child(1) td[data-testid=\"Swahili-sw-2\"] .react-select-override__single-value", "A1.3");
        
        assertText("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-0\"] .react-select-override__single-value", "Natiivi");
        assertText("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-1\"] .react-select-override__single-value", "Erinomainen");
        assertText("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-2\"] .react-select-override__single-value", "Hyvä");
        assertText("fieldset:nth-child(2) td[data-testid=\"Swahili-sw-3\"] .react-select-override__single-value", "Kohtalainen");
        waitAndClickXPath("//a[contains(text(),'Seuraava')]");
        waitForVisible(".language-profile__languages-wrapper .table--language-profile__languages");
        sleep(1000);
        assertChecked(".language-profile__languages-wrapper input.language-profile__input[value=\"3\"]", true);
        waitAndClickXPath("//a[contains(text(),'Seuraava')]");
        assertText("#learningFactors", "Opiskeluun vaikuttavat asiat: " + lpt);
        assertText("#futureUsage", "Tarve tulevaisuudessa: " + lpt);
        assertText("#skillGoals", "Tavoitteet: " + lpt);
      } finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.resetBuilder();
    }
  }
  
}

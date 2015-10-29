package fi.muikku.ui;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.TestUtilities;
import fi.pyramus.rest.model.ContactType;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStaffMemberRole;
import fi.pyramus.rest.model.CourseStudent;
import fi.pyramus.rest.model.CourseType;
import fi.pyramus.rest.model.EducationType;
import fi.pyramus.rest.model.EducationalTimeUnit;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.StudentGroup;
import fi.pyramus.rest.model.StudyProgramme;
import fi.pyramus.rest.model.StudyProgrammeCategory;
import fi.pyramus.rest.model.Subject;
import fi.pyramus.rest.model.UserRole;
import fi.pyramus.rest.model.WhoAmI;
import fi.pyramus.webhooks.WebhookCourseStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookCourseStudentCreatePayload;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;

public class PyramusMocks{
   
  public static void student1LoginMock() throws JsonProcessingException {
    loginMock(1l, "testuser@made.up", "Test", "User");   
  }

  public static void teacherLoginMock() throws JsonProcessingException {
    loginMock(2l, "teacher@made.up", "Teacher", "User");
  }    
  
  public static void adminLoginMock() throws JsonProcessingException {
    loginMock(4l, "admin@made.up", "Admin", "User");
  }
  
  private static void loginMock(Long userId, String email, String firstName, String lastName) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/users/authorize.*"))
      .willReturn(aResponse()
        .withStatus(302)
        .withHeader("Location",
          "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlEqualTo("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));
    
    List<String> emails = new ArrayList<String>();
    emails.add(email);
    WhoAmI whoAmI = new WhoAmI(userId, firstName, lastName, emails);
    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);

    stubFor(get(urlEqualTo("/1/system/whoami"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));
  }
  
  public static void personsPyramusMocks() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);    
    
    Map<String, String> variables = null;
    List<String> tags = null;
    
    DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);
    Person person = mockPerson(1l, birthday, "030545-3453", fi.pyramus.rest.model.Sex.MALE, 1l);
    
    Student student = new Student((long) 1, (long) 1, "Test", "User", null, null, null, null, null, null, null, null,
      null, null, null, (long) 1, null, null,
      false, null, null, null, null, variables, tags, false);
    
    String studentJson = objectMapper.writeValueAsString(student);
    
    stubFor(get(urlEqualTo("/1/students/students/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentJson)
        .withStatus(200)));

    Email email = new Email((long) 1, (long) 1, true, "testuser@made.up");
    Email[] emails = {email};
    String emailJson = objectMapper.writeValueAsString(emails);
    
    stubFor(get(urlEqualTo("/1/students/students/1/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(emailJson).withStatus(200)));
    
    Student[] studentArray = { student };
    String studentArrayJson = objectMapper.writeValueAsString(studentArray);
    
    stubFor(get(urlEqualTo("/1/students/students?email=testuser@made.up"))
    // .withQueryParam("email", matching(".*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));
    
    /* Student #2 for workspace #2*/
    DateTime birthday2 = new DateTime(1992, 2, 2, 0, 0, 0, 0);
    Person person2 = mockPerson(5l, birthday2, "021092-2112", fi.pyramus.rest.model.Sex.MALE, 5l);
    
    Student student2 = new Student((long) 5, (long) 5, "Second", "User", null, null, null, null, null, null, null, null,
      null, null, null, (long) 1, null, null,
      false, null, null, null, null, variables, tags, false);
    
    String student2Json = objectMapper.writeValueAsString(student2);
    
    stubFor(get(urlEqualTo("/1/students/students/5"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(student2Json)
        .withStatus(200)));

    Email email2 = new Email((long) 5, (long) 1, true, "seconduser@made.up");
    Email[] emails2 = {email2};
    String email2Json = objectMapper.writeValueAsString(emails2);
    
    stubFor(get(urlEqualTo("/1/students/students/5/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(email2Json).withStatus(200)));

    Student[] student2Array = { student2 };
    String student2ArrayJson = objectMapper.writeValueAsString(student2Array);
    
    stubFor(get(urlEqualTo("/1/students/students?email=seconduser@made.up"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(student2ArrayJson)
        .withStatus(200)));
       
    /* Student #2 for workspace #2 */

    Person staff1 = mockPerson(2l, birthday, "030545-3454", fi.pyramus.rest.model.Sex.MALE, 2l);    
    Person staff2 = mockPerson(3l, birthday, "030545-3455", fi.pyramus.rest.model.Sex.MALE, 3l);
    Person staff3 = mockPerson(4l, birthday, "030545-3456", fi.pyramus.rest.model.Sex.MALE, 4l);
    
    Person[] personArray = {person, person2, staff1, staff2, staff3};
    String personArrayJson = objectMapper.writeValueAsString(personArray);
    
    stubFor(get(urlMatching("/1/persons/persons?filterArchived=.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personArrayJson)
        .withStatus(200)));

    stubFor(get(urlEqualTo("/1/persons/persons"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personArrayJson)
        .withStatus(200)));
    
    Student[] students = {student, student2};
    student2ArrayJson = objectMapper.writeValueAsString(students);
    
    stubFor(get(urlMatching("/1/students/students?filterArchived=false&firstResult=.*&maxResults=.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));

    StaffMember staffMember1 = new StaffMember((long) 2, (long) 2, null, "Test", "Staff1member", null, 
      fi.pyramus.rest.model.UserRole.MANAGER, tags, variables);
    
    String staffMemberJson = objectMapper.writeValueAsString(staffMember1);
    
    stubFor(get(urlEqualTo("/1/staff/members/2"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));
    
    StaffMember[] staffMemberArray = { staffMember1 };
    String staffMemberArrayJson = objectMapper.writeValueAsString(staffMemberArray);
    
    stubFor(get(urlEqualTo("/1/staff/members?email=teacher@made.up"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberArrayJson)
        .withStatus(200)));
    
    StaffMember staffMember2 = new StaffMember((long) 3, (long) 3, null, "Test", "Staff2member", null, 
      fi.pyramus.rest.model.UserRole.MANAGER, tags, variables);
    
    staffMemberJson = objectMapper.writeValueAsString(staffMember2);
    stubFor(get(urlEqualTo("/1/staff/members/3"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));
    
    StaffMember[] staffMember2Array = {staffMember2};
    staffMemberArrayJson = objectMapper.writeValueAsString(staffMember2Array);
    
    stubFor(get(urlEqualTo("/1/staff/members?email=mana@made.up"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberArrayJson)
        .withStatus(200)));
    
    StaffMember staffMember3 = new StaffMember((long) 4, (long) 4, null, "Test", "Administrator", null, 
      fi.pyramus.rest.model.UserRole.ADMINISTRATOR, tags, variables);
    
    staffMemberJson = objectMapper.writeValueAsString(staffMember3);
    
    stubFor(get(urlEqualTo("/1/staff/members/4"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));

    StaffMember[] staffMember3Array = {staffMember3};
    staffMemberArrayJson = objectMapper.writeValueAsString(staffMember3Array);
    
    stubFor(get(urlEqualTo("/1/staff/members?email=admin@made.up"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberArrayJson)
        .withStatus(200)));
    
    StaffMember[] staffArray = { staffMember1, staffMember2, staffMember3 };
    String staffArrayJson = objectMapper.writeValueAsString(staffArray);

    stubFor(get(urlEqualTo("/1/staff/members"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffArrayJson)
        .withStatus(200)));

    stubFor(get(urlEqualTo("1/courses/courses/1/staffMembers"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffArrayJson)
        .withStatus(200)));

    staffMemberJson = objectMapper.writeValueAsString(staffMember1);
    stubFor(get(urlEqualTo("1/courses/courses/1/staffMembers/2"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));

    staffMemberJson = objectMapper.writeValueAsString(staffMember2);
    stubFor(get(urlEqualTo("1/courses/courses/1/staffMembers/3"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));

    staffMemberJson = objectMapper.writeValueAsString(staffMember3);
    stubFor(get(urlEqualTo("1/courses/courses/1/staffMembers/4"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));
    
    Email staff1Email = new Email((long) 2, (long) 1, true, "teacher@made.up");
    Email[] staff1Emails = {staff1Email};
    String staff1EmailJson = objectMapper.writeValueAsString(staff1Emails);
    stubFor(get(urlEqualTo("/1/staff/members/2/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staff1EmailJson)
        .withStatus(200)));   
    
    Email staff2Email = new Email((long) 3, (long) 1, true, "mana@made.up");
    Email[] staff2Emails = {staff2Email};
    String staff2EmailJson = objectMapper.writeValueAsString(staff2Emails);
    stubFor(get(urlEqualTo("/1/staff/members/3/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staff2EmailJson)
        .withStatus(200)));

    Email staff3Email = new Email((long) 4, (long) 1, true, "admin@made.up");
    Email[] staff3Emails = {staff3Email};
    String staff3EmailJson = objectMapper.writeValueAsString(staff3Emails);
    stubFor(get(urlEqualTo("/1/staff/members/4/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staff3EmailJson)
        .withStatus(200)));
    
    CourseStaffMemberRole teacherRole = new CourseStaffMemberRole((long) 8, "Opettaja");
    CourseStaffMemberRole[] cRoleArray = { teacherRole };

    String cRoleJson = objectMapper.writeValueAsString(cRoleArray);
    
    stubFor(get(urlEqualTo("/1/courses/staffMemberRoles"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(cRoleJson)
        .withStatus(200)));
    
    for (CourseStaffMemberRole role : cRoleArray) {
      stubFor(get(urlEqualTo(String.format("/1/courses/staffMemberRoles/%d", role.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(role))
            .withStatus(200)));
    }
    
    CourseStaffMember staffMember = new CourseStaffMember(1l, 1l, 4l, 1l);
    CourseStaffMember[] staffMembers = { staffMember };

    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", 1l)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(staffMembers))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", 1l, staffMember.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(staffMember))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", 2l)))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(staffMembers))
        .withStatus(200)));
  
  stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", 2l, staffMember.getId())))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(staffMember))
        .withStatus(200)));
    
    stubFor(get(urlMatching("/1/courses/courses/1/students?filterArchived=.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));
    
    mockContactTypes();
    mockStudyProgrammes();
     
    CourseStudent courseStudent = new CourseStudent(3l, 1l, 1l, new DateTime(2010, 2, 2, 0, 0, 0, 0), false, null, null, null, null, null);
    CourseStudent[] csArray = { courseStudent };
    String coursestudentArrayJson = objectMapper.writeValueAsString(csArray);
    String courseStudenJson = objectMapper.writeValueAsString(courseStudent);
    
    stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students?filterArchived=.*", courseStudent.getCourseId())))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(coursestudentArrayJson)
        .withStatus(200)));

    stubFor(get(urlMatching("/1/courses/courses/1/students"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(coursestudentArrayJson)
        .withStatus(200)));
    
    stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students/%d", courseStudent.getCourseId(), courseStudent.getId())))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseStudenJson)
        .withStatus(200)));
    
    CourseStudent courseStudent2 = new CourseStudent(2l, 2l, 5l, new DateTime(2010, 2, 2, 0, 0, 0, 0), false, null, null, null, null, null);
    CourseStudent[] csArray2 = { courseStudent2 };
    String coursestudentArrayJson2 = objectMapper.writeValueAsString(csArray2);
    String courseStudenJson2 = objectMapper.writeValueAsString(courseStudent2);
    
    stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students?filterArchived=.*", courseStudent2.getCourseId())))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(coursestudentArrayJson2)
        .withStatus(200)));
    
    stubFor(get(urlMatching("/1/courses/courses/2/students"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(coursestudentArrayJson2)
        .withStatus(200)));

    stubFor(get(urlMatching(String.format("/1/courses/courses/%d/students/%d", courseStudent2.getCourseId(), courseStudent2.getId())))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseStudenJson2)
        .withStatus(200)));
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, 1l, 4l, 7l);

    CourseStaffMember[] coursestaffMembers = { courseStaffMember };

    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", 1l)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(coursestaffMembers))
          .withStatus(200)));
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", 1l, staffMember.getId())))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(courseStaffMember))
        .withStatus(200)));
    
    String payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 5));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 5));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 1));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 1));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(courseStudent.getId(), courseStudent.getCourseId(), courseStudent.getStudentId()));    
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(courseStudent2.getId(), courseStudent2.getCourseId(), courseStudent2.getStudentId()));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(1l, 1l, 4l));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
  }
  
  private static StaffMember mockStaffMember(Long personId, Long staffMemberId, String firstName, String lastName, String email, UserRole role, List<String> tags, Map<String, String> variables, List<String> payloads) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    StaffMember staffMember = new StaffMember(staffMemberId, personId, null, firstName, lastName, null, 
        role, tags, variables);
      
    String staffMemberJson = objectMapper.writeValueAsString(staffMember);
    
    stubFor(get(urlEqualTo("/1/staff/members/" + staffMemberId))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));
    
    StaffMember[] staffMemberArray = { staffMember };
    String staffMemberArrayJson = objectMapper.writeValueAsString(staffMemberArray);
    
    stubFor(get(urlEqualTo("/1/staff/members?email=" + email))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberArrayJson)
        .withStatus(200)));
    
    Email staffEmail = new Email(staffMemberId, (long) 1, true, email);
    Email[] staffEmails = { staffEmail };
    String staffEmailJson = objectMapper.writeValueAsString(staffEmails);
    
    stubFor(get(urlEqualTo("/1/staff/members/" + staffMemberId + "/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffEmailJson)
        .withStatus(200)));   
    
//    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
    
    return staffMember;
  }
  
  private static void mockStudyProgrammes() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    StudyProgrammeCategory spc = new StudyProgrammeCategory(1l, "All Study Programmes", 1l, false);
    StudyProgramme sp = new StudyProgramme(1l, "test", "Test Study Programme", 1l, false);
    
    StudyProgramme[] sps = { sp };
    StudyProgrammeCategory[] spcs = { spc };
    
    stubFor(get(urlEqualTo("/1/students/studyProgrammes"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(sps))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo("/1/students/studyProgrammes/1"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(sp))
          .withStatus(200)));

    stubFor(get(urlEqualTo("/1/students/studyProgrammeCategories"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(spcs))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo("/1/students/studyProgrammeCategories/1"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(spc))
          .withStatus(200)));
  }
  
  public static void workspace1PyramusMock() throws JsonProcessingException {
    workspacePyramusMock(1l, "testCourse", "test course for testing");
  }
  
  public static void workspacePyramusMock(Long id, String name, String description) throws JsonProcessingException {
      DateTime created = new DateTime(1990, 2, 2, 0, 0, 0, 0);
      DateTime begin = new DateTime(2000, 1, 1, 0, 0, 0, 0);
      DateTime end = new DateTime(2050, 1, 1, 0, 0, 0, 0);

      Course course = new Course(id, name, created, created, description, false, 1, 
        (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
        (double) 15, (double) 45, (double) 45, end, (long) 1,
        (long) 1, (long) 1, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
        null, null);
    
      ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String courseJson = objectMapper.writeValueAsString(course);
      
      stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", id)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(courseJson)
          .withStatus(200)));
      
      Course[] courseArray = { course };
      String courseArrayJson = objectMapper.writeValueAsString(courseArray);
      
      stubFor(get(urlEqualTo("/1/courses/courses"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(courseArrayJson)
          .withStatus(200)));
      
      stubFor(get(urlMatching("/1/courses/courses?filterArchived=false&firstResult=.*&maxResults=.*"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(courseArrayJson)
          .withStatus(200)));
      
      mockStudyProgrammes();
      mockCommons();
      mockCourseTypes();
      
    }

  public static void studentGroupsMocks() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    DateTime created = new DateTime(1990, 2, 2, 0, 0, 0, 0);
    DateTime begin = new DateTime(2000, 1, 1, 0, 0, 0, 0);
    DateTime lastmodified = new DateTime(2000, 1, 1, 0, 0, 0, 0);
    StudentGroup studentGroupStudents = new StudentGroup((long) 1, "Opiskelijat", "Spring 2015 Students", begin, (long) 1, created, (long) 1, lastmodified, null, false);
    StudentGroup studentGroupAnother = new StudentGroup((long) 2, "Opiskelijat 2", "Spring 2015 Students 2", begin, (long) 1, created, (long) 1, lastmodified, null, false);
    StudentGroup[] studentGroupArray = {studentGroupStudents, studentGroupAnother};
    String studentGroupsJson = objectMapper.writeValueAsString(studentGroupArray);
    stubFor(get(urlMatching("/1/students/studentGroups"))
      .willReturn(aResponse()
      .withHeader("Content-Type", "application/json")
      .withBody(studentGroupsJson)
      .withStatus(200)));
  }
  
  public static void adminMock() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);    
    
    Map<String, String> variables = null;
    List<String> tags = null;
    
    DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);
    
    Person staff3 = mockPerson((long) 4, birthday, "345345-3453", fi.pyramus.rest.model.Sex.MALE, (long) 4);
    
    Person[] personArray = {staff3};
    String personArrayJson = objectMapper.writeValueAsString(personArray);
    
    stubFor(get(urlMatching("/1/persons/persons?filterArchived=.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personArrayJson)
        .withStatus(200)));

    stubFor(get(urlEqualTo("/1/persons/persons"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personArrayJson)
        .withStatus(200)));
        
    StaffMember staffMember3 = new StaffMember((long) 4, (long) 4, null, "Test", "Administrator", null, 
      fi.pyramus.rest.model.UserRole.ADMINISTRATOR, tags, variables);
    
    String staffMemberJson = objectMapper.writeValueAsString(staffMember3);
    
    stubFor(get(urlEqualTo("/1/staff/members/4"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));

    StaffMember[] staffMember3Array = {staffMember3};
    String staffMemberArrayJson = objectMapper.writeValueAsString(staffMember3Array);
    
    stubFor(get(urlEqualTo("/1/staff/members?email=admin@made.up"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberArrayJson)
        .withStatus(200)));
    
    StaffMember[] staffArray = { staffMember3 };
    String staffArrayJson = objectMapper.writeValueAsString(staffArray);

    stubFor(get(urlEqualTo("/1/staff/members"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffArrayJson)
        .withStatus(200)));


    staffMemberJson = objectMapper.writeValueAsString(staffMember3);
    stubFor(get(urlEqualTo("1/courses/courses/1/staffMembers/4"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffMemberJson)
        .withStatus(200)));
    

    Email staff3Email = new Email((long) 4, (long) 1, true, "admin@made.up");
    Email[] staff3Emails = {staff3Email};
    String staff3EmailJson = objectMapper.writeValueAsString(staff3Emails);
    stubFor(get(urlEqualTo("/1/staff/members/4/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staff3EmailJson)
        .withStatus(200)));
    
    
    CourseStaffMemberRole teacherRole = new CourseStaffMemberRole((long) 8, "Opettaja");
//    CourseStaffMemberRole tutorRole = new CourseStaffMemberRole((long) 2, "Tutor");
//    CourseStaffMemberRole vRole = new CourseStaffMemberRole((long) 3, "Vastuuhenkilö");
//    CourseStaffMemberRole studentRole = new CourseStaffMemberRole((long) 9, "Opiskelija");
    CourseStaffMemberRole[] cRoleArray = { teacherRole };

    String cRoleJson = objectMapper.writeValueAsString(cRoleArray);
    
    stubFor(get(urlEqualTo("/1/courses/staffMemberRoles"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(cRoleJson)
        .withStatus(200)));
    
    for (CourseStaffMemberRole role : cRoleArray) {
      stubFor(get(urlEqualTo(String.format("/1/courses/staffMemberRoles/%d", role.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(role))
            .withStatus(200)));
    }
    
    mockContactTypes();

    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
 
  }
  
  private static Person mockPerson(Long personId, DateTime birthday, String socialSecurityNumber, Sex sex, Long defaultUserId) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Person person = new Person(personId, birthday, socialSecurityNumber, sex, false, "empty", defaultUserId);
    String personJson = objectMapper.writeValueAsString(person);
    
    stubFor(get(urlEqualTo("/1/persons/persons/" + personId))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personJson)
        .withStatus(200)));
    
    return person;
  }
  
  public static void mockCommons() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    Subject subject = new Subject((long) 1, "tc_11", "Test course", (long) 1, false);
    String subjectJson = objectMapper.writeValueAsString(subject);
    
    stubFor(get(urlMatching("/1/common/subjects/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(subjectJson)
        .withStatus(200)));
    
    Subject[] subjectArray = { subject };
    String subjectArrayJson = objectMapper.writeValueAsString(subjectArray);
    
    stubFor(get(urlEqualTo("/1/common/subjects"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(subjectArrayJson)
        .withStatus(200)));
    
    EducationType educationType = new EducationType((long) 1, "testEduType", "ET", false);
    String educationTypeJson = objectMapper.writeValueAsString(educationType);
    
    stubFor(get(urlEqualTo("/1/common/educationTypes/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(educationTypeJson)
        .withStatus(200)));
    
    EducationType[] educationTypeArray = { educationType };
    String educationTypeArrayJson = objectMapper.writeValueAsString(educationTypeArray);
    
    stubFor(get(urlEqualTo("/1/common/educationTypes"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(educationTypeArrayJson)
        .withStatus(200)));
    
    EducationalTimeUnit educationalTimeUnit = new EducationalTimeUnit((long) 1, "test time unit", "h", (double) 1, false);
    String eduTimeUnitJson = objectMapper.writeValueAsString(educationalTimeUnit);
    
    stubFor(get(urlEqualTo("/1/common/educationalTimeUnits/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(eduTimeUnitJson)
        .withStatus(200)));
    
    EducationalTimeUnit[] eduTimeUnitArray = { educationalTimeUnit };
    String eduTimeUnitArrayJson = objectMapper.writeValueAsString(eduTimeUnitArray);
    
    stubFor(get(urlEqualTo("/1/common/educationalTimeUnits"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(eduTimeUnitArrayJson)
        .withStatus(200)));

  }

  public static void mockCourseTypes() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    fi.pyramus.rest.model.CourseType courseType = new fi.pyramus.rest.model.CourseType((long) 1, "Nonstop", false);
    CourseType[] courseTypeArray = { courseType };
    String courseTypeJson = objectMapper.writeValueAsString(courseTypeArray);
    
    stubFor(get(urlEqualTo("/1/courses/courseTypes"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseTypeJson)
        .withStatus(200)));

    String courseTypeSingleJson = objectMapper.writeValueAsString(courseType);
    
    stubFor(get(urlEqualTo("/1/courses/courseTypes/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseTypeSingleJson)
        .withStatus(200)));
    
  }
  
  public static void mockContactTypes() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    ContactType contactType = new ContactType((long)1, "Koti", false, false);
    ContactType[] contactTypes = { contactType };
    String contactTypeJson = objectMapper.writeValueAsString(contactType);
    stubFor(get(urlMatching("/1/common/contactTypes/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(contactTypeJson)
        .withStatus(200)));
    
    String contactTypesJson = objectMapper.writeValueAsString(contactTypes);
    stubFor(get(urlEqualTo("/1/common/contactTypes"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(contactTypesJson)
        .withStatus(200)));
  }
}
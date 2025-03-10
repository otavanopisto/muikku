package fi.otavanopisto.muikku.rest.test;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.AbstractPyramusMocks;
import fi.otavanopisto.pyramus.rest.model.ContactType;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseLength;
import fi.otavanopisto.pyramus.rest.model.CourseModule;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.CourseType;
import fi.otavanopisto.pyramus.rest.model.EducationType;
import fi.otavanopisto.pyramus.rest.model.EducationalTimeUnit;
import fi.otavanopisto.pyramus.rest.model.Email;
import fi.otavanopisto.pyramus.rest.model.Organization;
import fi.otavanopisto.pyramus.rest.model.Person;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.StaffMember;
import fi.otavanopisto.pyramus.rest.model.Student;
import fi.otavanopisto.pyramus.rest.model.StudentGroup;
import fi.otavanopisto.pyramus.rest.model.StudentGroupStudent;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.StudyProgrammeCategory;
import fi.otavanopisto.pyramus.rest.model.Subject;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.rest.model.WhoAmI;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseStaffMemberCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseStudentCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookOrganizationCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentGroupCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentGroupStaffMemberCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentGroupStudentCreatePayload;

/**
 * Pyramus data bridge mocks for rest tests.
 * 
 * Mocks default of
 * 
 * Common properties
 *  * EducationType (id = 1)
 *  * EducationalTimeUnit (id = 1)
 *  * CourseType (id = 1)
 * 
 * Roles
 *  * CourseStaffMember (id = 7, "Opettaja")
 *  * CourseStaffMember (id = 8, "Tutor")
 *  * CourseStaffMember (id = 9, "Vastuuhenkilö")
 *  * CourseStaffMember (id = 10, "Opiskelija")
 *  
 * StudyProgramme (id = 1)
 * StudyProgrammeCategory (id = 1)
 * 
 * Users
 *  * Person - Student (ids = 1)
 *  * Person - StaffMember (ids = 2, Role = USER)
 *  * Person - StaffMember (ids = 3, Role = MANAGER)
 *  * Person - StaffMember (ids = 4, Role = ADMINISTRATOR)
 *  * Person - StaffMember (ids = 5, Role = TRUSTED_SYSTEM)
 *  * Person - Student (ids = 6)
 *  
 * UserGroups (id = 1)
 *  * Members (id = 1, userId = 4 [Admin])
 *  * Members (id = 2, userId = 1 [Student])
 *  
 * Courses (id = 1)
 * CourseStaffMember (id = 1, userId = 4 [Admin], courseRole = 7)
 * CourseStudent (id = 2, userId = 1)
 * 
 * Login info for student1
 */
public class PyramusMocksRest extends AbstractPyramusMocks {
  
  public static final Long WORKSPACE1_ID = 1l;
  public static final Long WORKSPACE2_ID = 2l;
  
  public static final Long USERGROUP1_ID = 2l;
  
  private static final Long DEFAULT_ORGANIZATION_ID = 1l;

  private static ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
  
  public static void mockDefaults(List<String> payloads) throws JsonProcessingException {
    mockOrganizations(payloads);
    mockCommons();
    mockStudyProgrammes(payloads);
    mockUsers(payloads);
    mockUserGroups(payloads);
    mockWorkspaces(payloads);
    mockWorkspaceUsers(payloads);
    student1LoginMock();
  }
  
  private static void mockOrganizations(List<String> payloads) throws JsonProcessingException {
    Organization[] organizations = { 
        new Organization(1l, "Default", false),
        new Organization(2l, "Secondary Test Organization", false)
    };

    stubFor(get(urlEqualTo("/1/organizations"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(organizations))
          .withStatus(200)));

    for (Organization organization : organizations) {
      stubFor(get(urlEqualTo(String.format("/1/organizations/%d", organization.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(organization))
            .withStatus(200)));
      addPayload(payloads, objectMapper.writeValueAsString(new WebhookOrganizationCreatePayload(organization.getId(), organization.getName())));
    }
  }

  private static void mockStudyProgrammes(List<String> payloads) throws JsonProcessingException {
    StudyProgramme[] sps = {
        new StudyProgramme(1l, DEFAULT_ORGANIZATION_ID, "test", "Test Study Programme", 1l, null, false, false, null), 
        new StudyProgramme(2l, 2l, "test", "Secondary Organization Study Programme", 1l, null, false, false, null) 
    };
    StudyProgrammeCategory[] spcs = {
        new StudyProgrammeCategory(1l, "All Study Programmes", 1l, false)
    };
    
    stubFor(get(urlEqualTo("/1/students/studyProgrammes"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(sps))
          .withStatus(200)));

    for (StudyProgramme sp : sps) {
      stubFor(get(urlEqualTo(String.format("/1/students/studyProgrammes/%d", sp.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(sp))
            .withStatus(200)));
    }

    stubFor(get(urlEqualTo("/1/students/studyProgrammeCategories"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(spcs))
          .withStatus(200)));
    
    for (StudyProgrammeCategory spc : spcs) {
      stubFor(get(urlEqualTo(String.format("/1/students/studyProgrammeCategories/%d", spc.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(spc))
            .withStatus(200)));
    }
  }

  public static void student1LoginMock() throws JsonProcessingException {
    stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/users/authorize.*"))
      .willReturn(aResponse()
        .withStatus(302)
        .withHeader("Location",
          "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));
    
    stubFor(post(urlEqualTo("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    List<String> emails = new ArrayList<String>();
    emails.add("testuser@example.com");
    WhoAmI whoAmI = new WhoAmI((long) 1, "Test", "User", emails);

    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);

    stubFor(get(urlEqualTo("/1/system/whoami"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));
  }

  public static void teacherLoginMock() throws JsonProcessingException {
    stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/users/authorize.*"))
      .willReturn(aResponse()
        .withStatus(302)
        .withHeader("Location",
          "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlEqualTo("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    List<String> emails = new ArrayList<String>();
    emails.add("teacher@example.com");
    WhoAmI whoAmI = new WhoAmI((long) 2, "Teacher", "User", emails);

    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);

    stubFor(get(urlEqualTo("/1/system/whoami"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));
  }    
  
  public static void adminLoginMock() throws JsonProcessingException {
    stubFor(get(urlEqualTo("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/users/authorize.*"))
      .willReturn(aResponse()
        .withStatus(302)
        .withHeader("Location",
          "http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlEqualTo("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    List<String> emails = new ArrayList<String>();
    emails.add("admin@example.com");
    WhoAmI whoAmI = new WhoAmI((long) 4, "Admin", "User", emails);

    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);

    stubFor(get(urlEqualTo("/1/system/whoami"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));
  }

  private static Person mockPerson(Long personId, OffsetDateTime birthday, String socialSecurityNumber, Sex sex, Long defaultUserId) throws JsonProcessingException {
    Person person = new Person(personId, birthday, socialSecurityNumber, sex, false, "empty", defaultUserId);
    String personJson = objectMapper.writeValueAsString(person);
    
    stubFor(get(urlEqualTo("/1/persons/persons/" + personId))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personJson)
        .withStatus(200)));
    
    return person;
  }
  
  private static StaffMember mockStaffMember(Long personId, Long staffMemberId, Long organizationId, String firstName, String lastName, String email, UserRole role, List<String> tags, Map<String, String> variables, List<String> payloads) throws JsonProcessingException {
    Set<Long> staffStudyProgrammes = new HashSet<>();
    staffStudyProgrammes.add(1l);
    staffStudyProgrammes.add(2l);
    StaffMember staffMember = new StaffMember(staffMemberId, personId, organizationId, null, firstName, lastName, null, 
        EnumSet.of(role), tags, variables, staffStudyProgrammes);
      
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
    
    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
    
    return staffMember;
  }
  
  public static Student mockStudent(Long personId, Long studentId, Long studyProgrammeId, String firstName, String lastName, String email, List<String> tags, Map<String, String> variables, List<String> payloads, OffsetDateTime studyStartDate, OffsetDateTime studyEndDate) throws JsonProcessingException {
    Student student = new Student(
        studentId,
        personId,
        firstName,
        lastName, 
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        studyProgrammeId,
        null,
        null,
        null,
        false,
        studyStartDate,
        studyEndDate,
        null,
        null,
        variables,
        tags,
        false,
        null);
    
    String studentJson = objectMapper.writeValueAsString(student);
    
    stubFor(get(urlEqualTo(String.format("/1/students/students/%d", studentId)))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentJson)
        .withStatus(200)));

    Email emailObj = new Email(studentId, (long) 2, true, email);
    Email[] emails = { emailObj };
    String emailJson = objectMapper.writeValueAsString(emails);

    Student[] studentArray = { student };
    String studentArrayJson = objectMapper.writeValueAsString(studentArray);
    
    stubFor(get(urlEqualTo(String.format("/1/students/students/%d/emails", studentId)))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(emailJson).withStatus(200)));

    stubFor(get(urlEqualTo(String.format("/1/students/students?email=%s", email)))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));

    /**
     * Empty study periods list - implement support for them if some tests need these at some point
     */
    stubFor(get(urlEqualTo(String.format("/1/students/students/%d/studyPeriods", studentId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("[]").withStatus(200)));

    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStudentCreatePayload(student.getId())));

    return student;
  }
  
  public static void mockUsers(List<String> payloads) throws JsonProcessingException {
    OffsetDateTime birthday = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);

    Person person = mockPerson(1l, birthday, "345345-3453", Sex.MALE, 1l);
    Person staff1 = mockPerson(2l, birthday, "345345-3453", Sex.MALE, 2l);
    Person staff2 = mockPerson(3l, birthday, "345345-3453", Sex.MALE, 3l);
    Person staff3 = mockPerson(4l, birthday, "345345-3453", Sex.MALE, 4l);
    Person staff4 = mockPerson(5l, birthday, "345345-3453", Sex.MALE, 5l);
    Person studentPerson2 = mockPerson(6l, birthday, "345345-3453", Sex.MALE, 6l);
    Person studentPerson3 = mockPerson(7l, birthday, "341345-3453", Sex.FEMALE, 7l);
    
    Person[] personArray = { person, staff1, staff2, staff3, staff4, studentPerson2, studentPerson3 };
    String personArrayJson = objectMapper.writeValueAsString(personArray);

    for (Person p : personArray)
      addPayload(payloads, objectMapper.writeValueAsString(new WebhookPersonCreatePayload(p.getId())));
    
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

    Map<String, String> variables = null;
    List<String> tags = null;
    
    Student student1 = mockStudent(person.getId(), 1l, 1l, "Test", "User", "testuser@example.com", tags, variables, payloads, toDate(2010, 1, 1), toDate(2070, 1, 1));
    Student student2 = mockStudent(studentPerson2.getId(), 6l, 1l, "Hidden", "Dragon", "crouchingtiger@example.com", tags, variables, payloads, toDate(2010, 1, 1), toDate(2011, 1, 1));
    Student student3 = mockStudent(studentPerson3.getId(), 7l, 2l, "Constipated", "Moose", "constmo@example.com", tags, variables, payloads, toDate(2010, 1, 1), toDate(2011, 1, 1));

    StaffMember staffMember1 = mockStaffMember(staff1.getId(), 2l, DEFAULT_ORGANIZATION_ID, "Test", "Staff1member", "teacher@example.com", UserRole.USER, tags, variables, payloads);
    StaffMember staffMember2 = mockStaffMember(staff2.getId(), 3l, DEFAULT_ORGANIZATION_ID, "Test", "Staff2member", "mana@example.com", UserRole.MANAGER, tags, variables, payloads);
    StaffMember staffMember3 = mockStaffMember(staff3.getId(), 4l, DEFAULT_ORGANIZATION_ID, "Test", "Administrator", "admin@example.com", UserRole.ADMINISTRATOR, tags, variables, payloads);
    StaffMember staffMember4 = mockStaffMember(staff4.getId(), 5l, DEFAULT_ORGANIZATION_ID, "Trusted", "System", "trusted@example.com", UserRole.TRUSTED_SYSTEM, tags, variables, payloads);

    Student[] studentArray = { student1, student2, student3 };
    StaffMember[] staffArray = { staffMember1, staffMember2, staffMember3, staffMember4 };

    stubFor(get(urlMatching("/1/students/students?filterArchived=false&firstResult=.*&maxResults=.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(studentArray))
        .withStatus(200)));

    stubFor(get(urlEqualTo("/1/staff/members"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(staffArray))
        .withStatus(200)));
    
    mockPersonStudens(studentArray);
    mockPersonStaffMembers(staffArray);

    ContactType contactType = new ContactType((long)1, "Koti", false, false);
    ContactType[] contactTypes = { contactType };
    stubFor(get(urlMatching("/1/common/contactTypes/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(contactType))
        .withStatus(200)));
    
    stubFor(get(urlEqualTo("/1/common/contactTypes"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(objectMapper.writeValueAsString(contactTypes))
        .withStatus(200)));
  }
  
  private static OffsetDateTime toDate(int year, int month, int day) {
    return OffsetDateTime.of(year, month, day, 0, 0, 0, 0, ZoneOffset.UTC);
  }

  public static void mockWorkspaces(List<String> payloads) throws JsonProcessingException {
    mockWorkspace(WORKSPACE1_ID, payloads);
    mockWorkspace(WORKSPACE2_ID, payloads);
  }
  
  public static void mockWorkspace(Long id, List<String> payloads) throws JsonProcessingException {
    OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
    OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
    OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
    OffsetDateTime signupStart = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
    OffsetDateTime signupEnd = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);

    Set<CourseModule> courseModules = new HashSet<>();
    Subject subject_ = new Subject(1L, null, null, null, null);
    EducationalTimeUnit unit = new EducationalTimeUnit(1L, null, null, null, null);
    CourseLength courseLength = new CourseLength(id, 1d, 45d, unit);
    courseModules.add(new CourseModule(
        id,                             // id
        subject_,                       // subject
        1,                              // courseNumber 
        courseLength                    // courseLength
      )
    );
    
    Course course = new Course(
        id,
        "testCourse",
        created,
        created,
        "test course for testing",
        false,
       (long) 25,
       begin,
       end,
       signupStart,
       signupEnd,
       "test extension",
       (double) 15,
       (double) 45,
       (double) 45,       
       (double) 15,
       (double) 45,
       (double) 45,
       end,
       (long) 1,
       (long) 1,
       null,
       (long) 1,
       (long) 1,
       (long) 1,
       null,
       null,
       1L,
       false,
       1L, 
       1L,
       courseModules);
  
    String courseJson = objectMapper.writeValueAsString(course);
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", id)))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseJson)
        .withStatus(200)));
    
    Course[] courseArray = { course };
    String courseArrayJson = objectMapper.writeValueAsString(courseArray);
    
    addPayload(payloads, new WebhookCourseCreatePayload(id));
    
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

    // Signup groups - all empty here
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/signupStudyProgrammes", id)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(Collections.emptyList()))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/signupStudentGroups", id)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(Collections.emptyList()))
          .withStatus(200)));
  }

  public static void mockCommons() throws JsonProcessingException {
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
    
    fi.otavanopisto.pyramus.rest.model.CourseType courseType = new fi.otavanopisto.pyramus.rest.model.CourseType((long) 1, "Nonstop", false);
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
  
  public static void mockUserGroups(List<String> payloads) throws JsonProcessingException {
    OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
    Long creatorId = 1l;
    Long groupId = USERGROUP1_ID;
    
    StudentGroup studentGroup = new StudentGroup(groupId, "Group1", "", begin, creatorId, begin, creatorId, begin, null, false, 1l, false);
    StudentGroup[] studentGroups = new StudentGroup[] { studentGroup };
    
    stubFor(get(urlEqualTo("/1/students/studentGroups"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(studentGroups))
          .withStatus(200)));

    stubFor(get(urlEqualTo(String.format("/1/students/studentGroups/%d", groupId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(studentGroup))
          .withStatus(200)));

    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStudentGroupCreatePayload(groupId)));

    StudentGroupUser studentGroupStaffMember = new StudentGroupUser(1l, 4l, false, false, false);
    StudentGroupUser[] studentGroupStaffMembers = { studentGroupStaffMember };
    
    stubFor(get(urlEqualTo(String.format("/1/students/studentGroups/%d/staffmembers", groupId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(studentGroupStaffMembers))
          .withStatus(200)));

    stubFor(get(urlEqualTo(String.format("/1/students/studentGroups/%d/staffmembers/%d", groupId, studentGroupStaffMember.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(studentGroupStaffMember))
          .withStatus(200)));

    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStudentGroupStaffMemberCreatePayload(
        studentGroupStaffMember.getId(), groupId, studentGroupStaffMember.getStaffMemberId())));
    
    StudentGroupStudent studentGroupStudent = new StudentGroupStudent(2l, 1l);
    StudentGroupStudent[] studentGroupStudents = { studentGroupStudent };
    
    stubFor(get(urlEqualTo(String.format("/1/students/studentGroups/%d/students", groupId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(studentGroupStudents))
          .withStatus(200)));

    stubFor(get(urlEqualTo(String.format("/1/students/studentGroups/%d/students/%d", groupId, studentGroupStudent.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(studentGroupStudent))
          .withStatus(200)));

    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStudentGroupStudentCreatePayload(
        studentGroupStudent.getId(), groupId, studentGroupStudent.getStudentId())));
  }
  
  public static void mockWorkspaceUsers(List<String> payloads) throws JsonProcessingException {
    Long courseId = 1l;
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, 4l, CourseStaffMemberRoleEnum.COURSE_TEACHER);
    CourseStaffMember[] courseStaffMembers = { courseStaffMember };

    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", courseId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(courseStaffMembers))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", courseId, courseStaffMember.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(courseStaffMember))
          .withStatus(200)));

    addPayload(payloads, objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(
        courseStaffMember.getId(), courseId, courseStaffMember.getStaffMemberId())));
    
    OffsetDateTime enrolmentTime = OffsetDateTime.of(1999, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
    CourseStudent courseStudent = new CourseStudent(2l, courseId, 1l, enrolmentTime, false, null, null, false, null, null);
    CourseStudent[] students = { courseStudent };

    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students", courseId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(students))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students/%d", courseId, courseStudent.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(courseStudent))
          .withStatus(200)));
    
    addPayload(payloads, objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(
        courseStudent.getId(), courseId, courseStudent.getStudentId())));
  }
  
  private static void addPayload(List<String> payloads, Object obj) throws JsonProcessingException {
    addPayload(payloads, objectMapper.writeValueAsString(obj));
  }
  
  private static void addPayload(List<String> payloads, String payload) {
    if (payloads != null)
      payloads.add(payload);
  }

  public static void resetWireMock() {
    WireMock.reset();
  }
  
}
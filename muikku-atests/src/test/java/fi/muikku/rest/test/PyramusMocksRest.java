package fi.muikku.rest.test;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

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
import fi.pyramus.rest.model.StudentGroupStudent;
import fi.pyramus.rest.model.StudentGroupUser;
import fi.pyramus.rest.model.StudyProgramme;
import fi.pyramus.rest.model.StudyProgrammeCategory;
import fi.pyramus.rest.model.Subject;
import fi.pyramus.rest.model.UserRole;
import fi.pyramus.rest.model.WhoAmI;
import fi.pyramus.webhooks.WebhookCourseCreatePayload;
import fi.pyramus.webhooks.WebhookCourseStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookCourseStudentCreatePayload;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;
import fi.pyramus.webhooks.WebhookStudentGroupCreatePayload;
import fi.pyramus.webhooks.WebhookStudentGroupStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentGroupStudentCreatePayload;

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
public class PyramusMocksRest {
  
  public static void mockDefaults(List<String> payloads) throws JsonProcessingException {
    mockCommons();
    mockRoles(payloads);
    mockStudyProgrammes(payloads);
    mockUsers(payloads);
    mockUserGroups(payloads);
    mockWorkspaces(payloads);
    mockWorkspaceUsers(payloads);
    student1LoginMock();
  }
  
  private static void mockStudyProgrammes(List<String> payloads) throws JsonProcessingException {
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

  public static void mockRoles(List<String> payloads) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    CourseStaffMemberRole[] roles = { 
        new CourseStaffMemberRole(7l, "Opettaja"), 
        new CourseStaffMemberRole(8l, "Tutor"), 
        new CourseStaffMemberRole(9l, "Vastuuhenkilö"), 
        new CourseStaffMemberRole(10l, "Opiskelija") 
    };

    stubFor(get(urlEqualTo("/1/courses/staffMemberRoles"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(roles))
          .withStatus(200)));

    for (CourseStaffMemberRole role : roles) {
      stubFor(get(urlEqualTo(String.format("/1/courses/staffMemberRoles/%d", role.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(role))
            .withStatus(200)));
    }
  }
  
  public static void student1LoginMock() throws JsonProcessingException {
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
    emails.add("testuser@made.up");
    WhoAmI whoAmI = new WhoAmI((long) 1, "Test", "User", emails);

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

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
          "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlEqualTo("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    List<String> emails = new ArrayList<String>();
    emails.add("teacher@made.up");
    WhoAmI whoAmI = new WhoAmI((long) 2, "Teacher", "User", emails);

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

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
          "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlEqualTo("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    List<String> emails = new ArrayList<String>();
    emails.add("admin@made.up");
    WhoAmI whoAmI = new WhoAmI((long) 4, "Admin", "User", emails);

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);

    stubFor(get(urlEqualTo("/1/system/whoami"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));
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
    
    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload(staffMember.getId())));
    
    return staffMember;
  }
  
  public static Student mockStudent(Long personId, Long studentId, String firstName, String lastName, String email, List<String> tags, Map<String, String> variables, List<String> payloads) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    Student student = new Student(studentId, personId, firstName, lastName, null, null, null, null, null, null, null, null,
      null, null, null, (long) 1, null, null,
      false, null, null, null, null, variables, tags, false);
    
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
    
    addPayload(payloads, objectMapper.writeValueAsString(new WebhookStudentCreatePayload(student.getId())));

    return student;
  }
  
  public static void mockUsers(List<String> payloads) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);

    Person person = mockPerson(1l, birthday, "345345-3453", Sex.MALE, 1l);
    Person staff1 = mockPerson(2l, birthday, "345345-3453", Sex.MALE, 2l);
    Person staff2 = mockPerson(3l, birthday, "345345-3453", Sex.MALE, 3l);
    Person staff3 = mockPerson(4l, birthday, "345345-3453", Sex.MALE, 4l);
    Person staff4 = mockPerson(5l, birthday, "345345-3453", Sex.MALE, 5l);
    Person studentPerson2 = mockPerson(6l, birthday, "345345-3453", Sex.MALE, 6l);
    
    Person[] personArray = { person, staff1, staff2, staff3, staff4, studentPerson2 };
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

    Student student1 = mockStudent(1l, 1l, "Test", "User", "testuser@made.up", tags, variables, payloads);
    Student student2 = mockStudent(6l, 6l, "Hidden", "Dragon", "crouchingtiger@made.up", tags, variables, payloads);

    StaffMember staffMember1 = mockStaffMember(2l, 2l, "Test", "Staff1member", "teacher@made.up", UserRole.USER, tags, variables, payloads);
    StaffMember staffMember2 = mockStaffMember(3l, 3l, "Test", "Staff2member", "mana@made.up", UserRole.MANAGER, tags, variables, payloads);
    StaffMember staffMember3 = mockStaffMember(4l, 4l, "Test", "Administrator", "admin@made.up", UserRole.ADMINISTRATOR, tags, variables, payloads);
    StaffMember staffMember4 = mockStaffMember(5l, 5l, "Trusted", "System", "trusted@made.up", UserRole.TRUSTED_SYSTEM, tags, variables, payloads);

    Student[] studentArray = { student1, student2 };
    StaffMember[] staffArray = { staffMember1, staffMember2, staffMember3, staffMember4 };

    String studentArrayJson = objectMapper.writeValueAsString(studentArray);
    String staffArrayJson = objectMapper.writeValueAsString(staffArray);

    stubFor(get(urlMatching("/1/students/students?filterArchived=false&firstResult=.*&maxResults=.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));

    stubFor(get(urlEqualTo("/1/staff/members"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffArrayJson)
        .withStatus(200)));

    Map<Long, List<Student>> personStudents = new HashMap<>();
    Map<Long, List<StaffMember>> personStaffMembers = new HashMap<>();
    
    for (Student student : studentArray) {
      if (!personStudents.containsKey(student.getPersonId())) {
        personStudents.put(student.getPersonId(), new ArrayList<Student>());
      }
      
      personStudents.get(student.getPersonId()).add(student);
    }
    
    for (StaffMember staffMember : staffArray) {
      if (!personStaffMembers.containsKey(staffMember.getPersonId())) {
        personStaffMembers.put(staffMember.getPersonId(), new ArrayList<StaffMember>());
      }
      
      personStaffMembers.get(staffMember.getPersonId()).add(staffMember);
    }
    
    for (Long personId : personStudents.keySet()) {
      stubFor(get(urlMatching(String.format("/1/persons/persons/%d/students", personId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(personStudents.get(personId)))
            .withStatus(200)));
    }
    
    for (Long personId : personStaffMembers.keySet()) {
      stubFor(get(urlMatching(String.format("/1/persons/persons/%d/staffMembers", personId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(objectMapper.writeValueAsString(personStaffMembers.get(personId)))
            .withStatus(200)));
    }

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
  
  public static void mockWorkspaces(List<String> payloads) throws JsonProcessingException {
    mockWorkspace(1l, payloads);
  }
  
  public static void mockWorkspace(Long id, List<String> payloads) throws JsonProcessingException {
    DateTime created = new DateTime(1990, 2, 2, 0, 0, 0, 0);
    DateTime begin = new DateTime(2000, 1, 1, 0, 0, 0, 0);
    DateTime end = new DateTime(2050, 1, 1, 0, 0, 0, 0);

    Course course = new Course(id, "testCourse", created, created, "test course for testing", false, 1, 
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
  }

  public static void mockCommons() throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

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
  
  public static void mockUserGroups(List<String> payloads) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    DateTime begin = new DateTime(2000, 1, 1, 0, 0, 0, 0);
    Long creatorId = 1l;
    Long groupId = 2l;
    
    StudentGroup studentGroup = new StudentGroup(groupId, "Group1", "", begin, creatorId, begin, creatorId, begin, null, false);
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

    StudentGroupUser studentGroupStaffMember = new StudentGroupUser(1l, 4l);
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
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    Long courseId = 1l;
    Long teacherRoleId = 7l;
    
    CourseStaffMember staffMember = new CourseStaffMember(1l, courseId, 4l, teacherRoleId);
    CourseStaffMember[] staffMembers = { staffMember };

    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers", courseId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(staffMembers))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/staffMembers/%d", courseId, staffMember.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(staffMember))
          .withStatus(200)));

    addPayload(payloads, objectMapper.writeValueAsString(new WebhookCourseStaffMemberCreatePayload(1l, courseId, staffMember.getId())));
    
    DateTime enrolmentTime = new DateTime(1999, 1, 1, 0, 0, 0, 0);
    CourseStudent student = new CourseStudent(2l, courseId, 1l, enrolmentTime, false, null, null, false, null, null);
    CourseStudent[] students = { student };

    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students", courseId)))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(students))
          .withStatus(200)));
    
    stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d/students/%d", courseId, student.getId())))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(objectMapper.writeValueAsString(student))
          .withStatus(200)));
    
    addPayload(payloads, objectMapper.writeValueAsString(new WebhookCourseStudentCreatePayload(2l, courseId, student.getId())));
  }
  
  private static void addPayload(List<String> payloads, Object obj) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    addPayload(payloads, objectMapper.writeValueAsString(obj));
  }
  
  private static void addPayload(List<String> payloads, String payload) {
    if (payloads != null)
      payloads.add(payload);
  }
  
}
package fi.otavanopisto.muikku.search;

import java.time.OffsetDateTime;
import java.util.Set;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldType;

@Indexable (
  indexName = IndexedUser.INDEX_NAME,
  typeName = IndexedUser.TYPE_NAME,
  options = {
    @IndexableFieldOption (
      name = "identifier",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "schoolDataSource",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "roles",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "firstName",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "lastName",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "email",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "studyProgrammeIdentifier",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "curriculumIdentifier",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "organizationIdentifier",
      type = IndexableFieldType.KEYWORD
    )
  }
)
public class IndexedUser {

  public static final String INDEX_NAME = "muikku_user";
  public static final String TYPE_NAME = "User";

  public IndexedUser() {
  }

  @IndexId
  public String getSearchId() {
    return getIdentifier() + "/" + getSchoolDataSource();
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }
  
  public String getIdentifier() {
    return identifier;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getLastName() {
    return lastName;
  }
  
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  public void setStudyProgrammeIdentifier(SchoolDataIdentifier studyProgrammeIdentifier) {
    this.studyProgrammeIdentifier = studyProgrammeIdentifier;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getStudyProgrammeIdentifier() {
    return studyProgrammeIdentifier;
  }
  
  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getMunicipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  public OffsetDateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(OffsetDateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }
  
  public OffsetDateTime getStudyEndDate() {
    return this.studyEndDate;
  }
  
  public void setStudyEndDate(OffsetDateTime studyEndDate) {
    this.studyEndDate = studyEndDate;
  }

  public OffsetDateTime getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(OffsetDateTime studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
  }

  public boolean getHidden() {
    return hidden;
  }

  public void setHidden(boolean hidden) {
    this.hidden = hidden;
  }
  
  public void setHasEvaluationFees(boolean evaluationFees) {
    this.evaluationFees = evaluationFees;
  }

  public boolean getHasEvaluationFees() {
    return evaluationFees;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(SchoolDataIdentifier curriculumIdentifier) {
    this.curriculumIdentifier = curriculumIdentifier;
  }

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  public void setOrganizationIdentifier(SchoolDataIdentifier organizationIdentifier) {
    this.organizationIdentifier = organizationIdentifier;
  }

  public String getSchoolDataSource() {
    return schoolDataSource;
  }

  public void setSchoolDataSource(String schoolDataSource) {
    this.schoolDataSource = schoolDataSource;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  @IndexField(name = "isDefaultIdentifier")
  public Boolean getDefaultIdentifier() {
    return defaultIdentifier;
  }

  public void setDefaultIdentifier(Boolean defaultIdentifier) {
    this.defaultIdentifier = defaultIdentifier;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Set<Long> getWorkspaces() {
    return workspaces;
  }

  public void setWorkspaces(Set<Long> workspaces) {
    this.workspaces = workspaces;
  }

  public Set<Long> getGroups() {
    return groups;
  }

  public void setGroups(Set<Long> groups) {
    this.groups = groups;
  }

  public Set<IndexedUserStudyPeriod> getStudyPeriods() {
    return studyPeriods;
  }

  public void setStudyPeriods(Set<IndexedUserStudyPeriod> studyPeriods) {
    this.studyPeriods = studyPeriods;
  }

  public Set<EnvironmentRoleArchetype> getRoles() {
    return roles;
  }

  public void setRoles(Set<EnvironmentRoleArchetype> roles) {
    this.roles = roles;
  }

  private String identifier;
  private String schoolDataSource;
  private String firstName;
  private String lastName;
  private String displayName;
  private String studyProgrammeName;
  private SchoolDataIdentifier studyProgrammeIdentifier;
  private String nationality;
  private String language;
  private String municipality;
  private String school;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyEndDate;
  private OffsetDateTime studyTimeEnd;
  private boolean hidden;
  private boolean evaluationFees;
  private SchoolDataIdentifier curriculumIdentifier;
  private SchoolDataIdentifier organizationIdentifier;
  private String nickName;
  private Set<EnvironmentRoleArchetype> roles;
  private Long userEntityId;
  private Boolean defaultIdentifier;
  private String email;
  private Set<Long> workspaces;
  private Set<Long> groups;
  private Set<IndexedUserStudyPeriod> studyPeriods;
}
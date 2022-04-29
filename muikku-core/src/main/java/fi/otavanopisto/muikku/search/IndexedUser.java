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

@Indexable (
  name = "User",
  options = {
    @IndexableFieldOption (
      name = "email",
      type = "string",
      index = "not_analyzed"
    ),
    @IndexableFieldOption (
      name = "organizationIdentifier",
      type = "multi_field",
      multiFields = {
        @IndexableFieldMultiField(name = "organizationIdentifier", type="string", index = "analyzed"),
        @IndexableFieldMultiField(name = "untouched", type="string", index = "not_analyzed")
      }
    )
  }
)
public class IndexedUser {

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

  public String getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(String curriculumIdentifier) {
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

  public EnvironmentRoleArchetype getArchetype() {
    return archetype;
  }

  public void setArchetype(EnvironmentRoleArchetype archetype) {
    this.archetype = archetype;
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
  private String curriculumIdentifier;
  private SchoolDataIdentifier organizationIdentifier;
  private String nickName;
  private EnvironmentRoleArchetype archetype;
  private Long userEntityId;
  private Boolean defaultIdentifier;
  private String email;
  private Set<Long> workspaces;
  private Set<Long> groups;

}
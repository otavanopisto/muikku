package fi.otavanopisto.muikku.search;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldType;
import fi.otavanopisto.muikku.search.annotations.IndexableSubObject;

@Indexable (
  indexName = IndexedWorkspace.INDEX_NAME,
  typeName = IndexedWorkspace.TYPE_NAME,
  options = {
    // TODO check all these, likely the text versions are not needed for the identifiers
      
    @IndexableFieldOption (
      name = "identifier",
      type = IndexableFieldType.KEYWORD
    ),
    @IndexableFieldOption (
      name = "name",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "name", type = IndexableFieldType.TEXT),
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "educationTypeIdentifier",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "educationTypeIdentifier", type = IndexableFieldType.TEXT),
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "curriculumIdentifiers",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "curriculumIdentifiers", type = IndexableFieldType.TEXT),
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "signupPermissionGroups",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "signupPermissionGroups", type = IndexableFieldType.TEXT),
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "organizationIdentifier",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "organizationIdentifier", type = IndexableFieldType.TEXT),
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "workspaceTypeId",
      type = IndexableFieldType.TEXT,
      multiFields = {
        @IndexableFieldMultiField(name = "workspaceTypeId", type=IndexableFieldType.TEXT),
        @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
      }
    ),
    @IndexableFieldOption (
      name = "access",
      type = IndexableFieldType.KEYWORD
    )
  },
  subObjects = {
    @IndexableSubObject (
      name = "subjects",
      options = {
        @IndexableFieldOption (
          name = "subjectIdentifier",
          type = IndexableFieldType.TEXT,
          multiFields = {
            @IndexableFieldMultiField(name = "identifier", type = IndexableFieldType.TEXT),
            @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
          }
        ),
        @IndexableFieldOption (
          name = "lengthUnitIdentifier",
          type = IndexableFieldType.TEXT,
          multiFields = {
            @IndexableFieldMultiField(name = "identifier", type = IndexableFieldType.TEXT),
            @IndexableFieldMultiField(name = "untouched", type = IndexableFieldType.KEYWORD)
          }
        )
      }
    )
  }
)
@JsonIgnoreProperties(ignoreUnknown = true)
public class IndexedWorkspace {

  public static final String INDEX_NAME = "muikku_workspace";
  public static final String TYPE_NAME = "Workspace";
  
  @IndexId
  public String getSearchId() {
    return getIdentifier().getIdentifier() + '/' + getIdentifier().getDataSource();
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  public void setIdentifier(SchoolDataIdentifier identifier) {
    this.identifier = identifier;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getNameExtension() {
    return nameExtension;
  }

  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }

  public String getViewLink() {
    return viewLink;
  }

  public void setViewLink(String viewLink) {
    this.viewLink = viewLink;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getWorkspaceTypeId() {
    return workspaceTypeId;
  }

  public void setWorkspaceTypeId(SchoolDataIdentifier workspaceTypeId) {
    this.workspaceTypeId = workspaceTypeId;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getEducationTypeIdentifier() {
    return educationTypeIdentifier;
  }

  public void setEducationTypeIdentifier(SchoolDataIdentifier educationTypeIdentifier) {
    this.educationTypeIdentifier = educationTypeIdentifier;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getEducationSubtypeIdentifier() {
    return educationSubtypeIdentifier;
  }

  public void setEducationSubtypeIdentifier(SchoolDataIdentifier educationSubtypeIdentifier) {
    this.educationSubtypeIdentifier = educationSubtypeIdentifier;
  }

  @IndexField (toId = true)
  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  public void setOrganizationIdentifier(SchoolDataIdentifier organizationIdentifier) {
    this.organizationIdentifier = organizationIdentifier;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  @IndexField (toId = true)
  public Set<SchoolDataIdentifier> getCurriculumIdentifiers() {
    return curriculumIdentifiers;
  }

  public void setCurriculumIdentifiers(Set<SchoolDataIdentifier> curriculumIdentifiers) {
    this.curriculumIdentifiers = curriculumIdentifiers;
  }

  @IndexField (name = "isTemplate")
  public boolean isTemplate() {
    return isTemplate;
  }

  public void setTemplate(boolean isTemplate) {
    this.isTemplate = isTemplate;
  }

  public void addSubject(IndexedWorkspaceSubject subject) {
    this.subjects.add(subject);
  }

  @IndexField (collection = true)
  public Set<IndexedWorkspaceSubject> getSubjects() {
    return subjects;
  }

  public void setSubjects(Set<IndexedWorkspaceSubject> subjects) {
    this.subjects = subjects;
  }

  public void addStaffMember(IndexedWorkspaceUser staffMember) {
    this.staffMembers.add(staffMember);
  }
  
  public Set<IndexedWorkspaceUser> getStaffMembers() {
    return staffMembers;
  }

  public void setStaffMembers(Set<IndexedWorkspaceUser> staffMembers) {
    this.staffMembers = staffMembers;
  }

  public WorkspaceAccess getAccess() {
    return access;
  }

  public void setAccess(WorkspaceAccess access) {
    this.access = access;
  }

  @IndexField (name = "published")
  public boolean isPublished() {
    return published;
  }

  public void setPublished(boolean published) {
    this.published = published;
  }

  @IndexField (toId = true)
  public Set<SchoolDataIdentifier> getSignupPermissionGroups() {
    return signupPermissionGroups;
  }

  public void setSignupPermissionGroups(Set<SchoolDataIdentifier> signupPermissionGroups) {
    this.signupPermissionGroups = signupPermissionGroups;
  }

  public String getEducationTypeName() {
    return educationTypeName;
  }

  public void setEducationTypeName(String educationTypeName) {
    this.educationTypeName = educationTypeName;
  }

  public OffsetDateTime getBeginDate() {
    return beginDate;
  }

  public void setBeginDate(OffsetDateTime beginDate) {
    this.beginDate = beginDate;
  }

  public OffsetDateTime getEndDate() {
    return endDate;
  }

  public void setEndDate(OffsetDateTime endDate) {
    this.endDate = endDate;
  }

  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier identifier;
  private String name;
  private String nameExtension;
  private String viewLink;
  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier workspaceTypeId;
  private String description;
  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier educationTypeIdentifier;
  private String educationTypeName;
  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier educationSubtypeIdentifier;
  @JsonDeserialize(using = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private SchoolDataIdentifier organizationIdentifier;
  private Date lastModified;
  private boolean isTemplate;

  @JsonDeserialize(contentUsing = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private Set<SchoolDataIdentifier> curriculumIdentifiers = new HashSet<>();
  private Set<IndexedWorkspaceSubject> subjects = new HashSet<>();
  
  private WorkspaceAccess access;
  private boolean published;
  private OffsetDateTime beginDate;
  private OffsetDateTime endDate;
  private Set<IndexedWorkspaceUser> staffMembers = new HashSet<>();
  @JsonDeserialize(contentUsing = IndexedSchoolDataIdentifierAsIdDeserializer.class)
  private Set<SchoolDataIdentifier> signupPermissionGroups = new HashSet<>();
}

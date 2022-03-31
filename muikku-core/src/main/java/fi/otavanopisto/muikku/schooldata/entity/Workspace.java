package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.Set;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldType;

@Indexable (
  indexName = Workspace.INDEX_NAME,
  typeName = Workspace.TYPE_NAME,
  options = {
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
  }
)
public interface Workspace extends SchoolDataEntity {

  public static final String INDEX_NAME = "muikku_workspace";
  public static final String TYPE_NAME = "Workspace";

  public String getIdentifier();

  public String getName();

  public void setName(String name);
  
  public String getNameExtension();
  
  public void setNameExtension(String name);

  public String getDescription();

  public void setDescription(String description);

  public OffsetDateTime getBeginDate();
  
  public void setBeginDate(OffsetDateTime beginDate);

  public OffsetDateTime getEndDate();
  
  public void setEndDate(OffsetDateTime endDate);

  @IndexField (
    toId = true
  )
  public SchoolDataIdentifier getWorkspaceTypeId();
  public void setWorkspaceTypeId(SchoolDataIdentifier workspaceTypeId);

  // TODO: public String getCourseIdentifierDataSource();

  public String getCourseIdentifierIdentifier();

  public Date getLastModified();

  public String getSubjectIdentifier();

  @IndexField (
    toId = true
  )
  public SchoolDataIdentifier getEducationTypeIdentifier();

  @IndexField (
    toId = true
  )
  public SchoolDataIdentifier getEducationSubtypeIdentifier();

  @IndexField (
    toId = true
  )
  public SchoolDataIdentifier getOrganizationIdentifier();

  public Double getLength();

  public String getLengthUnitIdentifier();

  public boolean isArchived();
  
  public boolean isEvaluationFeeApplicable();

  public String getViewLink();
  
  public Integer getCourseNumber();
  
  public boolean isTemplate();

  @IndexId
  public String getSearchId();

  @IndexField (
    toId = true
  )
  public Set<SchoolDataIdentifier> getCurriculumIdentifiers();
}

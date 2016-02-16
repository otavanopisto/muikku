package fi.muikku.schooldata.entity;

import java.util.Date;

import org.joda.time.DateTime;

import fi.muikku.search.annotations.IndexField;
import fi.muikku.search.annotations.IndexId;
import fi.muikku.search.annotations.Indexable;
import fi.muikku.search.annotations.IndexableFieldOption;
import fi.muikku.search.annotations.IndexableFieldMultiField;

@Indexable (
  name = "Workspace",
  options = {
    @IndexableFieldOption (
      name = "name",
      type = "multi_field",
      multiFields = {
        @IndexableFieldMultiField(name = "name", type="string", index = "analyzed"),
        @IndexableFieldMultiField(name = "untouched", type="string", index = "not_analyzed")
      }
    )
  }
)
public interface Workspace extends SchoolDataEntity {

  public String getIdentifier();

  public String getName();

  public void setName(String name);
  
  public String getNameExtension();
  
  public void setNameExtension(String name);

  public String getDescription();

  public void setDescription(String description);

  @IndexField (skip = true)
  public DateTime getBeginDate();
  
  public void setBeginDate(DateTime beginDate);

  @IndexField (skip = true)
  public DateTime getEndDate();
  
  public void setEndDate(DateTime endDate);

  // TODO: public String getWorkspaceTypeDataSource();

  public String getWorkspaceTypeId();

  // TODO: public String getCourseIdentifierDataSource();

  public String getCourseIdentifierIdentifier();

  public Date getLastModified();

  public String getSubjectIdentifier();

  public String getEducationTypeIdentifier();

  public Double getLength();

  public String getLengthUnitIdentifier();

  public boolean isArchived();
  
  public boolean isEvaluationFeeApplicable();

  public String getViewLink();

  @IndexId
  public String getSearchId();

}

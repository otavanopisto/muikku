package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

import org.joda.time.DateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;

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

  public DateTime getBeginDate();
  
  public void setBeginDate(DateTime beginDate);

  public DateTime getEndDate();
  
  public void setEndDate(DateTime endDate);

  public SchoolDataIdentifier getWorkspaceTypeId();
  public void setWorkspaceTypeId(SchoolDataIdentifier workspaceTypeId);

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

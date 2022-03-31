package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldType;

@Indexable (
  indexName = User.INDEX_NAME,
  typeName = User.TYPE_NAME,
  options = {
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
      name = "organizationIdentifier",
      type = IndexableFieldType.KEYWORD
//      multiFields = {
//        @IndexableFieldMultiField(name = "organizationIdentifier", type="string", index = "analyzed"),
//        @IndexableFieldMultiField(name = "untouched", type="string", index = "not_analyzed")
//      }
    )
  }
)
public interface User extends SchoolDataEntity {

  public static final String INDEX_NAME = "muikku_user";
  public static final String TYPE_NAME = "User";

  public String getIdentifier();

  public String getFirstName();

  public void setFirstName(String firstName);

  public String getLastName();

  public void setLastName(String lastName);
  
  public String getSsn();
  
  public void setSsn(String ssn);

  public String getDisplayName();
  
  public String getStudyProgrammeName();

  @IndexField (toId = true)
  public SchoolDataIdentifier getStudyProgrammeIdentifier();
  
  public String getNationality();
  
  public void setNationality(String nationality);
  
  public String getLanguage();
  
  public void setLanguage(String language);
  
  public String getMunicipality();
  
  public void setMunicipality(String municipality);
  
  public String getSchool();
  
  public void setSchool(String school);

  @IndexId
  public String getSearchId();

  public OffsetDateTime getStudyStartDate();

  public OffsetDateTime getStudyEndDate();
  
  public OffsetDateTime getStudyTimeEnd();

  public boolean getHidden();
  
  public boolean getHasEvaluationFees();
  
  public String getCurriculumIdentifier();
  
  @IndexField (toId = true)
  public SchoolDataIdentifier getOrganizationIdentifier();
  
  public void setNickName(String nickName);

  public String getNickName();  
}
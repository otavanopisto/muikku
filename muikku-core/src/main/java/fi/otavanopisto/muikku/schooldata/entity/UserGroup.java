package fi.otavanopisto.muikku.schooldata.entity;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldType;

@Indexable (
    indexName = UserGroup.INDEX_NAME,
    typeName = UserGroup.TYPE_NAME,
    options = {
        @IndexableFieldOption (
          name = "organizationIdentifier",
          type = IndexableFieldType.KEYWORD
        )
    }
)
public interface UserGroup extends SchoolDataEntity {
  
  public static final String INDEX_NAME = "muikku_usergroup";
  public static final String TYPE_NAME = "UserGroup";

  public String getIdentifier();

  public String getName();
  
  public String getArchetype();

  public boolean getIsGuidanceGroup();
  
  @IndexField (toId = true)
  public SchoolDataIdentifier getOrganizationIdentifier();
  
  @IndexId
  public String getSearchId();
  
}
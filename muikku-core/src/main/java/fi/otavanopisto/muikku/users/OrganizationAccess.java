package fi.otavanopisto.muikku.users;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class OrganizationAccess {

  public OrganizationAccess(SchoolDataIdentifier organizationIdentifier, boolean listTemplates, boolean listUnpublished) {
    this.organizationIdentifier = organizationIdentifier;
    this.listTemplates = listTemplates;
    this.listUnpublished = listUnpublished;
  }
  
  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
  }
  
  public boolean isListTemplates() {
    return listTemplates;
  }
  
  public boolean isListUnpublished() {
    return listUnpublished;
  }
  
  private final SchoolDataIdentifier organizationIdentifier;
  private final boolean listTemplates;
  private final boolean listUnpublished;
}

package fi.otavanopisto.muikku.schooldata.events;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class SchoolDataUserEventIdentifier {

  public SchoolDataUserEventIdentifier(SchoolDataIdentifier identifier, SchoolDataIdentifier environmentRoleIdentifier, 
      SchoolDataIdentifier organizationIdentifier) {
    this.identifier = identifier;
    this.environmentRoleIdentifier = environmentRoleIdentifier;
    this.organizationIdentifier = organizationIdentifier;
  }

  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  public void addEmail(String email) {
    this.emails.add(email);
  }
  
  public List<String> getEmails() {
    return emails;
  }

  public SchoolDataIdentifier getEnvironmentRoleIdentifier() {
    return environmentRoleIdentifier;
  }

  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  private final SchoolDataIdentifier identifier;
  private final List<String> emails = new ArrayList<>();
  private final SchoolDataIdentifier environmentRoleIdentifier;
  private final SchoolDataIdentifier organizationIdentifier;
}

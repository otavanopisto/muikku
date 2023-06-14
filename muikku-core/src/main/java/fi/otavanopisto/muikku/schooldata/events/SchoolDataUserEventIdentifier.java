package fi.otavanopisto.muikku.schooldata.events;

import java.util.ArrayList;
import java.util.List;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;

public class SchoolDataUserEventIdentifier {

  public SchoolDataUserEventIdentifier(SchoolDataIdentifier identifier, List<SchoolDataIdentifier> environmentRoleIdentifiers, 
      SchoolDataIdentifier organizationIdentifier) {
    this.identifier = identifier;
    this.environmentRoleIdentifiers = environmentRoleIdentifiers;
    this.organizationIdentifier = organizationIdentifier;
  }

  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  public void addEmail(UserEmail email) {
    this.emails.add(email);
  }
  
  public List<UserEmail> getEmails() {
    return emails;
  }

  public List<SchoolDataIdentifier> getEnvironmentRoleIdentifiers() {
    return environmentRoleIdentifiers;
  }

  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  private final SchoolDataIdentifier identifier;
  private final List<UserEmail> emails = new ArrayList<>();
  private final List<SchoolDataIdentifier> environmentRoleIdentifiers;
  private final SchoolDataIdentifier organizationIdentifier;
}

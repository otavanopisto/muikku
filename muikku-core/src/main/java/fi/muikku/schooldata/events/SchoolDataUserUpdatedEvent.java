package fi.muikku.schooldata.events;

import java.util.List;

import fi.muikku.schooldata.SchoolDataIdentifier;

public class SchoolDataUserUpdatedEvent {

  public SchoolDataUserUpdatedEvent(Long userEntityId, SchoolDataIdentifier environmentRoleIdentifier, List<SchoolDataIdentifier> discoveredIdentifiers, List<SchoolDataIdentifier> updatedIdentifiers,
      List<SchoolDataIdentifier> removedIdentifiers, SchoolDataIdentifier defaultIdentifier, List<String> emails) {
    super();
    this.userEntityId = userEntityId;
    this.environmentRoleIdentifier = environmentRoleIdentifier;
    this.discoveredIdentifiers = discoveredIdentifiers;
    this.updatedIdentifiers = updatedIdentifiers;
    this.removedIdentifiers = removedIdentifiers;
    this.defaultIdentifier = defaultIdentifier;
    this.emails = emails;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public SchoolDataIdentifier getEnvironmentRoleIdentifier() {
    return environmentRoleIdentifier;
  }

  public List<SchoolDataIdentifier> getDiscoveredIdentifiers() {
    return discoveredIdentifiers;
  }

  public List<SchoolDataIdentifier> getUpdatedIdentifiers() {
    return updatedIdentifiers;
  }

  public List<SchoolDataIdentifier> getRemovedIdentifiers() {
    return removedIdentifiers;
  }

  public SchoolDataIdentifier getDefaultIdentifier() {
    return defaultIdentifier;
  }

  public List<String> getEmails() {
    return emails;
  }

  private Long userEntityId;
  private SchoolDataIdentifier environmentRoleIdentifier;
  private List<SchoolDataIdentifier> discoveredIdentifiers;
  private List<SchoolDataIdentifier> updatedIdentifiers;
  private List<SchoolDataIdentifier> removedIdentifiers;
  private SchoolDataIdentifier defaultIdentifier;
  private List<String> emails;
}

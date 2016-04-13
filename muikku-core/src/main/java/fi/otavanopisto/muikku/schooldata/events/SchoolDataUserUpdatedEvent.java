package fi.otavanopisto.muikku.schooldata.events;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class SchoolDataUserUpdatedEvent {

  public SchoolDataUserUpdatedEvent(Long userEntityId, SchoolDataIdentifier environmentRoleIdentifier, List<SchoolDataIdentifier> discoveredIdentifiers, List<SchoolDataIdentifier> updatedIdentifiers,
      List<SchoolDataIdentifier> removedIdentifiers, SchoolDataIdentifier defaultIdentifier, Map<SchoolDataIdentifier, List<String>> emails) {
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

  public Map<SchoolDataIdentifier, List<String>> getEmails() {
    return emails;
  }
  
  public Collection<String> getAllEmails() {
    HashSet<String> result = new HashSet<>();
    Iterator<List<String>> emailIterator = emails.values().iterator();
    while (emailIterator.hasNext()) {
      result.addAll(emailIterator.next());
    }
    return result;
  }

  private Long userEntityId;
  private SchoolDataIdentifier environmentRoleIdentifier;
  private List<SchoolDataIdentifier> discoveredIdentifiers;
  private List<SchoolDataIdentifier> updatedIdentifiers;
  private List<SchoolDataIdentifier> removedIdentifiers;
  private SchoolDataIdentifier defaultIdentifier;
  private Map<SchoolDataIdentifier, List<String>> emails;
}

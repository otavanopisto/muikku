package fi.otavanopisto.muikku.schooldata.events;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.UserEmail;

public class SchoolDataUserUpdatedEvent {

  public SchoolDataUserUpdatedEvent(Long userEntityId, SchoolDataIdentifier defaultIdentifier) {
    super();
    this.userEntityId = userEntityId;
    this.defaultIdentifier = defaultIdentifier;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public SchoolDataUserEventIdentifier addDiscoveredIdentifier(SchoolDataIdentifier identifier, List<SchoolDataIdentifier> roleIdentifiers, SchoolDataIdentifier organizationIdentifier) {
    SchoolDataUserEventIdentifier eventIdentifier = new SchoolDataUserEventIdentifier(identifier, roleIdentifiers, organizationIdentifier);
    discoveredIdentifiers.add(eventIdentifier);
    return eventIdentifier;
  }
  
  public List<SchoolDataUserEventIdentifier> getDiscoveredIdentifiers() {
    return discoveredIdentifiers;
  }

  public SchoolDataUserEventIdentifier addUpdatedIdentifier(SchoolDataIdentifier identifier, List<SchoolDataIdentifier> roleIdentifiers, SchoolDataIdentifier organizationIdentifier) {
    SchoolDataUserEventIdentifier eventIdentifier = new SchoolDataUserEventIdentifier(identifier, roleIdentifiers, organizationIdentifier);
    updatedIdentifiers.add(eventIdentifier);
    return eventIdentifier;
  }
  
  public List<SchoolDataUserEventIdentifier> getUpdatedIdentifiers() {
    return updatedIdentifiers;
  }

  public SchoolDataUserEventIdentifier addRemovedIdentifier(SchoolDataIdentifier identifier, List<SchoolDataIdentifier> roleIdentifiers, SchoolDataIdentifier organizationIdentifier) {
    SchoolDataUserEventIdentifier eventIdentifier = new SchoolDataUserEventIdentifier(identifier, roleIdentifiers, organizationIdentifier);
    removedIdentifiers.add(eventIdentifier);
    return eventIdentifier;
  }
  
  public List<SchoolDataUserEventIdentifier> getRemovedIdentifiers() {
    return removedIdentifiers;
  }

  public SchoolDataIdentifier getDefaultIdentifier() {
    return defaultIdentifier;
  }

  public Set<UserEmail> getAllEmails() {
    Set<UserEmail> result = new HashSet<>();
    
    result.addAll(discoveredIdentifiers
        .stream().map(eventIdentifier -> eventIdentifier.getEmails()).flatMap(List::stream).collect(Collectors.toSet()));
    result.addAll(updatedIdentifiers
        .stream().map(eventIdentifier -> eventIdentifier.getEmails()).flatMap(List::stream).collect(Collectors.toSet()));
    result.addAll(removedIdentifiers
        .stream().map(eventIdentifier -> eventIdentifier.getEmails()).flatMap(List::stream).collect(Collectors.toSet()));
    
    return result;
  }

  private Long userEntityId;
  private SchoolDataIdentifier defaultIdentifier;
  private final List<SchoolDataUserEventIdentifier> discoveredIdentifiers = new ArrayList<>();
  private final List<SchoolDataUserEventIdentifier> updatedIdentifiers = new ArrayList<>();
  private final List<SchoolDataUserEventIdentifier> removedIdentifiers = new ArrayList<>();
}

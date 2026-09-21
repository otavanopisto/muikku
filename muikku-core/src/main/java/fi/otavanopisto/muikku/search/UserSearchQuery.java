package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class UserSearchQuery {

  private final static int DEFAULT_START = 0;
  private final static int DEFAULT_MAXRESULTS = 10;
  
  private final List<OrganizationEntity> organizations;
  private final Set<SchoolDataIdentifier> studyProgrammeIdentifiers;
  private final String text;
  private final String[] textFields;
  private final Collection<EnvironmentRoleArchetype> roles;
  private final Collection<Long> groups;
  private final Collection<Long> workspaces;
  private final Collection<SchoolDataIdentifier> userIdentifiers;
  private final Boolean includeInactiveStudents;
  private final Boolean includeHidden;
  private final Boolean onlyDefaultUsers;
  private final int start;
  private final int maxResults;
  private final Collection<String> resultFields;
  private final Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers;
  private final Date startedStudiesBefore;
  private final Date studyTimeEndsBefore;
  private final boolean joinGroupsAndWorkspaces;
  private final Set<IndexedUserPedagogyFormState> hasPedagogyForm;
  private final Set<Boolean> hasDecisionOnSpecialEducation;

  private UserSearchQuery(Builder builder) {
    this.organizations = builder.organizations;
    this.studyProgrammeIdentifiers = builder.studyProgrammeIdentifiers;
    this.text = builder.text;
    this.textFields = builder.textFields;
    this.roles = builder.roles;
    this.groups = builder.groups;
    this.workspaces = builder.workspaces;
    this.userIdentifiers = builder.userIdentifiers;
    this.includeInactiveStudents = builder.includeInactiveStudents;
    this.includeHidden = builder.includeHidden;
    this.onlyDefaultUsers = builder.onlyDefaultUsers;
    this.start = builder.start;
    this.maxResults = builder.maxResults;
    this.resultFields = builder.resultFields;
    this.excludeSchoolDataIdentifiers = builder.excludeSchoolDataIdentifiers;
    this.startedStudiesBefore = builder.startedStudiesBefore;
    this.studyTimeEndsBefore = builder.studyTimeEndsBefore;
    this.joinGroupsAndWorkspaces = builder.joinGroupsAndWorkspaces;
    this.hasPedagogyForm = builder.hasPedagogyForm;
    this.hasDecisionOnSpecialEducation = builder.hasDecisionOnSpecialEducation;
  }

  public List<OrganizationEntity> getOrganizations() {
    return organizations;
  }

  public Set<SchoolDataIdentifier> getStudyProgrammeIdentifiers() {
    return studyProgrammeIdentifiers;
  }

  public String getText() {
    return text;
  }

  public String[] getTextFields() {
    return textFields;
  }

  public Collection<EnvironmentRoleArchetype> getRoles() {
    return roles;
  }

  public Collection<Long> getGroups() {
    return groups;
  }

  public Collection<Long> getWorkspaces() {
    return workspaces;
  }

  public Collection<SchoolDataIdentifier> getUserIdentifiers() {
    return userIdentifiers;
  }

  public Boolean getIncludeInactiveStudents() {
    return includeInactiveStudents;
  }

  public Boolean getIncludeHidden() {
    return includeHidden;
  }

  public Boolean getOnlyDefaultUsers() {
    return onlyDefaultUsers;
  }

  public int getStart() {
    return start;
  }

  public int getMaxResults() {
    return maxResults;
  }

  public Collection<String> getResultFields() {
    return resultFields;
  }

  public Collection<SchoolDataIdentifier> getExcludeSchoolDataIdentifiers() {
    return excludeSchoolDataIdentifiers;
  }

  public Date getStartedStudiesBefore() {
    return startedStudiesBefore;
  }

  public Date getStudyTimeEndsBefore() {
    return studyTimeEndsBefore;
  }

  public boolean isJoinGroupsAndWorkspaces() {
    return joinGroupsAndWorkspaces;
  }

  public Set<IndexedUserPedagogyFormState> getHasPedagogyForm() {
    return hasPedagogyForm;
  }

  public Set<Boolean> getHasDecisionOnSpecialEducation() {
    return hasDecisionOnSpecialEducation;
  }

  public static class Builder {
    private List<OrganizationEntity> organizations;
    private Set<SchoolDataIdentifier> studyProgrammeIdentifiers;
    private String text;
    private String[] textFields;
    private Collection<EnvironmentRoleArchetype> roles;
    private Collection<Long> groups;
    private Collection<Long> workspaces;
    private Collection<SchoolDataIdentifier> userIdentifiers;
    private Boolean includeInactiveStudents;
    private Boolean includeHidden;
    private Boolean onlyDefaultUsers;
    private int start = DEFAULT_START;
    private int maxResults = DEFAULT_MAXRESULTS;
    private Collection<String> resultFields;
    private Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers;
    private Date startedStudiesBefore;
    private Date studyTimeEndsBefore;
    private boolean joinGroupsAndWorkspaces = false;
    private Set<IndexedUserPedagogyFormState> hasPedagogyForm;
    private Set<Boolean> hasDecisionOnSpecialEducation;

    public UserSearchQuery build() {
      return new UserSearchQuery(this);
    }
    
    public Builder organizations(List<OrganizationEntity> organizations) {
      this.organizations = organizations;
      return this;
    }

    public Builder studyProgrammeIdentifiers(Set<SchoolDataIdentifier> studyProgrammeIdentifiers) {
      this.studyProgrammeIdentifiers = studyProgrammeIdentifiers;
      return this;
    }

    public Builder text(String text) {
      this.text = text;
      return this;
    }

    public Builder textFields(String[] textFields) {
      this.textFields = textFields;
      return this;
    }

    public Builder roles(Collection<EnvironmentRoleArchetype> roles) {
      this.roles = roles;
      return this;
    }

    public Builder groups(Collection<Long> groups) {
      this.groups = groups;
      return this;
    }

    public Builder workspaces(Collection<Long> workspaces) {
      this.workspaces = workspaces;
      return this;
    }

    public Builder userIdentifiers(Collection<SchoolDataIdentifier> userIdentifiers) {
      this.userIdentifiers = userIdentifiers;
      return this;
    }

    public Builder includeInactiveStudents(Boolean includeInactiveStudents) {
      this.includeInactiveStudents = includeInactiveStudents;
      return this;
    }

    public Builder includeHidden(Boolean includeHidden) {
      this.includeHidden = includeHidden;
      return this;
    }

    public Builder onlyDefaultUsers(Boolean onlyDefaultUsers) {
      this.onlyDefaultUsers = onlyDefaultUsers;
      return this;
    }

    public Builder start(int start) {
      this.start = start;
      return this;
    }

    public Builder maxResults(int maxResults) {
      this.maxResults = maxResults;
      return this;
    }

    public Builder resultFields(Collection<String> resultFields) {
      this.resultFields = resultFields;
      return this;
    }

    public Builder excludeSchoolDataIdentifiers(Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers) {
      this.excludeSchoolDataIdentifiers = excludeSchoolDataIdentifiers;
      return this;
    }

    public Builder startedStudiesBefore(Date startedStudiesBefore) {
      this.startedStudiesBefore = startedStudiesBefore;
      return this;
    }

    public Builder studyTimeEndsBefore(Date studyTimeEndsBefore) {
      this.studyTimeEndsBefore = studyTimeEndsBefore;
      return this;
    }

    public Builder joinGroupsAndWorkspaces(boolean joinGroupsAndWorkspaces) {
      this.joinGroupsAndWorkspaces = joinGroupsAndWorkspaces;
      return this;
    }

    public Builder hasPedagogyForm(Set<IndexedUserPedagogyFormState> hasPedagogyForm) {
      this.hasPedagogyForm = hasPedagogyForm;
      return this;
    }

    public Builder hasDecisionOnSpecialEducation(Set<Boolean> hasDecisionOnSpecialEducation) {
      this.hasDecisionOnSpecialEducation = hasDecisionOnSpecialEducation;
      return this;
    }
  }
  
}

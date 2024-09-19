package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Set;

import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceLanguage;

public class WorkspaceSettingsRestModel {


  public WorkspaceSettingsRestModel() {
	  
  }

  public WorkspaceSettingsRestModel(
      Long id,
      Long organizationEntityId,
      String urlName,
      WorkspaceAccess access,
      boolean published,
      WorkspaceLanguage language,
      String name,
      String nameExtension,
      String description,
      OffsetDateTime beginDate,
      OffsetDateTime endDate,
      OffsetDateTime signupStart,
      OffsetDateTime signupEnd,
      String materialDefaultLicense,
      Mandatority mandatority,
      Set<String> curriculumIdentifiers,
      String workspaceTypeIdentifier,
      boolean hasCustomImage,
      boolean chatEnabled,
      String externalViewLink,
      WorkspaceSignupMessageRestModel defaultSignupMessage,
      Collection<WorkspaceSignupGroupRestModel> signupGroups,
      Collection<WorkspaceSignupMessageRestModel> signupMessages) {
    super();
    this.id = id;
    this.organizationEntityId = organizationEntityId;
    this.urlName = urlName;
    this.materialDefaultLicense = materialDefaultLicense;
    this.access = access;
    this.published = published;
    this.language = language;
    this.name = name;
    this.nameExtension = nameExtension;
    this.description = description;
    this.beginDate = beginDate;
    this.chatEnabled = chatEnabled;
    this.endDate = endDate;
    this.signupStart = signupStart;
    this.signupEnd = signupEnd;
    this.mandatority = mandatority;
    this.curriculumIdentifiers = curriculumIdentifiers;
    this.workspaceTypeIdentifier = workspaceTypeIdentifier;
    this.hasCustomImage = hasCustomImage;
    this.defaultSignupMessage = defaultSignupMessage;
    this.signupGroups = signupGroups;
    this.signupMessages = signupMessages;
    this.externalViewLink = externalViewLink; 
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUrlName() {
    return urlName;
  }

  public void setUrlName(String urlName) {
    this.urlName = urlName;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public WorkspaceAccess getAccess() {
    return access;
  }

  public void setAccess(WorkspaceAccess access) {
    this.access = access;
  }

  public String getMaterialDefaultLicense() {
    return materialDefaultLicense;
  }

  public void setMaterialDefaultLicense(String materialDefaultLicense) {
    this.materialDefaultLicense = materialDefaultLicense;
  }

  public boolean getPublished() {
    return published;
  }

  public void setPublished(boolean published) {
    this.published = published;
  }

  public String getNameExtension() {
    return nameExtension;
  }

  public void setNameExtension(String nameExtension) {
    this.nameExtension = nameExtension;
  }

  public Set<String> getCurriculumIdentifiers() {
    return curriculumIdentifiers;
  }

  public void setCurriculumIdentifiers(Set<String> curriculumIdentifiers) {
    this.curriculumIdentifiers = curriculumIdentifiers;
  }

  public Mandatority getMandatority() {
    return mandatority;
  }

  public void setMandatority(Mandatority mandatority) {
    this.mandatority = mandatority;
  }

  public boolean getHasCustomImage() {
    return hasCustomImage;
  }

  public void setHasCustomImage(boolean hasCustomImage) {
    this.hasCustomImage = hasCustomImage;
  }

  public Long getOrganizationEntityId() {
    return organizationEntityId;
  }

  public void setOrganizationEntityId(Long organizationEntityId) {
    this.organizationEntityId = organizationEntityId;
  }

  public WorkspaceLanguage getLanguage() {
    return language;
  }

  public void setLanguage(WorkspaceLanguage language) {
    this.language = language;
  }

  public WorkspaceSignupMessageRestModel getDefaultSignupMessage() {
    return defaultSignupMessage;
  }

  public void setDefaultSignupMessage(WorkspaceSignupMessageRestModel defaultSignupMessage) {
    this.defaultSignupMessage = defaultSignupMessage;
  }

  public OffsetDateTime getBeginDate() {
    return beginDate;
  }

  public void setBeginDate(OffsetDateTime beginDate) {
    this.beginDate = beginDate;
  }

  public OffsetDateTime getEndDate() {
    return endDate;
  }

  public void setEndDate(OffsetDateTime endDate) {
    this.endDate = endDate;
  }

  public OffsetDateTime getSignupStart() {
    return signupStart;
  }

  public void setSignupStart(OffsetDateTime signupStart) {
    this.signupStart = signupStart;
  }

  public OffsetDateTime getSignupEnd() {
    return signupEnd;
  }

  public void setSignupEnd(OffsetDateTime signupEnd) {
    this.signupEnd = signupEnd;
  }

  public String getWorkspaceTypeIdentifier() {
    return workspaceTypeIdentifier;
  }

  public void setWorkspaceTypeIdentifier(String workspaceTypeIdentifier) {
    this.workspaceTypeIdentifier = workspaceTypeIdentifier;
  }

  public Collection<WorkspaceSignupGroupRestModel> getSignupGroups() {
    return signupGroups;
  }

  public void setSignupGroups(Collection<WorkspaceSignupGroupRestModel> signupGroups) {
    this.signupGroups = signupGroups;
  }

  public Collection<WorkspaceSignupMessageRestModel> getSignupMessages() {
    return signupMessages;
  }

  public void setSignupMessages(Collection<WorkspaceSignupMessageRestModel> signupMessages) {
    this.signupMessages = signupMessages;
  }

  public boolean isChatEnabled() {
    return chatEnabled;
  }

  public void setChatEnabled(boolean chatEnabled) {
    this.chatEnabled = chatEnabled;
  }
  
  public String getExternalViewLink()  {
	  return externalViewLink;
  }

  public void setExternalViewLink(String externalViewLink)  {
	  this.externalViewLink = externalViewLink;
  }
  
  private Long id;
  private Long organizationEntityId;
  private String workspaceTypeIdentifier;
  private String urlName;
  private String name;
  private String nameExtension;
  private String description;
  private String externalViewLink;
  private Mandatority mandatority;
  private WorkspaceAccess access;
  private String materialDefaultLicense;
  private boolean published;
  private Set<String> curriculumIdentifiers;
  private boolean hasCustomImage;
  private boolean chatEnabled;
  private WorkspaceLanguage language;
  private WorkspaceSignupMessageRestModel defaultSignupMessage;
  private Collection<WorkspaceSignupGroupRestModel> signupGroups;
  private OffsetDateTime beginDate;
  private OffsetDateTime endDate;
  private OffsetDateTime signupStart;
  private OffsetDateTime signupEnd;
  private Collection<WorkspaceSignupMessageRestModel> signupMessages;

}

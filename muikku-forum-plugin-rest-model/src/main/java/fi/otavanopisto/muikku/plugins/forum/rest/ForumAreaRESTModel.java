package fi.otavanopisto.muikku.plugins.forum.rest;


public class ForumAreaRESTModel {

  public ForumAreaRESTModel() {
    
  }
  
  public ForumAreaRESTModel(Long id, String name, Long groupId, Long numThreads) {
    this.id = id;
    this.name = name;
    this.groupId = groupId;
    this.numThreads = numThreads;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getGroupId() {
    return groupId;
  }

  public void setGroupId(Long groupId) {
    this.groupId = groupId;
  }

  public Long getNumThreads() {
    return numThreads;
  }

  public void setNumThreads(Long numThreads) {
    this.numThreads = numThreads;
  }

  private Long id;
  private String name;
  private Long groupId;
  private Long numThreads;
}

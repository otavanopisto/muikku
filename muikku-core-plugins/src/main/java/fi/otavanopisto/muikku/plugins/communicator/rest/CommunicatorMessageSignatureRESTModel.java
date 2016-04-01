package fi.otavanopisto.muikku.plugins.communicator.rest;


public class CommunicatorMessageSignatureRESTModel {

  public CommunicatorMessageSignatureRESTModel() {
    
  }
  
  public CommunicatorMessageSignatureRESTModel(Long id, String name, String signature) {
    this.id = id;
    this.name = name;
    this.signature = signature;
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

  public String getSignature() {
    return signature;
  }

  public void setSignature(String signature) {
    this.signature = signature;
  }

  private Long id;

  private String name;

  private String signature;

}

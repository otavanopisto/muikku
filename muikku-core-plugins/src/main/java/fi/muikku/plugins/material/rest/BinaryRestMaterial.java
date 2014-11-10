package fi.muikku.plugins.material.rest;

public class BinaryRestMaterial {
  
  public BinaryRestMaterial(long id, String contentType) {
    this.id = id;
    this.contentType = contentType;
    this.binaryUrl = "content";
  }
  
  public final long id;
  public final String contentType;
  public final String binaryUrl;
}

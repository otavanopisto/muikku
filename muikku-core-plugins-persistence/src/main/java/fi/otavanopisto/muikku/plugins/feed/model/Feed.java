package fi.otavanopisto.muikku.plugins.feed.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
public class Feed {

  public Long getId() {
    return id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }
  
  public String getFormat() {
    return format;
  }
  
  public void setFormat(String format) {
    this.format = format;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @NotEmpty
  @Column(nullable = false, unique = true)
  private String name;

  @NotNull
  @NotEmpty
  @Column(nullable = false)
  private String url;

  @NotNull
  @NotEmpty
  @Column(nullable = false, unique = true)
  private String format;
}
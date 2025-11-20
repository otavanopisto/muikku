package fi.otavanopisto.muikku.plugins.announcer.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Entity
public class AnnouncementCategory {

  public Long getId() {
    return id;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public Long getColor() {
    return color;
  }

  public void setColor(Long color) {
    this.color = color;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @NotEmpty
  @Column (nullable = false, unique = true)
  private String categoryName;
  
  @NotNull
  @Column(nullable = false)
  private Long color;

}
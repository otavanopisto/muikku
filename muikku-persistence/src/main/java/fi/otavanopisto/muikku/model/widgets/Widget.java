package fi.otavanopisto.muikku.model.widgets;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Widget {
  
  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public Integer getMinimumSize() {
		return minimumSize;
	}
  
  public void setMinimumSize(Integer minimumSize) {
		this.minimumSize = minimumSize;
	}

  public WidgetVisibility getVisibility() {
		return visibility;
	}
  
  public void setVisibility(WidgetVisibility visibility) {
		this.visibility = visibility;
	}
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String name;

  @Column (nullable = false)
  @NotNull
  private Integer minimumSize;
  
  @Column (nullable = false)
  @NotNull
  @Enumerated (EnumType.STRING)
  private WidgetVisibility visibility;
}
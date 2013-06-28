package fi.muikku.model.workspace;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Workspace {

  /**
   * Returns internal unique id
   * 
   * @return Internal unique id
   */
  public Long getId() {
    return id;
  }
  
  public String getName() {
		return name;
	}

  public void setName(String name) {
		this.name = name;
	}
  
  public WorkspaceType getType() {
		return type;
	}
  
  public void setType(WorkspaceType type) {
		this.type = type;
	}
  
  public String getUrlName() {
		return urlName;
	}
  
  public void setUrlName(String urlName) {
		this.urlName = urlName;
	}

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private WorkspaceType type;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String name;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String urlName;
}
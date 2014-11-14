package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.PersistenceException;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
public class WorkspaceNode {
	
	public Long getId() {
		return id;
	}
	
	public void setUrlName(String urlName) {
		this.urlName = urlName;
	}
	
	public String getUrlName() {
		return urlName;
	}
	
	public WorkspaceNode getParent() {
		return parent;
	}
	
	public void setParent(WorkspaceNode parent) {
		this.parent = parent;
	}

  @Transient
  public WorkspaceNodeType getType() {
    throw new PersistenceException("Not implemented");
  }
  
  @Transient
  public String getPath() {
  	if (getParent() != null) {
  		StringBuilder result = new StringBuilder();
  		if (StringUtils.isNotBlank(getParent().getPath())) {
  			result.append(getParent().getPath());
  			result.append('/');
  		}
  		result.append(getUrlName());
  		return result.toString();
  	} else {
  		return getUrlName();
  	}
  }

  public Integer getOrderNumber() {
    return orderNumber;
  }

  public void setOrderNumber(Integer orderNumber) {
    this.orderNumber = orderNumber;
  }

  public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private String urlName;
  
  @ManyToOne
  private WorkspaceNode parent;
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private Integer orderNumber;
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private Boolean hidden;

}

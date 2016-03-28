package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "dataSource_id", "identifier" } )   
  }    
)
public class RoleSchoolDataIdentifier {

	public Long getId() {
		return id;
	}

	public SchoolDataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(SchoolDataSource dataSource) {
		this.dataSource = dataSource;
	}

	public RoleEntity getRoleEntity() {
		return roleEntity;
	}
	
	public void setRoleEntity(RoleEntity roleEntity) {
		this.roleEntity = roleEntity;
	}
	
	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotEmpty
	@NotNull
	@Column(nullable = false)
	private String identifier;

	@ManyToOne
	private SchoolDataSource dataSource;

	@ManyToOne
	private RoleEntity roleEntity;
}
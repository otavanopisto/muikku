package fi.muikku.model.workspace;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.model.base.SchoolDataSource;

@Entity
public class WorkspaceTypeSchoolDataIdentifier {

	public Long getId() {
		return id;
	}

	public SchoolDataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(SchoolDataSource dataSource) {
		this.dataSource = dataSource;
	}

	public WorkspaceTypeEntity getWorkspaceTypeEntity() {
		return workspaceTypeEntity;
	}
	
	public void setWorkspaceTypeEntity(WorkspaceTypeEntity workspaceTypeEntity) {
		this.workspaceTypeEntity = workspaceTypeEntity;
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
	private WorkspaceTypeEntity workspaceTypeEntity;
}
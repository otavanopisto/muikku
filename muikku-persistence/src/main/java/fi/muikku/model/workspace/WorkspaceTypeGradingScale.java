package fi.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.model.grading.GradingScaleEntity;

@Entity
public class WorkspaceTypeGradingScale {
	
	public Long getId() {
		return id;
	}
	
	public WorkspaceTypeEntity getWorkspaceType() {
		return workspaceType;
	}
	
	public void setWorkspaceType(WorkspaceTypeEntity workspaceType) {
		this.workspaceType = workspaceType;
	}
	
	public GradingScaleEntity getGradingScale() {
		return gradingScale;
	}
	
	public void setGradingScale(GradingScaleEntity gradingScale) {
		this.gradingScale = gradingScale;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private WorkspaceTypeEntity workspaceType;

	@ManyToOne
	private GradingScaleEntity gradingScale;
}

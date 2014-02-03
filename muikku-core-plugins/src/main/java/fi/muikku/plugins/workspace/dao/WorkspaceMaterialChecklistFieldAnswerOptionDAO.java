package fi.muikku.plugins.workspace.dao;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswerOption;

public class WorkspaceMaterialChecklistFieldAnswerOptionDAO extends PluginDAO<WorkspaceMaterialChecklistFieldAnswerOption> {
	
  private static final long serialVersionUID = 8767283875784190142L;

  public WorkspaceMaterialChecklistFieldAnswerOption create(WorkspaceMaterialChecklistFieldAnswer fieldAnswer, QueryChecklistFieldOption option) {
    WorkspaceMaterialChecklistFieldAnswerOption workspaceMaterialChecklistFieldAnswerOption = new WorkspaceMaterialChecklistFieldAnswerOption();
		
		workspaceMaterialChecklistFieldAnswerOption.setFieldAnswer(fieldAnswer);
		workspaceMaterialChecklistFieldAnswerOption.setOption(option);
		
		return persist(workspaceMaterialChecklistFieldAnswerOption);
	}
  
}

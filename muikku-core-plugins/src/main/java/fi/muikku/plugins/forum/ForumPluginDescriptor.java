package fi.muikku.plugins.forum;

import javax.inject.Inject;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumAreaGroup;

public class ForumPluginDescriptor implements PluginDescriptor {

  @Inject
  private ForumController forumController;
  
  @Override
  public void init() {
    ForumAreaGroup forumAreaGroup = forumController.findForumAreaGroup(1l);
    
    if (forumAreaGroup == null)
      forumAreaGroup = forumController.createForumAreaGroup("Yleinen");
    
    ForumArea forumArea = forumController.getForumArea(1l);
    if (forumArea == null)
      forumController.createEnvironmentForumArea("Yleinen keskustelu", forumAreaGroup.getId());
  }

	@Override
	public String getName() {
		return "forum";
	}
	
}

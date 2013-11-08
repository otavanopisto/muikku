package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
@URLMapping(
    id = "workspace-members", 
    pattern = "/workspace/#{workspaceMembersBackingBean.workspaceUrlName}/members", 
    viewId = "/workspaces/workspace-members.jsf") 
})
public class WorkspaceMembersBackingBean extends GenericWorkspaceBackingBean {

}

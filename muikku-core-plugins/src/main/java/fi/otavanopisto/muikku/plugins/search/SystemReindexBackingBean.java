package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.search.SearchReindexEvent;
import fi.otavanopisto.muikku.search.SearchReindexEvent.Task;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@RequestScoped
@Stateful
@Named
@Join (path = "/system/search/reindex", to = "/jsf/system/search-reindex.jsf")
public class SystemReindexBackingBean {
  
  @Parameter
  private String task;

  @Parameter
  private Boolean resume;
  
  @Inject
  private Event<SearchReindexEvent> reindexEvent;
  
  @Inject
  private SessionController sessionController;

	@RequestAction
	public String init() {
	  if (sessionController.hasPermission(MuikkuPermissions.ADMIN, null)) {
      List<Task> tasks = new ArrayList<>();
      if (StringUtils.isNotBlank(getTask())) {
        String[] tasksArray = getTask().split(",");
        for (String arrayTask : tasksArray) {
          Task task = EnumUtils.getEnum(Task.class, arrayTask);
          if (task == null) {
            return NavigationRules.INTERNAL_ERROR;
          }
          else {
            tasks.add(task);
          }
        }
        reindexEvent.fire(new SearchReindexEvent(tasks, resume != null ? resume : false));
	    }
	    else {
	      return NavigationRules.INTERNAL_ERROR;
	    }
	  }
	  return "/index.jsf?faces-redirect=true";
	}
	
	public String getTask() {
    return task;
  }
	
	public void setTask(String task) {
    this.task = task;
  }
	
	public void setResume(Boolean resume) {
	  this.resume = resume;
	}
	
	public Boolean getResume() {
	  return resume;
	}
}

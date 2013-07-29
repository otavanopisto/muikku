package fi.muikku.plugins.grading;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.event.AjaxBehaviorEvent;
import javax.faces.model.SelectItem;
import javax.faces.model.SelectItemGroup;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.CourseMetaController;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Subject;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;

@Named
@Stateful
@RequestScoped
public class StudentGradingViewBackingBean implements Serializable {

	private static final long serialVersionUID = 1439377389804904551L;

	@Inject
	private UserController userController;
	
	@Inject
	private GradingController gradingController;
	
	@Inject
	private CourseMetaController courseMetaController;
	
	@Inject
	private WorkspaceController workspaceController;

	@PostConstruct
	public void init() {
		workspaceSelectItems = new ArrayList<>();
		// TODO: Only "own" courses
		// TODO: Count only students instead of all users
		
		Long workspaceId = null;
		List<Subject> subjects = courseMetaController.listSubjects();
		for (Subject subject : subjects) {
			
			List<CourseIdentifier> courseIdentifiers = courseMetaController.listCourseIdentifiersBySubject(subject);
			for (CourseIdentifier courseIdentifier : courseIdentifiers) {
				int courseIdentifierUsers = 0;

				List<SelectItem> workspaceItems = new ArrayList<>(); 
				List<Workspace> workspaces = workspaceController.listWorkspacesByCourseIdentifier(courseIdentifier);				
				for (Workspace workspace : workspaces) {
					WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntity(workspace);
					int workspaceUsers = workspaceController.countWorkspaceUsers(workspaceEntity);
					if (workspaceUsers > 0) {
						courseIdentifierUsers += workspaceUsers;
						if (workspaceId == null) {
							workspaceId = workspaceEntity.getId();
						}
						
  					workspaceItems.add(new SelectItem(workspaceEntity.getId(), workspace.getName()));
					}
				}
				
				if (courseIdentifierUsers > 0) {
				  workspaceSelectItems.add(new SelectItemGroup(subject.getName() + " / " + courseIdentifier.getCode(), "", false, workspaceItems.toArray(new SelectItem[0])));
				}
			}			
		
		}

		setWorkspaceId(workspaceId);
	}
	
	/* Workspace */
	
	public List<SelectItemGroup> getWorkspaceSelectItems() {
		return workspaceSelectItems;
	}
	
	public Long getWorkspaceId() {
		return workspaceId;
	}
	
	public void setWorkspaceId(Long workspaceId) {
		this.workspaceId = workspaceId;
	}
	
	public void workspaceChangeListener(AjaxBehaviorEvent event) {
		System.out.println(event.getSource());
	}
	
	public List<SelectItem> getWorkspaceUserSelectItems() {
		List<SelectItem> users = new ArrayList<>();
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceId());
		List<WorkspaceUser> workspaceUsers = workspaceController.listWorkspaceUsers(workspaceEntity);
		for (WorkspaceUser workspaceUser : workspaceUsers) {
			User user = userController.findUser(workspaceUser.getSchoolDataSource(), workspaceUser.getUserIdentifier());
			UserEntity userEntity = userController.findUserEntity(user);
			
			String name = user.getLastName();
			if (StringUtils.isNotBlank(name)) {
				name += ", ";
			}
			
			name += user.getFirstName();
			
			users.add(new SelectItem(userEntity.getId(), name));
		}
		
		return users;
	}
	
	private Long workspaceId;
	private List<SelectItemGroup> workspaceSelectItems;
	/**
	public class UserBean {
		
		public UserBean(Long id, String name) {
			
		}

		public Long getId() {
			return id;
		}
		
		public String getName() {
			return name;
		}
		
		private Long id;
		private String name;
	}
	**/
//	
//	public List<User> listStudents() {
//		// TODO: Only Students
//		// TODO: Only "own" students
//		
//		userController.listUsers();
//	}

	/**
	public List<GradingScale> getGradingScales() {
		return gradingController.listGradingScales();
	}

**/
}
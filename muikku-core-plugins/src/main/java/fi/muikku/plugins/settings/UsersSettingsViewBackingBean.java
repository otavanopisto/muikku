package fi.muikku.plugins.settings;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.RoleController;
import fi.muikku.users.UserController;

@Named
@Stateful
@RequestScoped
public class UsersSettingsViewBackingBean {

	@Inject
	private UserController userController;

	@Inject
	private RoleController roleController;
	
	@PostConstruct
	public void init() {
	  // FIXME: REENABLE
//		users = new ArrayList<>();
//		List<User> users = userController.listUsers();
//		for (User user : users) {
//			Role environmentRole = roleController.findUserEnvironmentRole(user);
//			RoleEntity environmentRoleEntity = roleController.findRoleEntity(environmentRole);
//			this.users.add(new UserBean(user.getSchoolDataSource(), user.getIdentifier(), user.getFirstName(), user.getLastName(), environmentRoleEntity != null ? environmentRoleEntity.getName() : "Unassigned (" + environmentRole.getName() + ")"));
//		}
//		
//		Collections.sort(this.users, new Comparator<UserBean>() {
//			@Override
//			public int compare(UserBean o1, UserBean o2) {
//				int result = o1.getSchoolDataSource().compareTo(o2.getSchoolDataSource());
//				if (result == 0) {
//					return o1.getIdentifier().compareTo(o2.getIdentifier());
//				}
//				
//				return result;
//			}
//		});
	}

	public List<UserBean> getUsers() {
		return users;
	}

	private List<UserBean> users;
	
	public class UserBean {
		
		public UserBean() {
		}

		public UserBean(String schoolDataSource, String identifier, String firstName, String lastName, String role) {
			this.schoolDataSource = schoolDataSource;
			this.identifier = identifier;
			this.firstName = firstName;
			this.lastName = lastName;
			this.role = role;
		}

		public String getSchoolDataSource() {
			return schoolDataSource;
		}
		
		public void setSchoolDataSource(String schoolDataSource) {
			this.schoolDataSource = schoolDataSource;
		}

		public String getIdentifier() {
			return identifier;
		}

		public void setIdentifier(String identifier) {
			this.identifier = identifier;
		}
		
		public String getFirstName() {
			return firstName;
		}
		
		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}
		
		public String getLastName() {
			return lastName;
		}
		
		public void setLastName(String lastName) {
			this.lastName = lastName;
		}
		
		public String getRole() {
			return role;
		}
		
		public void setRole(String role) {
			this.role = role;
		}

		private String schoolDataSource;
		private String identifier;
		private String firstName;
		private String lastName;
		private String role;
	}
}

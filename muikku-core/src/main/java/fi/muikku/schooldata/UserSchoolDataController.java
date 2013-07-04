package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.schooldata.entity.User;

@Dependent
@Stateful
public class UserSchoolDataController { 
	
	// TODO: Caching 
	// TODO: Events
	
	@Inject
	@Any
	private Instance<UserSchoolDataBridge> userBridges;
	
	public List<User> listUsers() {
		List<User> result = new ArrayList<User>();
		
		for (UserSchoolDataBridge userBridge : getUserBridges()) {
			result.addAll(userBridge.listUsers());
		}
		
		return result;
	}
	
	public User findUser(UserEntity userEntity) {
		UserSchoolDataBridge userBridge = getUserBridge(userEntity.getDataSource());
		return userBridge.findUser(userEntity.getIdentifier());
	}
	
	private UserSchoolDataBridge getUserBridge(SchoolDataSource schoolDataSource) {
		Iterator<UserSchoolDataBridge> iterator = userBridges.iterator();
		while (iterator.hasNext()) {
			UserSchoolDataBridge userSchoolDataBridge = iterator.next();
			if (userSchoolDataBridge.getSchoolDataSource().equals(schoolDataSource.getIdentifier())) {
				return userSchoolDataBridge;
			}
		}
		
		return null;
	}
	
	private List<UserSchoolDataBridge> getUserBridges() {
		List<UserSchoolDataBridge> result = new ArrayList<UserSchoolDataBridge>();
		
		Iterator<UserSchoolDataBridge> iterator = userBridges.iterator();
		while (iterator.hasNext()) {
			result.add(iterator.next());
		}
		
		return Collections.unmodifiableList(result);
	}
	
}

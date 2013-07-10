package fi.muikku.schooldata;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.dao.workspace.WorkspaceTypeSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.model.workspace.WorkspaceTypeSchoolDataIdentifier;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceType;

@Dependent
@Stateful
public class WorkspaceSchoolDataController { 
	
	// TODO: Caching 
	// TODO: Events
	
	@Inject
	private Logger logger;
	
	@Inject
	@Any
	private Instance<WorkspaceSchoolDataBridge> workspaceBridges;
	
	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private WorkspaceEntityDAO workspaceEntityDAO;
	
	@Inject
	private WorkspaceTypeSchoolDataIdentifierDAO workspaceTypeSchoolDataIdentifierDAO;
	
	/* Workspaces */
	
	public List<Workspace> listWorkspaces() {
		// TODO: This method WILL cause performance problems, replace with something more sensible 
		
		List<Workspace> result = new ArrayList<>();
		
		for (WorkspaceSchoolDataBridge workspaceBridge : getWorkspaceBridges()) {
			try {
				result.addAll(workspaceBridge.listWorkspaces());
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspaces", e);
			}
		}
		
	  // TODO: This is probably not the best place for this
		ensureWorkspaceEntities(result);
		
		return result;
	}
	
	public Workspace findWorkspace(WorkspaceEntity workspaceEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		Workspace workspace = null;
		
		WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(workspaceEntity.getDataSource());
		if (workspaceBridge != null) {
  		workspace = workspaceBridge.findWorkspace(workspaceEntity.getIdentifier());
		}

	  // TODO: This is probably not the best place for this
		ensureWorkspaceEntities(Arrays.asList(workspace));

		return workspace;
	}
	
	/* Workspace Entities */
	
	public WorkspaceEntity findWorkspaceEntity(Workspace workspace) {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
		WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(schoolDataSource, workspace.getIdentifier());
		return workspaceEntity;
	}
	
	public WorkspaceTypeEntity findWorkspaceTypeEntity(WorkspaceType workspaceType) {
		// TODO: Proper error handling
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(workspaceType.getSchoolDataSource());
		if (schoolDataSource != null) {
	  	WorkspaceTypeSchoolDataIdentifier workspaceTypeSchoolDataIdentifier = workspaceTypeSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, workspaceType.getIdentifier());
	  	if (workspaceTypeSchoolDataIdentifier != null) {
	  		return workspaceTypeSchoolDataIdentifier.getWorkspaceTypeEntity();
	  	}
		} 

		return null;
	}
	
	/* Workspace Types */
	
	public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(String schoolDataSourceIdentifier, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(schoolDataSourceIdentifier);
		if (schoolDataSource != null) {
			return findWorkspaceTypeByDataSourceAndIdentifier(schoolDataSource, identifier);
		} 
		
		return null;
	}
	
	public WorkspaceType findWorkspaceTypeByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		WorkspaceSchoolDataBridge schoolDataBridge = getWorkspaceBridge(schoolDataSource);
		if (schoolDataBridge != null) {
			return schoolDataBridge.findWorkspaceType(identifier);
		}
		
		return null;
	}

	public List<WorkspaceType> listWorkspaceTypes() {
		// TODO: This method WILL cause performance problems, replace with something more sensible 
		
		List<WorkspaceType> result = new ArrayList<>();
		
		for (WorkspaceSchoolDataBridge workspaceBridge : getWorkspaceBridges()) {
			try {
				result.addAll(workspaceBridge.listWorkspaceTypes());
			} catch (UnexpectedSchoolDataBridgeException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace types", e);
			} catch (SchoolDataBridgeRequestException e) {
				logger.log(Level.SEVERE, "School Data Bridge reported a problem while listing workspace types", e);
			}
		}
		
		return result;
	}
	
	public List<WorkspaceType> listWorkspaceTypes(WorkspaceTypeEntity workspaceTypeEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<WorkspaceType> workspaceTypes = new ArrayList<>();
		
		List<WorkspaceTypeSchoolDataIdentifier> typeIdentifiers = workspaceTypeSchoolDataIdentifierDAO.listByWorkspaceTypeEntity(workspaceTypeEntity);
		for (WorkspaceTypeSchoolDataIdentifier typeIdentifier : typeIdentifiers) {
			WorkspaceSchoolDataBridge workspaceBridge = getWorkspaceBridge(typeIdentifier.getDataSource());
			if (workspaceBridge != null) {
				workspaceTypes.add(workspaceBridge.findWorkspaceType(typeIdentifier.getIdentifier()));
			}
		}
		
		
		return workspaceTypes;
	}
	
	private WorkspaceSchoolDataBridge getWorkspaceBridge(SchoolDataSource schoolDataSource) {
		Iterator<WorkspaceSchoolDataBridge> iterator = workspaceBridges.iterator();
		while (iterator.hasNext()) {
			WorkspaceSchoolDataBridge workspaceSchoolDataBridge = iterator.next();
			if (workspaceSchoolDataBridge.getSchoolDataSource().equals(schoolDataSource.getIdentifier())) {
				return workspaceSchoolDataBridge;
			}
		}
		
		return null;
	}
	
	private List<WorkspaceSchoolDataBridge> getWorkspaceBridges() {
		List<WorkspaceSchoolDataBridge> result = new ArrayList<>();
		
		Iterator<WorkspaceSchoolDataBridge> iterator = workspaceBridges.iterator();
		while (iterator.hasNext()) {
			result.add(iterator.next());
		}
		
		return Collections.unmodifiableList(result);
	}
	
	private void ensureWorkspaceEntities(List<Workspace> workspaces) {
		for (Workspace workspace : workspaces) {
			SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
			WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(dataSource, workspace.getIdentifier());
			if (workspaceEntity == null) {
				workspaceEntityDAO.create(dataSource, workspace.getIdentifier(), Boolean.FALSE);
			}
		}
	}
}

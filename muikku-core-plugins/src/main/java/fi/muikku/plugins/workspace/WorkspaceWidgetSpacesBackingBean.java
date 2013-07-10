package fi.muikku.plugins.workspace;

import javax.ejb.Stateless;
import javax.inject.Named;

import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

@Named
@Stateless
public class WorkspaceWidgetSpacesBackingBean {

	public String getWorkspaceHeaderLeft() {
		return WidgetLocations.WORKSPACE_HEADER_LEFT;
	}

	public String getWorkspaceHeaderCenter() {
		return WidgetLocations.WORKSPACE_HEADER_CENTER;
	}

	public String getWorkspaceHeaderRight() {
		return WidgetLocations.WORKSPACE_HEADER_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceHeaderSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_HEADER_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_HEADER_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_HEADER_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getWorkspaceDockTopLeft() {
		return WidgetLocations.WORKSPACE_DOCK_TOP_LEFT;
	}

	public String getWorkspaceDockTopCenter() {
		return WidgetLocations.WORKSPACE_DOCK_TOP_CENTER;
	}

	public String getWorkspaceDockTopRight() {
		return WidgetLocations.WORKSPACE_DOCK_TOP_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceDockTopSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_DOCK_TOP_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_DOCK_TOP_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_DOCK_TOP_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getWorkspaceContentSidebarLeft() {
		return WidgetLocations.WORKSPACE_CONTENT_SIDEBAR_LEFT;
	}

	public String getWorkspaceContentSidebarRight() {
		return WidgetLocations.WORKSPACE_CONTENT_SIDEBAR_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceContentSet() {
		return new WidgetSpaceSet(
			new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
			new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE),
			new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_SIDEBAR_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getWorkspaceContentToolsTopLeft() {
		return WidgetLocations.WORKSPACE_CONTENT_TOOLS_TOP_LEFT;
	}

	public String getWorkspaceContentToolsTopCenter() {
		return WidgetLocations.WORKSPACE_CONTENT_TOOLS_TOP_CENTER;
	}

	public String getWorkspaceContentToolsTopRight() {
		return WidgetLocations.WORKSPACE_CONTENT_TOOLS_TOP_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceContentToolsTopSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_TOOLS_TOP_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_TOOLS_TOP_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_TOOLS_TOP_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getWorkspaceContentToolsBottomLeft() {
		return WidgetLocations.WORKSPACE_CONTENT_TOOLS_BOTTOM_LEFT;
	}

	public String getWorkspaceContentToolsBottomCenter() {
		return WidgetLocations.WORKSPACE_CONTENT_TOOLS_BOTTOM_CENTER;
	}

	public String getWorkspaceContentToolsBottomRight() {
		return WidgetLocations.WORKSPACE_CONTENT_TOOLS_BOTTOM_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceContentToolsBottomSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_TOOLS_BOTTOM_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_TOOLS_BOTTOM_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_CONTENT_TOOLS_BOTTOM_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getWorkspaceDockBottomLeft() {
		return WidgetLocations.WORKSPACE_DOCK_BOTTOM_LEFT;
	}

	public String getWorkspaceDockBottomCenter() {
		return WidgetLocations.WORKSPACE_DOCK_BOTTOM_CENTER;
	}

	public String getWorkspaceDockBottomRight() {
		return WidgetLocations.WORKSPACE_DOCK_BOTTOM_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceDockBottomSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_DOCK_BOTTOM_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_DOCK_BOTTOM_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_DOCK_BOTTOM_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getWorkspaceFooterLeft() {
		return WidgetLocations.WORKSPACE_FOOTER_LEFT;
	}

	public String getWorkspaceFooterCenter() {
		return WidgetLocations.WORKSPACE_FOOTER_CENTER;
	}

	public String getWorkspaceFooterRight() {
		return WidgetLocations.WORKSPACE_FOOTER_RIGHT;
	}
	
	public WidgetSpaceSet getWorkspaceFooterSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_FOOTER_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_FOOTER_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.WORKSPACE_FOOTER_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}
}

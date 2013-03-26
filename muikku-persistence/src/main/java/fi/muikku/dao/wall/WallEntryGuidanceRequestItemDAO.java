package fi.muikku.dao.wall;

import java.util.Date;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.AbstractWallEntry;
import fi.muikku.model.wall.WallEntryGuidanceRequestItem;


@DAO
public class WallEntryGuidanceRequestItemDAO extends CoreDAO<WallEntryGuidanceRequestItem> {

	private static final long serialVersionUID = 3778456445166156592L;

	public WallEntryGuidanceRequestItem create(AbstractWallEntry wallEntry, String text, UserEntity creator) {
    Date now = new Date();

    return create(wallEntry, text, creator,creator, now, now, Boolean.FALSE);
  }

  public WallEntryGuidanceRequestItem create(AbstractWallEntry wallEntry, String text,UserEntity creator, UserEntity lastModfier, Date created, Date lastModified, Boolean archived) {
    WallEntryGuidanceRequestItem item = new WallEntryGuidanceRequestItem();
    
    item.setText(text);
    item.setWallEntry(wallEntry);
    item.setCreated(created);
    item.setLastModified(lastModified);
    item.setCreator(creator);
    item.setLastModifier(lastModfier);
    item.setArchived(archived);
    
    getEntityManager().persist(item);
    
    wallEntry.addItem(item);
    getEntityManager().persist(wallEntry);
    
    return item;
  }
}

package fi.muikku.schooldata;

import java.util.List;

import fi.muikku.schooldata.entity.SchoolDataEntity;

public interface SchoolDataEntityInitiator<T extends SchoolDataEntity> {

	public T single(T entity);
	
	public List<T> list(List<T> entities);
	
}

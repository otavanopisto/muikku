package fi.muikku.plugins.schooldatapyramus.model;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(SystemAccessToken.class)
public abstract class SystemAccessToken_ {

	public static volatile SingularAttribute<SystemAccessToken, Long> expires;
	public static volatile SingularAttribute<SystemAccessToken, Long> id;
	public static volatile SingularAttribute<SystemAccessToken, String> accessToken;
	public static volatile SingularAttribute<SystemAccessToken, String> refreshToken;

}


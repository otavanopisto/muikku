package fi.muikku.dao.oauth;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.oauth.Token;
import fi.muikku.model.oauth.TokenPermission;
import fi.muikku.model.oauth.TokenPermission_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class TokenPermissionDAO extends CoreDAO<TokenPermission> {

	private static final long serialVersionUID = 392728769394558665L;

	public TokenPermission create(Token token, String permission) {
    TokenPermission tokenPermission = new TokenPermission();
    tokenPermission.setToken(token);
    tokenPermission.setPermission(permission);

    getEntityManager().persist(tokenPermission);
    
    return tokenPermission;
  }

  public TokenPermission findByTokenAndScope(Token token, String permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<TokenPermission> criteria = criteriaBuilder.createQuery(TokenPermission.class);
    Root<TokenPermission> root = criteria.from(TokenPermission.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(TokenPermission_.token), token),
        criteriaBuilder.equal(root.get(TokenPermission_.permission), permission)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<TokenPermission> listByToken(Token token) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<TokenPermission> criteria = criteriaBuilder.createQuery(TokenPermission.class);
    Root<TokenPermission> root = criteria.from(TokenPermission.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(TokenPermission_.token), token));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(TokenPermission consumerScope) {
    super.delete(consumerScope);
  }
}

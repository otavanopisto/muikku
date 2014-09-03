package fi.muikku.dao.oauth;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.oauth.Token;
import fi.muikku.model.oauth.TokenScope;
import fi.muikku.model.oauth.TokenScope_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class TokenScopeDAO extends CoreDAO<TokenScope> {

	private static final long serialVersionUID = -1133866352960674096L;

	public TokenScope create(Token token, String scope) {
    TokenScope tokenScope = new TokenScope();
    tokenScope.setToken(token);
    tokenScope.setScope(scope);

    getEntityManager().persist(tokenScope);
    
    return tokenScope;
  }

  public TokenScope findByTokenAndScope(Token token, String scope) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<TokenScope> criteria = criteriaBuilder.createQuery(TokenScope.class);
    Root<TokenScope> root = criteria.from(TokenScope.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(TokenScope_.token), token),
        criteriaBuilder.equal(root.get(TokenScope_.scope), scope)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<TokenScope> listByToken(Token token) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<TokenScope> criteria = criteriaBuilder.createQuery(TokenScope.class);
    Root<TokenScope> root = criteria.from(TokenScope.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(TokenScope_.token), token));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(TokenScope consumerScope) {
    super.delete(consumerScope);
  }
}

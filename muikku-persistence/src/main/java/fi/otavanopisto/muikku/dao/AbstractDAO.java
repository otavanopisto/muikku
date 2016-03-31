package fi.otavanopisto.muikku.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NonUniqueResultException;
import javax.persistence.Query;

import fi.otavanopisto.muikku.dao.events.EntityAddEvent;
import fi.otavanopisto.muikku.dao.events.EntityRemoveEvent;

public abstract class AbstractDAO<T> implements Serializable {

  private static final long serialVersionUID = 8339666122625087683L;

  @Inject
  private Event<EntityAddEvent> entityAddEvent;

  @Inject
  private Event<EntityRemoveEvent> entityRemoveEvent;

  @SuppressWarnings("unchecked")
  public T findById(Long id) {
    EntityManager entityManager = getEntityManager();
    return (T) entityManager.find(getGenericTypeClass(), id);
  }

  @SuppressWarnings("unchecked")
  public List<T> listAll() {
    EntityManager entityManager = getEntityManager();
    Class<?> genericTypeClass = getGenericTypeClass();
    Query query = entityManager.createQuery("select o from " + genericTypeClass.getName() + " o");
    return query.getResultList();
  }

  @SuppressWarnings("unchecked")
  public List<T> listAll(int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager();
    Class<?> genericTypeClass = getGenericTypeClass();
    Query query = entityManager.createQuery("select o from " + genericTypeClass.getName() + " o");
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    return query.getResultList();
  }

  public Long count() {
    EntityManager entityManager = getEntityManager();
    Class<?> genericTypeClass = getGenericTypeClass();
    Query query = entityManager.createQuery("select count(o) from " + genericTypeClass.getName() + " o");
    return (Long) query.getSingleResult();
  }

  protected void delete(T e) {
    entityRemoveEvent.fire(new EntityRemoveEvent(e));
    getEntityManager().remove(e);
    // TODO: Why is manual flush needed?
    flush();
  }

  public void flush() {
    getEntityManager().flush();
  }

  protected T persist(T object) {
    getEntityManager().persist(object);
    entityAddEvent.fire(new EntityAddEvent(object));
    return object;
  }

  protected T getSingleResult(Query query) {
    @SuppressWarnings("unchecked")
    List<T> list = query.getResultList();

    if (list.size() == 0)
      return null;

    if (list.size() == 1)
      return list.get(0);

    throw new NonUniqueResultException("SingleResult query returned " + list.size() + " elements");
  }

  private Class<?> getFirstTypeArgument(ParameterizedType parameterizedType) {
    return (Class<?>) parameterizedType.getActualTypeArguments()[0];
  }

  protected Class<?> getGenericTypeClass() {
    Type genericSuperclass = getClass().getGenericSuperclass();

    if (genericSuperclass instanceof ParameterizedType) {
      return getFirstTypeArgument((ParameterizedType) genericSuperclass);
    } else {
      // It's probably a weld proxy class
      if (genericSuperclass instanceof Class<?>) {
        if (AbstractDAO.class.isAssignableFrom((Class<?>) genericSuperclass)) {
          return getFirstTypeArgument((ParameterizedType) ((Class<?>) genericSuperclass).getGenericSuperclass());
        }
      }
    }

    return null;
  }

  protected abstract EntityManager getEntityManager();
}

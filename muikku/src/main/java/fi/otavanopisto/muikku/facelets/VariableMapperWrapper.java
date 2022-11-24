package fi.otavanopisto.muikku.facelets;

import java.util.HashMap;
import java.util.Map;

import javax.el.ValueExpression;
import javax.el.VariableMapper;

/**
 * Decorator pattern class to wrap VariableMapper with values that override the values
 * present in the wrapped mapper.
 * 
 * Essentially same as com.sun.faces.facelets.el.VariableMapperWrapper but here to avoid
 * implementation specific dependencies.
 */
public class VariableMapperWrapper extends VariableMapper {

  public VariableMapperWrapper(VariableMapper wrapped) {
    this.wrapped = wrapped;
  }
  
  @Override
  public ValueExpression resolveVariable(String variable) {
    if (override.containsKey(variable)) {
      return override.get(variable);
    }
    
    return wrapped.resolveVariable(variable);
  }

  @Override
  public ValueExpression setVariable(String variable, ValueExpression expression) {
    return override.put(variable, expression);
  }

  private Map<String, ValueExpression> override = new HashMap<>();
  private VariableMapper wrapped;
}

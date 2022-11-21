package fi.otavanopisto.muikku.plugins.material.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public enum MaterialViewRestrict {
 
  NONE,
  
  LOGGED_IN,
  
  WORKSPACE_MEMBERS;
  
  /**
   * Returns the more restrictive restriction of the two restrictions.
   */
  public static MaterialViewRestrict max(MaterialViewRestrict mvr1, MaterialViewRestrict mvr2) {
    int max = Math.max(ORDER_OF_RESTRICTIVINESS.indexOf(mvr1), ORDER_OF_RESTRICTIVINESS.indexOf(mvr2));

    // -1 indicates neither was found from the ordering list so both were null
    return max != -1 ? ORDER_OF_RESTRICTIVINESS.get(max) : null;
  }
  
  /**
   * Order of restrictiviness, the least restrictive first
   */
  private static final List<MaterialViewRestrict> ORDER_OF_RESTRICTIVINESS = 
      Collections.unmodifiableList(Arrays.asList(NONE, LOGGED_IN, WORKSPACE_MEMBERS));
}

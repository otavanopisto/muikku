package fi.muikku;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TestEnvironments {
	
  // Defaults to any browser
  Browser[] browsers() default {};
  
  // Defaults to all screens
  ScreenSize[] screenSizes() default {};

  public enum Browser {
    CHROME,
    FIREFOX,
    SAFARI,
    INTERNET_EXPLORER,
    EDGE,
    PHANTOMJS
  }
  
  public enum ScreenSize {
    
    /* Screen width < 768 */
    
    SMALL, 
    
    /* Screen width in 768 - 1098 */
    
    MEDIUM,
    
    /* Screen width > 1099 */
    
    LARGE
    
  }

}

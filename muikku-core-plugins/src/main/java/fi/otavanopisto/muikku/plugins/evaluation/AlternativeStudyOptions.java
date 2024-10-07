package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.apache.commons.codec.binary.StringUtils;

/**
 * Finnish upper secondary school optional studies. 
 * 
 * Attempts to make sense of mutually exclusive optional subjects.
 */
public class AlternativeStudyOptions {

  public static final Set<String> MATH_OPTIONS = Set.of("MAA", "MAB");
  public static final Set<String> NATIVE_LANGUAGE_OPTIONS = Set.of("MAA", "MAB");
  public static final Set<String> RELIGION_OPTIONS = Set.of("MAA", "MAB");
  
  public static AlternativeStudyOptions from(List<String> alternativeStudyOptions) {
    AlternativeStudyOptions obj = new AlternativeStudyOptions();
    
    if (alternativeStudyOptions != null) {
      obj.math = pick(alternativeStudyOptions, MATH_OPTIONS, obj.math);
      obj.nativeLanguage = pick(alternativeStudyOptions, NATIVE_LANGUAGE_OPTIONS, obj.nativeLanguage);
      obj.religion = pick(alternativeStudyOptions, RELIGION_OPTIONS, obj.religion);
    }
    
    return obj;
  }
  
  private static String pick(Collection<String> selections, Set<String> options, String defaultValue) {
    for (String option : options) {
      if (selections.contains(option)) {
        return option;
      }
    }
    return defaultValue;
  }

  /**
   * Returns true, if the subject is "selected" by the student
   * who's alternative study options this object represents.
   * 
   * Checks the predefined groups separately for math,
   * native language and religion as they are mutually
   * exclusive. Otherwise returns true as all other
   * subjects are considered part of the studies.
   * 
   * @param subjectCode subjectCode of the subject
   * @return
   */
  public boolean isSelectedSubject(String subjectCode) {
    if (MATH_OPTIONS.contains(subjectCode)) {
      return StringUtils.equals(this.math, subjectCode);
    }
    
    if (NATIVE_LANGUAGE_OPTIONS.contains(subjectCode)) {
      return StringUtils.equals(this.nativeLanguage, subjectCode);
    }
    
    if (RELIGION_OPTIONS.contains(subjectCode)) {
      return StringUtils.equals(this.religion, subjectCode);
    }
    
    return true;
  }
  
  private String nativeLanguage = "ÄI";
  private String math = "MAB";
  private String religion = "UE";
}

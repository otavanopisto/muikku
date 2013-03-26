package fi.muikku.utils;

import java.security.MessageDigest;

import org.apache.commons.lang3.StringUtils;


public class RequestUtils {
  
  public static String md5EncodeString(String s) {
    try {
      if (s == null)
        return null;
  
      if (StringUtils.isBlank(s))
        return "";
  
      MessageDigest algorithm = MessageDigest.getInstance("MD5");
      algorithm.reset();
      algorithm.update(s.getBytes("UTF-8"));
      byte messageDigest[] = algorithm.digest();
  
      StringBuffer hexString = new StringBuffer();
      for (int i = 0; i < messageDigest.length; i++) {
        String hex = Integer.toHexString(0xFF & messageDigest[i]);
        if (hex.length() == 1) {
          hexString.append('0');
        }
        hexString.append(hex);
      }
      return hexString.toString();
    }
    catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
  
}

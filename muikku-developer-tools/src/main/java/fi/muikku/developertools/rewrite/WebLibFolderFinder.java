package fi.muikku.developertools.rewrite;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Collection;
import java.util.Set;

import javax.servlet.ServletContext;

import org.apache.commons.io.FileUtils;
import org.ocpsoft.rewrite.annotation.api.ClassVisitor;
import org.ocpsoft.rewrite.annotation.scan.AbstractClassFinder;
import org.ocpsoft.rewrite.annotation.scan.ByteCodeFilter;
import org.ocpsoft.rewrite.annotation.scan.PackageFilter;

public class WebLibFolderFinder extends AbstractClassFinder {

  private final static String LIB_FOLDER = "/WEB-INF/lib/";

  public WebLibFolderFinder(ServletContext servletContext, ClassLoader classLoader, PackageFilter packageFilter, ByteCodeFilter byteCodeFilter) {
    super(servletContext, classLoader, packageFilter, byteCodeFilter);
  }

  @Override
  public void findClasses(ClassVisitor visitor) {
    try {
      URL libFolderUrl = servletContext.getResource(LIB_FOLDER);
      if (libFolderUrl == null) {
        log.warn("Cannot find " + LIB_FOLDER + " folder!");
        return;
      }

      Set<?> paths = servletContext.getResourcePaths(LIB_FOLDER);

      for (Object relativePath : paths) {
        URL entryUrl = servletContext.getResource(relativePath.toString());
        File entryFile = new File(entryUrl.toURI());
        if (entryFile.isDirectory()) {
          processFolder(entryFile, visitor);
        }
      }

    } catch (MalformedURLException | URISyntaxException e) {
      throw new IllegalStateException("Invalid URL: " + e.getMessage(), e);
    }
  }

  private void processFolder(File entryFile, ClassVisitor visitor) {
    Collection<File> classFiles = FileUtils.listFiles(entryFile, new String[] { "class" }, true);
    
    for (File classFile : classFiles) {
      try {
        String filePath = classFile.getAbsolutePath().substring(entryFile.getAbsolutePath().length() + 1);
        String className = getClassName(filePath);
        if (mustProcessClass(className)) {
          processClass(className, null, visitor);
        }
      } catch (Exception e) {
        log.error(String.format("Failed to process class '%s'", classFile.toString()), e);
      }
    }
  }

  @Override
  public int priority() {
    return 0;
  }

}

package fi.muikku.developertools.rewrite;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletContext;

import org.ocpsoft.common.services.ServiceLoader;
import org.ocpsoft.rewrite.annotation.ClassVisitorImpl;
import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.annotation.scan.ByteCodeFilter;
import org.ocpsoft.rewrite.annotation.scan.PackageFilter;
import org.ocpsoft.rewrite.annotation.spi.AnnotationHandler;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;

@RewriteConfiguration
public class WebLibFolderRewriteRules extends HttpConfigurationProvider {

  @Override
  public Configuration getConfiguration(ServletContext context) {
    ClassLoader classloader = Thread.currentThread().getContextClassLoader();
    if (classloader == null) {
       classloader = this.getClass().getClassLoader();
    }
    
    Set<Class<? extends Annotation>> annotationType = new LinkedHashSet<Class<? extends Annotation>>();
    List<AnnotationHandler<Annotation>> annotationHandlers = new ArrayList<AnnotationHandler<Annotation>>();
 
    @SuppressWarnings("unchecked")
    Iterator<AnnotationHandler<Annotation>> handlerIterator = ServiceLoader.load(AnnotationHandler.class).iterator();
    while (handlerIterator.hasNext()) {
       AnnotationHandler<Annotation> handler = handlerIterator.next();
       annotationHandlers.add(handler);
       annotationType.add(handler.handles());
    }
    
    ClassVisitorImpl classVisitor = new ClassVisitorImpl(annotationHandlers, context);
    ByteCodeFilter byteCodeFilter = new ByteCodeFilter(annotationType);
    PackageFilter packageFilter = new PackageNotFilter(null, Arrays.asList("fi.muikku.developertools.rewrite"));
    
    WebLibFolderFinder webLibFolderFinder = new WebLibFolderFinder(context, classloader, packageFilter, byteCodeFilter);
    webLibFolderFinder.findClasses(classVisitor);

    return classVisitor;
  }

  @Override
  public int priority() {
    return 0;
  }
  
}

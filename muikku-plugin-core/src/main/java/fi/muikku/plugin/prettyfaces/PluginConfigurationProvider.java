package fi.muikku.plugin.prettyfaces;

import javax.servlet.ServletContext;

import com.ocpsoft.pretty.faces.config.PrettyConfig;
import com.ocpsoft.pretty.faces.config.PrettyConfigBuilder;
import com.ocpsoft.pretty.faces.config.annotation.PackageFilter;
import com.ocpsoft.pretty.faces.config.annotation.PrettyAnnotationHandler;
import com.ocpsoft.pretty.faces.el.LazyBeanNameFinder;
import com.ocpsoft.pretty.faces.spi.ConfigurationProvider;

public class PluginConfigurationProvider implements ConfigurationProvider {

	@Override
	public PrettyConfig loadConfiguration(ServletContext servletContext) {
		PackageFilter packageFilter = new PackageFilter(null);
		LazyBeanNameFinder beanNameFinder = new LazyBeanNameFinder(servletContext);
		PrettyAnnotationHandler annotationHandler = new PrettyAnnotationHandler(beanNameFinder);

		PluginClassesFinder pluginClassesFinder = new PluginClassesFinder(servletContext, packageFilter);
		pluginClassesFinder.findClasses(annotationHandler);

		PrettyConfigBuilder builder = new PrettyConfigBuilder();
		annotationHandler.build(builder);
		return builder.build();
	}

}

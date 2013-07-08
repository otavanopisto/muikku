package fi.muikku.plugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.inject.spi.AnnotatedType;
import javax.enterprise.inject.spi.BeanManager;
import javax.enterprise.inject.spi.BeforeBeanDiscovery;
import javax.enterprise.inject.spi.Extension;
import javax.interceptor.Interceptors;

import org.apache.commons.lang3.StringUtils;
import org.apache.deltaspike.core.util.metadata.AnnotationInstanceProvider;
import org.apache.deltaspike.core.util.metadata.builder.AnnotatedTypeBuilder;
import org.sonatype.aether.artifact.Artifact;
import org.sonatype.aether.repository.RemoteRepository;
import org.sonatype.aether.util.artifact.DefaultArtifact;

import fi.muikku.plugin.PluginLibraryInfo;
import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitInterceptor;

public class PluginExtension implements Extension {

	private Logger logger = Logger.getLogger(PluginExtension.class.getName());

	void beforeBeanDiscovery(@Observes BeforeBeanDiscovery beforeBeanDiscovery, BeanManager beanManager) {
		List<RemoteRepository> repositories = new ArrayList<>();
		List<PluginLibraryInfo> pluginLoadInfos = new ArrayList<>();

		String coreVersion = getClass().getPackage().getImplementationVersion();
		Artifact applicationArtifact = new DefaultArtifact("fi.muikku", "muikku", "pom", coreVersion);

		// Maven Central repository is always present
		repositories.add(new RemoteRepository("central", "default", "http://repo.maven.apache.org/maven2"));

		try {
  		Properties repositoriesProperties = getRepositoriesPropeties();
  		if (repositoriesProperties != null) {
  			// TODO: Validate repository name and url
  			for (Object key : repositoriesProperties.keySet()) {
  				String repositoryName = (String) key;
  				String repositoryUrl = (String) repositoriesProperties.get(repositoryName);
  				repositories.add(new RemoteRepository(repositoryName, "default", repositoryUrl));
  			}
  		}
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Could not load plugin repositories properties file", e);
		}

		try {
  		Properties pluginLibrariesProperties = getPluginLibrariesProperties();
  		if (pluginLibrariesProperties != null) {
  			// TODO: Validate artifactId and version syntax
  
  			for (Object key : pluginLibrariesProperties.keySet()) {
  				String pluginLibraryArtifactId = (String) key;
  				String pluginLibraryVersion = (String) pluginLibrariesProperties.get(pluginLibraryArtifactId);
  
  				int groupSeparator = pluginLibraryArtifactId.lastIndexOf('.');
  				String groupId = pluginLibraryArtifactId.substring(0, groupSeparator);
  				String artifactId = pluginLibraryArtifactId.substring(groupSeparator + 1);
  
  				pluginLoadInfos.add(new PluginLibraryInfo(groupId, artifactId, pluginLibraryVersion));
  			}
  		}
		} catch (IOException e) {
			logger.log(Level.SEVERE, "Could not load plugins properties file", e);
		}

		String eclipseWorkspace = System.getProperty("eclipse.workspace");

		SingletonPluginManager pluginManager;

		try {
			pluginManager = SingletonPluginManager.initialize(getClass().getClassLoader(), getPluginsFolder(), applicationArtifact, repositories, eclipseWorkspace);
		} catch (PluginManagerException e1) {
			throw new ExceptionInInitializerError(e1);
		}

		for (PluginLibraryInfo pluginLoadInfo : pluginLoadInfos) {
			logger.info("Loading plugin library: " + pluginLoadInfo.toString());
			try {
				pluginManager.loadPluginLibrary(pluginLoadInfo);
			} catch (PluginManagerException e) {
				logger.log(Level.SEVERE, "Failed to load plugin library: " + pluginLoadInfo.toString(), e);
			}
		}

		List<PluginLibraryDescriptor> pluginLibraries = pluginManager.discoverPluginLibraries();
		for (PluginLibraryDescriptor pluginLibrary : pluginLibraries) {
			addDiscoveredBean(beanManager, beforeBeanDiscovery, pluginLibrary.getClass());

			for (Class<? extends PluginDescriptor> pluginDescriptorClass : pluginLibrary.getPlugins()) {
				addPluginBeans(beanManager, beforeBeanDiscovery, pluginDescriptorClass);
			}
		}
	}

	private Properties getPluginLibrariesProperties() throws IOException {
		return loadPropertiesFile("muikku-plugin-libraries");
	}

	private Properties getRepositoriesPropeties() throws IOException {
		return loadPropertiesFile("muikku-plugin-repositories");
	}

	private Properties loadPropertiesFile(String systemProperty) throws IOException {
		String propertiesFilePath = System.getProperty(systemProperty);
		if (StringUtils.isNotBlank(propertiesFilePath)) {
			File propertiesFile = new File(propertiesFilePath);
			if (propertiesFile.exists()) {
				FileInputStream propertiesFileInputStream = new FileInputStream(propertiesFile);
				try {
					Properties properties = new Properties();
					properties.load(propertiesFileInputStream);
					return properties;
				} finally {
					propertiesFileInputStream.close();
				}
			}
		}

		return null;
	}

	private void addPluginBeans(BeanManager beanManager, BeforeBeanDiscovery beforeBeanDiscovery, Class<? extends PluginDescriptor> pluginDescriptorClass) {
		String pluginName = pluginDescriptorClass.getName();

		try {
			PluginDescriptor tempInstance = pluginDescriptorClass.newInstance();
			pluginName = tempInstance.getName();

			List<Class<?>> beans = tempInstance.getBeans();
			if (beans != null) {
				for (Class<?> bean : beans) {
					addDiscoveredBean(beanManager, beforeBeanDiscovery, bean);
				}
			}

			if (tempInstance instanceof RESTPluginDescriptor) {
				RESTPluginDescriptor restPluginDescriptor = (RESTPluginDescriptor) tempInstance;
				if (restPluginDescriptor.getRESTServices() != null) {
					for (Class<?> service : restPluginDescriptor.getRESTServices()) {
						addDiscoveredBean(beanManager, beforeBeanDiscovery, service);
					}
				}
			}

			addDiscoveredBean(beanManager, beforeBeanDiscovery, pluginDescriptorClass);
		} catch (InstantiationException e) {
			logger.log(Level.SEVERE, "Failed to initialize CDI on '" + pluginName + "' plugin.", e);
		} catch (IllegalAccessException e) {
			logger.log(Level.SEVERE, "Failed to initialize CDI on '" + pluginName + "' plugin.", e);
		}
	}

	private <T> void addDiscoveredBean(BeanManager beanManager, BeforeBeanDiscovery beforeBeanDiscovery, Class<T> beanClass) {
		logger.info("Adding discovered bean " + beanClass);

		// TODO: Test security annotations

		AnnotatedTypeBuilder<T> annotatedTypeBuilder = new AnnotatedTypeBuilder<T>().readFromType(beanClass);

		for (Method method : getBeanMethods(beanClass)) {
			if (!Modifier.isStatic(method.getModifiers()) && Modifier.isPublic(method.getModifiers()) && !Modifier.isAbstract(method.getModifiers())) {
				Map<String, Class<?>[]> parameters = new HashMap<>();

				List<Class<?>> interceptors = new ArrayList<Class<?>>();

				interceptors.add(TransactionalInterceptor.class);
				interceptors.add(PluginContextClassLoaderInterceptor.class);

				if (method.getAnnotation(Permit.class) != null)
					interceptors.add(PermitInterceptor.class);

				parameters.put("value", interceptors.toArray(new Class<?>[interceptors.size()]));

				Interceptors annotation = AnnotationInstanceProvider.of(Interceptors.class, parameters);
				annotatedTypeBuilder.addToMethod(method, annotation);
			}
		}

		AnnotatedType<T> annotatedType = annotatedTypeBuilder.create();

		beforeBeanDiscovery.addAnnotatedType(annotatedType);
	}

	private List<Method> getBeanMethods(Class<?> beanClass) {
		List<Method> result = new ArrayList<Method>();
		if (beanClass.getSuperclass() != null && !Object.class.equals(beanClass.getSuperclass())) {
			result.addAll(getBeanMethods(beanClass.getSuperclass()));
		}

		result.addAll(Arrays.asList(beanClass.getDeclaredMethods()));

		return result;
	}

	private static String getPluginsFolder() {
		String pluginsFolder = System.getProperty("muikku.plugin.dir");

		if (StringUtils.isBlank(pluginsFolder)) {
			String defaultDataDir = System.getProperty("jboss.server.data.dir");
			if (StringUtils.isBlank(defaultDataDir)) {
				defaultDataDir = new File(".").getAbsolutePath();
			}

			return defaultDataDir + "/muikku-plugins";
		}

		return pluginsFolder;
	}

}

package fi.muikku.plugin.jpa;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.sql.Array;
import java.sql.Blob;
import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.NClob;
import java.sql.PreparedStatement;
import java.sql.SQLClientInfoException;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.sql.Savepoint;
import java.sql.Statement;
import java.sql.Struct;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.Executor;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.persistence.spi.PersistenceUnitTransactionType;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.hibernate.HibernateException;
import org.hibernate.cfg.Configuration;
import org.hibernate.ejb.EntityManagerFactoryImpl;
import org.hibernate.internal.SessionFactoryImpl;
import org.hibernate.service.Service;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;
import org.hibernate.service.jdbc.connections.spi.ConnectionProvider;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginContextClassLoader;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugin.PluginPersistence;
import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;
import fi.muikku.Logged;

@Stateful
public class EntityManagerFactoryProducer {
	
	@PersistenceUnit
	private EntityManagerFactory coreEntityManagerFactory;
	
	@Inject
  private Instance<PersistencePluginDescriptor> persistencePlugins;

	@SuppressWarnings("unchecked")
	@Produces	
	@ApplicationScoped
	@PluginPersistence
	@PluginContextClassLoader
	@Logged
	public synchronized EntityManagerFactory produceEntityManagerFactory() throws HibernateException, SAXException, IOException, ParserConfigurationException, URISyntaxException {
		EntityManagerFactoryImpl coreEntityManagerFactoryImpl = (EntityManagerFactoryImpl) coreEntityManagerFactory;
		SessionFactoryImpl coreSessionFactory = (SessionFactoryImpl) coreEntityManagerFactoryImpl.getSessionFactory();
		
		Configuration configuration = new Configuration()
		  .configure(readConfiguration());
/**
		Properties configProperties = configuration.getProperties();
		Map<String, String> configurationValues = new HashMap<>();
		for (Object propertyObject : configProperties.keySet()) {
			String property = (String) propertyObject; 
			configurationValues.put(property, configProperties.getProperty(property));
		}
**/		
		ServiceRegistry coreServiceRegistry = coreSessionFactory.getServiceRegistry();
	  ServiceRegistryBuilder pluginServiceRegistryBuilder = new ServiceRegistryBuilder();
	
    copyServices(coreServiceRegistry, pluginServiceRegistryBuilder,
  	  org.hibernate.event.service.spi.EventListenerRegistry.class, 
  		org.hibernate.stat.spi.StatisticsImplementor.class, 
  		org.hibernate.service.jdbc.connections.spi.MultiTenantConnectionProvider.class, 
  		org.hibernate.service.config.spi.ConfigurationService.class, 
  		org.hibernate.service.jdbc.dialect.spi.DialectResolver.class, 
  		org.hibernate.service.instrumentation.spi.InstrumentationService.class, 
  		org.hibernate.engine.jdbc.spi.JdbcServices.class, 
  		org.hibernate.tool.hbm2ddl.ImportSqlCommandExtractor.class, 
  		org.hibernate.service.jdbc.dialect.spi.DialectFactory.class, 
  		org.hibernate.cache.spi.RegionFactory.class, 
  		org.hibernate.persister.spi.PersisterFactory.class, 
  		org.hibernate.id.factory.spi.MutableIdentifierGeneratorFactory.class, 
  		org.hibernate.engine.transaction.spi.TransactionFactory.class, 
  		org.hibernate.service.jmx.spi.JmxService.class, 
  		org.hibernate.engine.jdbc.batch.spi.BatchBuilder.class, 
  		org.hibernate.persister.spi.PersisterClassResolver.class,
  		org.hibernate.service.jndi.spi.JndiService.class,
		  org.hibernate.service.jta.platform.spi.JtaPlatform.class,
      org.hibernate.service.spi.SessionFactoryServiceRegistryFactory.class,
	    org.hibernate.service.jdbc.connections.spi.ConnectionProvider.class
    );
    
    ServiceRegistry pluginServiceRegistry = pluginServiceRegistryBuilder.buildServiceRegistry();
		
		try {
			List<PluginLibraryDescriptor> pluginLibraries = SingletonPluginManager.getInstance().discoverPluginLibraries();
			for (PluginLibraryDescriptor pluginLibrary : pluginLibraries) {
				for (Class<? extends PluginDescriptor> pluginDescriptorClass : pluginLibrary.getPlugins()) {
					try {
						PluginDescriptor pluginDescriptor = pluginDescriptorClass.newInstance();
						if (pluginDescriptor instanceof PersistencePluginDescriptor) {
							PersistencePluginDescriptor persistencePluginDescriptor = (PersistencePluginDescriptor) pluginDescriptor;
							for (Class<?> entity : persistencePluginDescriptor.getEntities()) {
								configuration.addAnnotatedClass(entity);
							}
						}
					} catch (Exception e) {
						throw new ExceptionInInitializerError(e);
					} 
				}
			}
		} catch (PluginManagerException e) {
			throw new ExceptionInInitializerError(e);
		}
		
		// TODO: only in development mode
		if (true) {
			ServiceRegistry updaterServiceRegistry = new ServiceRegistryBuilder()
		  	.addService(ConnectionProvider.class, new UpdaterDatasourceConnectionProvider(pluginServiceRegistry.getService(ConnectionProvider.class)))
				.buildServiceRegistry();
			
			SchemaUpdate schemaUpdate = new SchemaUpdate(updaterServiceRegistry, configuration);
			schemaUpdate.execute(true, true);
		}
		
		PersistenceUnitTransactionType transactionType = PersistenceUnitTransactionType.JTA;
		boolean discardOnClose = false;
		Class<?> sessionInterceptorClass = null; 

		EntityManagerFactoryImpl entityManagerFactoryImpl = new EntityManagerFactoryImpl(
				transactionType, 
				discardOnClose, 
				sessionInterceptorClass, 
				configuration, 
				pluginServiceRegistry, 
				"muikku-plugins");

		return entityManagerFactoryImpl;
	}
	
	private void copyServices(ServiceRegistry coreServiceRegistry, ServiceRegistryBuilder pluginServiceRegistryBuilder, @SuppressWarnings("unchecked") Class<? extends Service>... serviceRoles) {
		for (Class<? extends Service> serviceRole : serviceRoles) {
			Service service = coreServiceRegistry.getService(serviceRole);
			pluginServiceRegistryBuilder.addService(serviceRole, service);
		}
	}

	private Document readConfiguration() throws SAXException, IOException, ParserConfigurationException, URISyntaxException {
		DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
		return documentBuilder.parse(getConfigurationUri());
	}
	
	private String getConfigurationUri() throws MalformedURLException, URISyntaxException {
		URL configResource = getClass().getClassLoader().getResource("META-INF/plugins.cfg.xml");
		return configResource.toURI().toURL().toString();
	}

	private class UpdaterDatasourceConnectionProvider implements ConnectionProvider {
		
		private static final long serialVersionUID = 1L;

		public UpdaterDatasourceConnectionProvider(ConnectionProvider delegate) {
			this.delegate = delegate;
		}

		@SuppressWarnings("rawtypes")
		public boolean isUnwrappableAs(Class unwrapType) {
			return delegate.isUnwrappableAs(unwrapType);
		}

		public Connection getConnection() throws SQLException {
			return new UpdaterDatasourceConnection( delegate.getConnection() );
		}

		public <T> T unwrap(Class<T> unwrapType) {
			return delegate.unwrap(unwrapType);
		}

		public void closeConnection(Connection conn) throws SQLException {
			delegate.closeConnection(conn);
		}

		public boolean supportsAggressiveRelease() {
			return delegate.supportsAggressiveRelease();
		}
		
		private ConnectionProvider delegate;
	}
	
	private class UpdaterDatasourceConnection implements Connection {

		public UpdaterDatasourceConnection(Connection delegate) {
			this.delegate = delegate;
		}
		
		private Connection delegate;

		public <T> T unwrap(Class<T> iface) throws SQLException {
			return delegate.unwrap(iface);
		}

		public boolean isWrapperFor(Class<?> iface) throws SQLException {
			return delegate.isWrapperFor(iface);
		}

		public Statement createStatement() throws SQLException {
			return delegate.createStatement();
		}

		public PreparedStatement prepareStatement(String sql) throws SQLException {
			return delegate.prepareStatement(sql);
		}

		public CallableStatement prepareCall(String sql) throws SQLException {
			return delegate.prepareCall(sql);
		}

		public String nativeSQL(String sql) throws SQLException {
			return delegate.nativeSQL(sql);
		}

		public void setAutoCommit(boolean autoCommit) throws SQLException {
//			delegate.setAutoCommit(autoCommit);
		}

		public boolean getAutoCommit() throws SQLException {
			return true;
		}

		public void commit() throws SQLException {
			delegate.commit();
		}

		public void rollback() throws SQLException {
			delegate.rollback();
		}

		public void close() throws SQLException {
			delegate.close();
		}

		public boolean isClosed() throws SQLException {
			return delegate.isClosed();
		}

		public DatabaseMetaData getMetaData() throws SQLException {
			return delegate.getMetaData();
		}

		public void setReadOnly(boolean readOnly) throws SQLException {
			delegate.setReadOnly(readOnly);
		}

		public boolean isReadOnly() throws SQLException {
			return delegate.isReadOnly();
		}

		public void setCatalog(String catalog) throws SQLException {
			delegate.setCatalog(catalog);
		}

		public String getCatalog() throws SQLException {
			return delegate.getCatalog();
		}

		public void setTransactionIsolation(int level) throws SQLException {
			delegate.setTransactionIsolation(level);
		}

		public int getTransactionIsolation() throws SQLException {
			return delegate.getTransactionIsolation();
		}

		public SQLWarning getWarnings() throws SQLException {
			return delegate.getWarnings();
		}

		public void clearWarnings() throws SQLException {
			delegate.clearWarnings();
		}

		public Statement createStatement(int resultSetType, int resultSetConcurrency) throws SQLException {
			return delegate.createStatement(resultSetType, resultSetConcurrency);
		}

		public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
			return delegate.prepareStatement(sql, resultSetType, resultSetConcurrency);
		}

		public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
			return delegate.prepareCall(sql, resultSetType, resultSetConcurrency);
		}

		public Map<String, Class<?>> getTypeMap() throws SQLException {
			return delegate.getTypeMap();
		}

		public void setTypeMap(Map<String, Class<?>> map) throws SQLException {
			delegate.setTypeMap(map);
		}

		public void setHoldability(int holdability) throws SQLException {
			delegate.setHoldability(holdability);
		}

		public int getHoldability() throws SQLException {
			return delegate.getHoldability();
		}

		public Savepoint setSavepoint() throws SQLException {
			return delegate.setSavepoint();
		}

		public Savepoint setSavepoint(String name) throws SQLException {
			return delegate.setSavepoint(name);
		}

		public void rollback(Savepoint savepoint) throws SQLException {
			delegate.rollback(savepoint);
		}

		public void releaseSavepoint(Savepoint savepoint) throws SQLException {
			delegate.releaseSavepoint(savepoint);
		}

		public Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
			return delegate.createStatement(resultSetType, resultSetConcurrency, resultSetHoldability);
		}

		public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
			return delegate.prepareStatement(sql, resultSetType, resultSetConcurrency, resultSetHoldability);
		}

		public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
			return delegate.prepareCall(sql, resultSetType, resultSetConcurrency, resultSetHoldability);
		}

		public PreparedStatement prepareStatement(String sql, int autoGeneratedKeys) throws SQLException {
			return delegate.prepareStatement(sql, autoGeneratedKeys);
		}

		public PreparedStatement prepareStatement(String sql, int[] columnIndexes) throws SQLException {
			return delegate.prepareStatement(sql, columnIndexes);
		}

		public PreparedStatement prepareStatement(String sql, String[] columnNames) throws SQLException {
			return delegate.prepareStatement(sql, columnNames);
		}

		public Clob createClob() throws SQLException {
			return delegate.createClob();
		}

		public Blob createBlob() throws SQLException {
			return delegate.createBlob();
		}

		public NClob createNClob() throws SQLException {
			return delegate.createNClob();
		}

		public SQLXML createSQLXML() throws SQLException {
			return delegate.createSQLXML();
		}

		public boolean isValid(int timeout) throws SQLException {
			return delegate.isValid(timeout);
		}

		public void setClientInfo(String name, String value) throws SQLClientInfoException {
			delegate.setClientInfo(name, value);
		}

		public void setClientInfo(Properties properties) throws SQLClientInfoException {
			delegate.setClientInfo(properties);
		}

		public String getClientInfo(String name) throws SQLException {
			return delegate.getClientInfo(name);
		}

		public Properties getClientInfo() throws SQLException {
			return delegate.getClientInfo();
		}

		public Array createArrayOf(String typeName, Object[] elements) throws SQLException {
			return delegate.createArrayOf(typeName, elements);
		}

		public Struct createStruct(String typeName, Object[] attributes) throws SQLException {
			return delegate.createStruct(typeName, attributes);
		}

		public void setSchema(String schema) throws SQLException {
			delegate.setSchema(schema);
		}

		public String getSchema() throws SQLException {
			return delegate.getSchema();
		}

		public void abort(Executor executor) throws SQLException {
			delegate.abort(executor);
		}

		public void setNetworkTimeout(Executor executor, int milliseconds) throws SQLException {
			delegate.setNetworkTimeout(executor, milliseconds);
		}

		public int getNetworkTimeout() throws SQLException {
			return delegate.getNetworkTimeout();
		}
	}
}

package fi.muikku.plugin;

import java.io.Serializable;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.transaction.Status;
import javax.transaction.UserTransaction;

@Interceptor
@Transactional
public class TransactionalInterceptor implements Serializable {

	private static final long serialVersionUID = 8447857990979498330L;

	private Logger logger = Logger.getLogger(getClass().getName());
	
	@Resource
	private UserTransaction userTransaction;
	
	@AroundInvoke
  public Object requireTransaction(InvocationContext ctx) throws Exception {
		boolean transactionInitiator = userTransaction.getStatus() != Status.STATUS_ACTIVE;
		if (transactionInitiator) {
			logger.finest(ctx.getMethod() + " started new transaction");
			userTransaction.begin();
		} else {
			logger.finest(ctx.getMethod() + " joining existing transaction");
		}
		
		Object result = null;
		
		try {
			result = ctx.proceed();
			
			if (transactionInitiator) {
				logger.finest(ctx.getMethod() + " commited transaction");
				
				userTransaction.commit();
			} else {
				logger.finest(ctx.getMethod() + " not commiting joined transaction");
			}
		} catch (Throwable t) {
			if (transactionInitiator) {
			  logger.finest(ctx.getMethod() + "  rolling transaction back");
  			userTransaction.rollback();
			}
			
			throw t;
		} 
		
		return result;
	}
}
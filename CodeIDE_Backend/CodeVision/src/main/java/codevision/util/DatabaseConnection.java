package codevision.util;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletRequestAttributeEvent;
import javax.servlet.ServletRequestAttributeListener;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionActivationListener;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;

/**
 * Application Lifecycle Listener implementation class DatabaseConnection
 *
 */
@WebListener
public class DatabaseConnection implements ServletContextListener, ServletContextAttributeListener, ServletRequestListener, ServletRequestAttributeListener, HttpSessionListener, HttpSessionAttributeListener, HttpSessionActivationListener, HttpSessionBindingListener {

    /**
     * Default constructor. 
     */
    public DatabaseConnection() 
    {
        // TODO Auto-generated constructor stub
    }

    private static String URL;
	private static String USER;
	private static String PASSWORD;
	private static Connection connection;
	
	public void contextInitialized(ServletContextEvent sce) 
	{
	    ServletContext context = sce.getServletContext();
	    URL = context.getInitParameter("dbURL");
	    USER = context.getInitParameter("dbUser");
	    PASSWORD = context.getInitParameter("dbPassword");
	    
	    System.out.println(URL + " " + USER + " " + PASSWORD);

        try 
        {
        	Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("===> " + connection);
            System.out.println("Database connection initialized successfully.");
        }
        catch (SQLException e) 
        {
            System.err.println("Database connection error: " + e.getMessage());
        }
        catch (Exception e)
        {
        	System.err.println("Database connection error: " + e.getMessage());
        }

	    System.out.println("Database URL: " + URL);
	    System.out.println("Database User: " + USER);
	    System.out.println("Database Password: " + PASSWORD);
	}
	
//	public static Connection getConnection()
//	{
//		if (connection == null)
//		{
//
//        	System.out.println(URL);
//        	System.out.println(USER);
//        	System.out.println(PASSWORD);
//			synchronized (DbConnection.class)
//			{
//				if (connection == null)
//				{
//					try 
//					{
//						connection = DriverManager.getConnection(URL, USER, PASSWORD);
//					} 
//					catch (Exception e)
//					{
//						System.out.println("Error is occurs during make the Database Connection: " + e.getMessage());
//					}
//				}
//			}
//		}
//		return connection;
//	}
	
	 public static Connection getConnection() throws SQLException {
	        if (connection == null || connection.isClosed()) {
	            synchronized (DatabaseConnection.class) {
	                if (connection == null || connection.isClosed()) {
	                    connection = DriverManager.getConnection(URL, USER, PASSWORD);
	                }
	            }
	        }
	        return connection;
	    }
	
	 @Override
	    public void contextDestroyed(ServletContextEvent sce) {
		 System.out.println("Shutting down database connections...");

	        if (connection != null) {
	            try {
	                connection.close();
	                System.out.println("Database connection closed.");
	            } catch (SQLException e) {
	                System.err.println("Error closing database connection: " + e.getMessage());
	            }
	        }

	        // Deregister JDBC drivers to prevent memory leaks
	        Enumeration<Driver> drivers = DriverManager.getDrivers();
	        while (drivers.hasMoreElements()) {
	            Driver driver = drivers.nextElement();
	            try {
	                DriverManager.deregisterDriver(driver);
	                System.out.println("Deregistered JDBC Driver: " + driver);
	            } catch (SQLException e) {
	                System.err.println("Error deregistering driver: " + e.getMessage());
	            }
	        }

	        // Stop MySQL Abandoned Connection Cleanup Thread
	        try {
	            AbandonedConnectionCleanupThread.checkedShutdown();
	            System.out.println("MySQL Cleanup Thread Stopped.");
	        } catch (Exception e) {
	            System.err.println("Error stopping MySQL Cleanup Thread: " + e.getMessage());
	        }
	    }
    
	/**
     * @see HttpSessionListener#sessionCreated(HttpSessionEvent)
     */
    public void sessionCreated(HttpSessionEvent se)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see ServletContextAttributeListener#attributeRemoved(ServletContextAttributeEvent)
     */
    public void attributeRemoved(ServletContextAttributeEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see ServletRequestAttributeListener#attributeAdded(ServletRequestAttributeEvent)
     */
    public void attributeAdded(ServletRequestAttributeEvent srae)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionAttributeListener#attributeReplaced(HttpSessionBindingEvent)
     */
    public void attributeReplaced(HttpSessionBindingEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionActivationListener#sessionWillPassivate(HttpSessionEvent)
     */
    public void sessionWillPassivate(HttpSessionEvent se)  { 
         // TODO Auto-generated method stub
    }

//	/**
//     * @see ServletContextListener#contextInitialized(ServletContextEvent)
//     */
//    public void contextInitialized(ServletContextEvent sce)  { 
//         // TODO Auto-generated method stub
//    }

	/**
     * @see ServletContextAttributeListener#attributeAdded(ServletContextAttributeEvent)
     */
    public void attributeAdded(ServletContextAttributeEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see ServletRequestListener#requestDestroyed(ServletRequestEvent)
     */
    public void requestDestroyed(ServletRequestEvent sre)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see ServletRequestAttributeListener#attributeRemoved(ServletRequestAttributeEvent)
     */
    public void attributeRemoved(ServletRequestAttributeEvent srae)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see ServletRequestListener#requestInitialized(ServletRequestEvent)
     */
    public void requestInitialized(ServletRequestEvent sre)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionBindingListener#valueBound(HttpSessionBindingEvent)
     */
    public void valueBound(HttpSessionBindingEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionListener#sessionDestroyed(HttpSessionEvent)
     */
    public void sessionDestroyed(HttpSessionEvent se)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionActivationListener#sessionDidActivate(HttpSessionEvent)
     */
    public void sessionDidActivate(HttpSessionEvent se)  { 
         // TODO Auto-generated method stub
    }

//	/**
//     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
//     */
//    public void contextDestroyed(ServletContextEvent sce)  { 
//         // TODO Auto-generated method stub
//    }

	/**
     * @see ServletRequestAttributeListener#attributeReplaced(ServletRequestAttributeEvent)
     */
    public void attributeReplaced(ServletRequestAttributeEvent srae)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionAttributeListener#attributeAdded(HttpSessionBindingEvent)
     */
    public void attributeAdded(HttpSessionBindingEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionAttributeListener#attributeRemoved(HttpSessionBindingEvent)
     */
    public void attributeRemoved(HttpSessionBindingEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see ServletContextAttributeListener#attributeReplaced(ServletContextAttributeEvent)
     */
    public void attributeReplaced(ServletContextAttributeEvent event)  { 
         // TODO Auto-generated method stub
    }

	/**
     * @see HttpSessionBindingListener#valueUnbound(HttpSessionBindingEvent)
     */
    public void valueUnbound(HttpSessionBindingEvent event)  { 
         // TODO Auto-generated method stub
    }
	
}

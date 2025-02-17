package codevision.util;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet Filter implementation class CORSFilter
 */
//@WebFilter("/CORSFilter")
public class CORSFilter implements Filter {
	/**
     * @see HttpFilter#HttpFilter()
     */
    public CORSFilter() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	 public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
	            throws IOException, ServletException {

	        HttpServletResponse httpResponse = (HttpServletResponse) response;
	        HttpServletRequest httpRequest = (HttpServletRequest) request;

	        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
	        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");

	        // Handle pre-flight requests
	        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
	            httpResponse.setStatus(HttpServletResponse.SC_OK);
	            return;
	        }
	        
	        System.out.println("CORSFilter applied");

	        // Continue the request chain
	        chain.doFilter(request, response);
	    }

	/**
	 * @see Filter#init(FilterConfig)
	 */
	 public void init(FilterConfig filterConfig) throws ServletException {}
}

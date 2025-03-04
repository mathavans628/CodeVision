package codevision.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Servlet implementation class CodeBeautifyServlet
 */
@WebServlet("/CodeBeautifyServlet")
public class CodeBeautifyServlet extends HttpServlet {
	
	
	
	private static WebDriver driver;
	private static final long serialVersionUID = 1L;
	private static String beautifiedCode = "";


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
	    response.setHeader("Access-Control-Allow-Credentials", "true");
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");	
	    
	    if (driver == null) {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--disable-gpu", "--no-sandbox", "--blink-settings=imagesEnabled=false");
            driver = new ChromeDriver(options);
            driver.manage().window().maximize();
        }
		
		String lang = request.getParameter("selectedLanguage");
		String userCode = request.getParameter("code");
		
		
		System.out.println(lang);

        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));

	    
//		if(lang.equals("php"))
//		{
//			driver.navigate().to("https://codebeautify.org/php-beautifier");
//			driver.navigate().refresh();
//			
//
//				JavascriptExecutor js = (JavascriptExecutor) driver;
//				js.executeScript("ace.edit('inputACEEditor').setValue(arguments[0]);", userCode);
//				
//				WebElement output = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"outputACEEditor\"]/div[2]/div/div[3]")));
//
//				
//				beautifiedCode = output.getText();
//		}
//		else if(lang.equals("python3"))
//		{
//			driver.navigate().to("https://www.tutorialspoint.com/online_python_formatter.htm");
//			driver.navigate().refresh();
//			
//			
//			try {
//	        	JavascriptExecutor js = (JavascriptExecutor) driver;
//	        	js.executeScript("ace.edit('code').setValue(arguments[0]);", userCode);
//	        }
//	        catch(Exception e)
//	        {
//	        	System.out.println("Failed to get input box"+e.getMessage());
//	        }
//	        
//		 	WebElement runButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"beautify\"]")));
//	        runButton.click();
//	        
//	        try {
//				Thread.sleep(1000);
//			} catch (InterruptedException e) {
//				e.printStackTrace();
//			}
//	        
//	        WebElement outputBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"result\"]/div[2]/div/div[3]")));
//	        beautifiedCode = outputBox.getText();
//		}
//
//		else {
//			
//			driver.navigate().to("https://www.tutorialspoint.com/online_java_formatter.htm");
//			driver.navigate().refresh();
//			
//			 try {
//		        	JavascriptExecutor js = (JavascriptExecutor) driver;
//		        	js.executeScript("ace.edit('code').setValue(arguments[0]);", userCode);
//		        }
//		        catch(Exception e)
//		        {
//		        	System.out.println("Failed to get input box"+e.getMessage());
//		        }
//		        
//			 	WebElement runButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"beautify\"]")));
//		        runButton.click();
//		        
//		        try {
//					Thread.sleep(1000);
//				} catch (InterruptedException e) {
//					e.printStackTrace();
//				}
//		        
//		        WebElement outputBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"result\"]/div[2]/div/div[3]")));
//		        beautifiedCode = outputBox.getText();
//		}
        
        driver.navigate().to("https://zzzcode.ai/code-documentation");
        WebElement langBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiP1\"]")));
        langBox.click();
        langBox.sendKeys(lang);
        
        WebElement codeBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiP3\"]")));
        codeBox.click();
        codeBox.sendKeys(userCode);
        
        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiOption1\"]")));
        dropDown.click();
        
        WebElement dropDownValue = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiOption1\"]/option[2]")));
        dropDownValue.click();
        
        WebElement run = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiActionButton")));
        run.click();
        
        try {
        	Thread.sleep(2000);
        }
        catch(InterruptedException e)
        {
        	System.out.println(e.getMessage());
        }
        
        WebElement outputBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiOutputHtml\"]/pre/div/div[2]/code")));
        beautifiedCode = outputBox.getText();
	
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        out.write(beautifiedCode);
        
        System.out.println(beautifiedCode);
        
        out.flush();
        
        driver.quit();
        
        
	}


}

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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Servlet implementation class GenerateCodeServlet
 */
@WebServlet("/GenerateCodeServlet")
public class GenerateCodeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static WebDriver driver;
	

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		WebDriverManager.chromedriver().setup();
		
		ChromeOptions options = new ChromeOptions();
//		option.addArguments("--headless=new");
		options.addArguments("--headless");  // Run in headless mode
        options.addArguments("--disable-gpu");  // Disable GPU rendering
        options.addArguments("--window-size=1920,1080");  // Ensure proper element visibility
        options.addArguments("--no-sandbox");  // Bypass OS security restrictions
        options.addArguments("--disable-dev-shm-usage");
		
		driver = new ChromeDriver(options);
		
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
	    response.setHeader("Access-Control-Allow-Credentials", "true");
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");	
	    
		String prompt = request.getParameter("prompt").toLowerCase().trim();
		String lang = request.getParameter("lang");
		String generatedCode = "";
		
		System.out.println("Lang: "+lang);
		System.out.println("Prompt: "+prompt);
		
		
		
		
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(50));
		
		String[] promptArr = prompt.split(" ");
		
		String[] arr= new String[] {"java","js","javascript","python","rlang","ruby","r","go","golang","php","c","cpp","c++","html"};
		
		 
        loop1:for (int i = 0; i < promptArr.length; i++) {
//            if (prompt.contains(arr[i])) {
//            	lang = arr[i];
//                break;
//            }
        	for(int j=0;j<arr.length;j++)
        	{
        		if(promptArr[i].equals(arr[j]))
        		{
        			lang = arr[j];
        			break loop1;
        		}
        	}
        }
		
		
		driver.get("https://zzzcode.ai/code-generator");
		
		WebElement languageBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiP1\"]")));
//		languageBox.click();
		languageBox.sendKeys(lang);
		
		WebElement promptBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiP2\"]")));
		promptBox.click();
		promptBox.sendKeys(prompt+ " If the language need Main class like that, give with Main. Always name the Main class as Main. Don't show my prompt. ");
		
		WebElement run = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiActionButton\"]")));
		run.click();
		
		try {
		Thread.sleep(10000);
		}
		catch(InterruptedException e)
		{
			System.out.println(e.getMessage());
		}
//		WebElement waiting = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"uiOutputHtml\"]/h2")));
		
		WebElement outputBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiOutputHtml\"]/pre/div/div[2]/code")));
		generatedCode = outputBox.getText();
		
		response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        if(lang.equals("js")|| lang.equals("javascript"))
		{
			lang = "javascript";
		}
        else if(lang.equals("java"))
		{
        	System.out.println("java");
			lang = "java";
		}
		else if(lang.equals("python"))
		{
			lang = "python3";
		}
		else if(lang.equals("go"))
		{
			lang = "golang";
		}
		else if(lang.equals("r"))
		{
			lang = "rlang";
		}
		else if(lang.equals("c++") || lang.equals("cpp"))
		{
			lang = "cpp";
		}
		else if(lang.equals("c"))
		{
			lang = "c";
		}
		else if(lang.equals("ruby"))
		{
			lang = "ruby";
		}
		else if(lang.equals("html"))
		{
			lang = "web";
		}
        
        
        out.write(generatedCode+" TextLanguage:"+lang);
        
        System.out.println(generatedCode);
        System.out.println(lang);
        
        out.flush();
        
        driver.quit();
	}

}

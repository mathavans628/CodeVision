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
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
	    response.setHeader("Access-Control-Allow-Credentials", "true");
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");	
	    
		String prompt = request.getParameter("prompt").toLowerCase().trim();
		String lang = request.getParameter("lang");
		String generatedCode = "";
		
		System.out.println("Lang: "+lang);
		System.out.println("Prompt: "+prompt);
		
		
		WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver();
		
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(50));
		
		String[] arr= new String[] {" java "," js "," javascript ","java script","python","rlang"," r lang"," r ","go","golang","go lang","php","ruby"," c ","cpp","c++"," c"};
		
		 
        for (int i = 0; i < arr.length; i++) {
        	System.out.println(arr[i]);
        	System.out.println(prompt.contains(arr[i]));
            if (prompt.contains(arr[i])) { // Trim spaces & ignore case
                System.out.println("Matched language: " + arr[i]);
                break; // Stop after finding the first match
            }
        }
		
		
		driver.get("https://zzzcode.ai/code-generator");
		
		WebElement languageBox = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiP1")));
		languageBox.click();
		languageBox.sendKeys(lang);
		
		WebElement promptBox = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiP2")));
		promptBox.click();
		promptBox.sendKeys(prompt);
		
		WebElement run = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiActionButton")));
		run.click();
		
		try {
		Thread.sleep(7000);
		}
		catch(InterruptedException e)
		{
			System.out.println(e.getMessage());
		}
//		WebElement waiting = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"uiOutputHtml\"]/h2")));
		
		WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id=\"uiOutputHtml\"]/pre/div/div[2]/code")));
		
		WebElement outputBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiOutputHtml\"]/pre/div/div[2]/code")));
		generatedCode = outputBox.getText();
		
		response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        if(lang.equals("js") || lang.equals("java script"))
		{
			lang = "javascript";
		}
		else if(lang.equals("python"))
		{
			lang = "python3";
		}
		else if(lang.equals("go") || lang.equals("go lang"))
		{
			lang = "golang";
		}
		else if(lang.equals(" r") || lang.equals("r lang"))
		{
			lang = "rlang";
		}
		else if(lang.equals("c++"))
		{
			lang = "cpp";
		}
		else if(lang.equals(" c ") || lang.equals(" c"))
		{
			lang = "c";
		}
        
        
        out.write(generatedCode+" TextLanguage:"+lang);
        
        System.out.println(generatedCode);
        System.out.println(lang);
        
        out.flush();
        
        driver.quit();
	}

}

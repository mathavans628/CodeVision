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
 * Servlet implementation class CodeConvertorServlet
 */
@WebServlet("/CodeConvertorServlet")
public class CodeConvertorServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static WebDriver driver;
	private static String convertedCode = "";
       
 
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String lang = request.getParameter("selectedLanguage");
		String convertedLang = request.getParameter("lang");
		String code = request.getParameter("code");
		
		System.out.println(convertedLang);
		
		WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver();
		
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(50));
		
		driver.navigate().to("https://zzzcode.ai/code-converter");
		driver.navigate().refresh();
		
		WebElement fromLang = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiP1")));
		fromLang.click();
		fromLang.clear();
		fromLang.sendKeys(lang);
		
		WebElement toLang = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiP2")));
		toLang.click();
		toLang.clear();
		toLang.sendKeys(convertedLang);
		
		WebElement inputBox = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiP3")));
		inputBox.click();
		inputBox.clear();
		inputBox.sendKeys(code);
		
		WebElement run = wait.until(ExpectedConditions.elementToBeClickable(By.id("uiActionButton")));
		run.click();
		
		try {
		Thread.sleep(4000);
		}
		catch(InterruptedException e)
		{
			System.out.println(e.getMessage());
		}
		
		WebElement output = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"uiOutputHtml\"]/pre/div/div[2]/code")));
		
		convertedCode = output.getText();
		
		
		response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        out.write(convertedCode);
        
        System.out.println(convertedCode);
        
        out.flush();
        
        driver.quit();
	}

}

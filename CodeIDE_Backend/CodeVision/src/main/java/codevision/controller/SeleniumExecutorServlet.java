package codevision.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.github.bonigarcia.wdm.WebDriverManager;

@WebServlet("/SeleniumExecutorServlet/*")
public class SeleniumExecutorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static WebDriver driver;

    @Override
    public void init() throws ServletException {
        if (driver == null) {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
//            options.addArguments("--disable-gpu", "--no-sandbox", "--blink-settings=imagesEnabled=false");
            options.addArguments("--disable-gpu", "--no-sandbox", "--blink-settings=imagesEnabled=false","--headless=new");
            options.setPageLoadStrategy(PageLoadStrategy.EAGER);
            driver = new ChromeDriver(options);
            driver.get("https://www.online-ide.com/");
            
            driver.manage().window().maximize();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174"); 
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        if (driver == null) 
        {
            init(); 
        }
        
        String path = request.getPathInfo();
        if ("/submitUserInput".equals(path)) {
            handleUserInput(request, response);
            return;
        }

        String userCode = request.getParameter("code");
        String language = request.getParameter("language");

        if (userCode == null || userCode.trim().isEmpty() || language == null || language.trim().isEmpty()) {
            out.write("{\"error\": \"No code or language provided.\"}");
            return;
        }
        
        String lastOutput = "";

        
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
            JavascriptExecutor js = (JavascriptExecutor) driver;

            // Select language
            WebElement langDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.id("lang-select")));
            langDropdown.click();
            System.out.println("Language=" + language);
            WebElement langOption = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@data-value='" + language + "']")));
            langOption.click();

            // Insert code
            WebElement editor = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(@class, 'ace_editor')]")));
            editor.click();
            Thread.sleep(500);
            js.executeScript("ace.edit(document.querySelector('.ace_editor')).setValue(arguments[0]);", userCode);
            js.executeScript("ace.edit(document.querySelector('.ace_editor')).navigateFileEnd();");

            // Click Run button
            WebElement runButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("run-btn")));
            runButton.click();

            
            Gson gson = new Gson();

            do {
                WebElement outputElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("wrap")));
                String newOutput = outputElement.getAttribute("innerText");

                if (!newOutput.equals(lastOutput)) {
                    JsonObject jsonOutput = new JsonObject();
                    jsonOutput.addProperty("output", newOutput.replace("\n", "\\n"));
                    out.write(gson.toJson(jsonOutput) + "\n");
                    out.flush();
                    lastOutput = newOutput;
                }
                Thread.sleep(2000);
            } while (!lastOutput.contains("** Process exited - Return Code:")); 
        } catch (Exception e) {
            out.write("{\"error\": \"Execution failed: " + e.getMessage() + "\"}");
        }
	    finally {
	    	if (driver != null) {
	            driver.quit();
	            driver = null;
	            System.out.println("WebDriver closed properly.");
	        }
	    }
    }

    private void handleUserInput(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PrintWriter out = response.getWriter();
        String userInput = request.getParameter("userInput");
        
        System.out.println("User input: " + userInput);

        if (userInput == null || userInput.trim().isEmpty()) {
            out.write("{\"error\": \"No input provided.\"}");
            return;
        }

        try {
        	   WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

               WebElement inputField = wait.until(ExpectedConditions.elementToBeClickable(By.id("term-input")));

               inputField.clear();
               inputField.sendKeys(userInput);

               inputField.sendKeys(Keys.RETURN);

        } catch (NoSuchElementException e) {
            out.write("{\"error\": \"Input field not found.\"}");
        }
    }

    @Override
    public void destroy() {
        if (driver != null) {
            driver.quit();
            driver = null;
            System.out.println("WebDriver closed properly.");
        }
    }
}

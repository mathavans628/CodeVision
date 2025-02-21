package codevision.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

@WebServlet("/SeleniumExecutorServle\\t/submitUserInput")
public class SeleniumUserInputServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static WebDriver driver;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userInput = request.getParameter("userInput");
        PrintWriter out = response.getWriter();
        
System.out.println("===> " + request.getSession().getId());
WebDriver driver = (WebDriver) request.getSession().getAttribute("webdriver"); // 🔥 Get existing WebDriver session
        
        System.out.println("Driver: " + driver);

        if (driver != null && userInput != null && !userInput.trim().isEmpty()) {
            try {
                WebElement inputField = driver.findElement(By.cssSelector("input[type='text'], textarea"));
                inputField.sendKeys(userInput);
                inputField.sendKeys(Keys.RETURN);

                // Capture new output
                WebElement outputElement = driver.findElement(By.cssSelector("#console-output"));
                out.println(outputElement.getText());

            } catch (Exception e) {
                out.println("Error processing input: " + e.getMessage());
            }
        } else {
            out.println("No active session or input provided.");
        }
    }
}
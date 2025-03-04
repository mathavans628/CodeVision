package codevision.controller;

import java.io.IOException;
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

@WebServlet("/SpeechToTextConvertServlet/*")
public class SpeechToTextConvertServlet extends HttpServlet {
    private static WebDriver driver;
    private static final long serialVersionUID = 1L;

    static {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--use-fake-device-for-media-stream");
        options.addArguments("--use-fake-ui-for-media-stream");
        driver = new ChromeDriver(options);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174"); 
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        String path = request.getPathInfo();
        if ("/StopRecording".equals(path)) {
            stopRecording(request, response);
            return;
        }

        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            
            driver.get("http://localhost:5173");

            WebElement startRecord = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='root']/div/div[1]/button[2]")));
            startRecord.click();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error starting recording: " + e.getMessage());
        }
    }

    private void stopRecording(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement stopRecord = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='root']/div/div[1]/button[3]")));
            stopRecord.click();

            WebElement saveButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='root']/div/div[1]/button[1]")));
            saveButton.click();

            WebElement resultText = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[@id='root']/div/div[2]/p")));
            String result = resultText.getText();

            String jsonResponse = "{ \"candidates\": [ { \"content\": { \"parts\": [ \"" + result + "\" ] } } ] }";
            response.getWriter().write(jsonResponse);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error stopping recording: " + e.getMessage());
        }
    }

    @Override
    public void destroy() {
        if (driver != null) {
            driver.quit();
        }
    }
}
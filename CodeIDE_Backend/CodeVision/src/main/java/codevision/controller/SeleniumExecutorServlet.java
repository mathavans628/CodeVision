package codevision.controller;

import java.io.FileWriter;
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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.json.Json;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

@WebServlet("/SeleniumExecutorServlet")
public class SeleniumExecutorServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        // Get the user-submitted code and language
        String code = request.getParameter("code");
        String language = request.getParameter("language");

        if (code == null || language == null) {
            out.write("{\"error\": \"Missing parameters\"}");
            return;
        }

        // Get the correct JDoodle URL based on the language
        String compilerURL = getCompilerURL(language);
        if (compilerURL == null) {
            out.write("{\"error\": \"Unsupported language\"}");
            return;
        }

        // Setup WebDriver
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-gpu", "--no-sandbox");
//        options.addArguments("--headless", "--disable-gpu", "--no-sandbox");
        WebDriver driver = new ChromeDriver(options);

        try {
            driver.get(compilerURL);
            driver.manage().window().maximize();

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));
            JavascriptExecutor js = (JavascriptExecutor) driver;

            // Wait for the editor and inject code
            WebElement editorDiv = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("ace_content")));
            editorDiv.click();

            // Inject the user's code into the JDoodle editor
            js.executeScript("ace.edit(document.querySelector('.ace_editor')).setValue(arguments[0]);", code);

            // Click the "Execute" button
            WebElement executeButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("execute-ide")));
            executeButton.click();

            // Wait for output to appear (Max 10 seconds)
            WebElement outputDiv = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@id='output']//div[contains(@class, 'ace_content')]")
            ));
            
//            Thread.sleep(10000);
//            wait.until(driver1 -> !outputDiv.getText().trim().isEmpty());

            Thread.sleep(15000); // Optional, can be removed

         // Re-locate the element after execution
         outputDiv = wait.until(ExpectedConditions.presenceOfElementLocated(
             By.xpath("//*[@id='output']//div[contains(@class, 'ace_content')]")
         ));

         String outputText = outputDiv.getText();
            
            // Extract the output text
//            String outputText = outputDiv.getText();
            System.out.println("Extracted Output:\n" + outputText);

            // Send response as JSON
            out.write("{\"output\": \"" + outputText.replace("\n", "\\n") + "\"}");

        } catch (Exception e) {
            out.write("{\"error\": \"Execution failed: " + e.getMessage() + "\"}");
        } finally {
            driver.quit();
        }
    }

    // Function to return the correct JDoodle compiler URL based on language
    private String getCompilerURL(String language) {
        return switch (language.toLowerCase()) {
            case "java" -> "https://www.jdoodle.com/online-java-compiler";
            case "python" -> "https://www.jdoodle.com/python3-programming-online";
            case "c" -> "https://www.jdoodle.com/c-online-compiler";
            case "csharp" -> "https://www.jdoodle.com/compile-c-sharp-online";
            case "cpp" -> "https://www.jdoodle.com/online-compiler-c++";
            case "r" -> "https://www.jdoodle.com/execute-r-online";
            case "go" -> "https://www.jdoodle.com/execute-go-online";
            case "php" -> "https://www.jdoodle.com/php-online-editor";
            case "swift" -> "https://www.jdoodle.com/execute-swift-online";
            default -> null;
        };
    }
}

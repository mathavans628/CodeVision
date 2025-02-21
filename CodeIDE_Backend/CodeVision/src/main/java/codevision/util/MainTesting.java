package codevision.util;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class MainTesting {
    public static void main(String[] args) {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-gpu", "--no-sandbox");

        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        JavascriptExecutor js = (JavascriptExecutor) driver;

        try {
            driver.get("https://www.jdoodle.com/online-java-compiler");

            // 🔹 Wait for the code editor textarea to load
            WebElement editorElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("ace_content")));

            // 🔹 Ensure the element is interactable before interacting
            wait.until(ExpectedConditions.elementToBeClickable(editorElement));

            // 🔹 Inject the code into the editor using JavaScript (ensure editor is ready)
            String code = "import java.util.Scanner;\n" +
                          "public class Main {\n" +
                          "    public static void main(String[] args) {\n" +
                          "        Scanner sc = new Scanner(System.in);\n" +
                          "        System.out.println(\"Enter your name:\");\n" +
                          "        String name = sc.nextLine();\n" +
                          "        System.out.println(\"Hello, \" + name);\n" +
                          "        System.out.println(\"Enter your age:\");\n" +
                          "        int age = sc.nextInt();\n" +
                          "        System.out.println(\"Your age is: \" + age);\n" +
                          "    }\n" +
                          "}";

            js.executeScript("ace.edit(document.querySelector('.ace_editor')).setValue(arguments[0]);", code);

            // 🔹 Wait for and click the "Run" button
            WebElement runButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("execute-ide")));
            runButton.click();

            // 🔹 Wait for Input Field if required
            Thread.sleep(2000); // Wait for the input field to show (if required)

            // 🔹 Send the first input (name)
            boolean inputRequired = driver.findElements(By.id("stdin")).size() > 0;
            if (inputRequired) {
                WebElement inputField = driver.findElement(By.id("stdin"));
                System.out.println("Program is waiting for input...");

                // Send first input (e.g., name)
                inputField.sendKeys("Mari");
                inputField.sendKeys(Keys.RETURN);

                // 🔹 Wait for the second input (age) prompt to appear
                Thread.sleep(2000); // Wait for second input field
                inputField = driver.findElement(By.id("stdin"));

                // Send second input (e.g., age)
                inputField.sendKeys("25");
                inputField.sendKeys(Keys.RETURN);
            }

            // 🔹 Wait for the output to appear
            WebElement finalOutput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("stdout")));
            System.out.println("Program Output:\n" + finalOutput.getText());

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            driver.quit(); // 🔹 Close Browser
        }
    }
}
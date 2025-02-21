package codevision.util;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;

public class OneCompilerAutomation {
    public static void main(String[] args) {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-gpu", "--no-sandbox");

        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        try {
            // 🔹 Open OneCompiler Java Page
            driver.get("https://onecompiler.com/java");

            // 🔹 Wait for Ace Editor to load
            WebElement editor = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("ace_content")));

            // 🔹 Use JavaScript to insert Java code into Ace Editor
            JavascriptExecutor js = (JavascriptExecutor) driver;
            String javaCode = "import java.util.Scanner;\n" +
                              "public class Main {\n" +
                              "    public static void main(String[] args) {\n" +
                              "        Scanner scanner = new Scanner(System.in);\n" +
                              "        System.out.println(\"Enter your name:\");\n" +
                              "        String name = scanner.nextLine();\n" +
                              "        System.out.println(\"Enter your age:\");\n" +
                              "        int age = scanner.nextInt();\n" +
                              "        System.out.println(\"Hello, \" + name + \"! You are \" + age + \" years old.\");\n" +
                              "    }\n" +
                              "}";
            
            js.executeScript("ace.edit(document.querySelector('.ace_editor')).setValue(arguments[0]);", javaCode);

            // 🔹 Locate the input textarea (STDIN input)
            WebElement inputField = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//textarea[@placeholder='Input for the program ( Optional )']")
            ));

            // 🔹 Enter input (Simulating user input: "Mari" and "25")
            inputField.sendKeys("Mari\n25\n");

            // 🔹 Click the 'Run' button
            WebElement runButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(),'Run')]")));
            runButton.click();

            // 🔹 Wait for output and print it
            WebElement output = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".output")));
            System.out.println("Program Output:\n" + output.getText());

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        } finally {
            driver.quit(); // 🔹 Close browser
        }
    }
}
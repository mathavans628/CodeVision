package codevision.util;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;

public class MainTesting 
{
    public static void main(String[] args) 
    {
        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();

        try 
        {
            driver.get("https://www.jdoodle.com/online-java-compiler");
            driver.manage().window().maximize();
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(30));
            JavascriptExecutor js = (JavascriptExecutor) driver;

            WebElement editorDiv = wait.until(ExpectedConditions.presenceOfElementLocated(By.className("ace_content")));
            editorDiv.click();  
            
            String javaCode = """
                public class MyClass {
                  public static void main(String args[]) {
                    int x=10;
                    int y=25;
                    int z=x+y;
                    System.out.println("Hello, World!");
                    System.out.println("Sum of x+y = " + z);
                  }
                }
            """;
            js.executeScript("ace.edit(document.querySelector('.ace_editor')).setValue(arguments[0]);", javaCode);

            WebElement executeButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("execute-ide")));
            executeButton.click();
            
            Thread.sleep(5000);

            WebElement outputDiv = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@id=\"output\"]/div[2]/div/div[3]")
            ));
            
            wait.until(driver1 -> !outputDiv.getText().trim().isEmpty());

            String outputText = outputDiv.getText();
            System.out.println("Extracted Output:\n" + outputText);
            
//            https://www.jdoodle.com/python3-programming-online
//            https://www.jdoodle.com/c-online-compiler
//            https://www.jdoodle.com/compile-c-sharp-online
//            https://www.jdoodle.com/online-compiler-c++
//            https://www.jdoodle.com/execute-r-online
//            https://www.jdoodle.com/execute-go-online
//            https://www.jdoodle.com/php-online-editor
//            https://www.jdoodle.com/execute-swift-online

        } 
        catch (Exception e) 
        {
            System.out.println("Error: " + e.getMessage());
        }
        finally 
        {
            driver.quit();
        }
    }
}
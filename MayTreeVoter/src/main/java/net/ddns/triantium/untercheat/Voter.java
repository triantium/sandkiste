package net.ddns.triantium.untercheat;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

public class Voter {

    public Long waitTime = 500L;

    public String firstVote = "bertoldsheim".toLowerCase();
    public String secondVote = "ambach".toLowerCase();

    private final static int upperERROR = Integer.MAX_VALUE;

    private WebDriver driver;

    public String username = "empty";
    public String pwd = "12345678";

    public String byomaddress = "byom.de";
    public String byomURL = "https://www." + byomaddress;

    public String ubURL = "https://www.schlossbrauerei-unterbaar.de/";
    public String regURL = "https://www.schlossbrauerei-unterbaar.de/gewinnspiel.html";
    public String abURL = "https://www.schlossbrauerei-unterbaar.de/abstimmung.html";

    public String captchaClass = "captcha_text";

    public Voter() {
        this.init();
    }

    private void init() {
        driver = new FirefoxDriver();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        driver.manage().deleteAllCookies();
        prepareTest();
    }

    public void prepareTest() {
        //TODO username
        driver.manage().deleteAllCookies();
        double randomVal = Math.random();
        randomVal *= 100000000000000L;
        Long val = (long) Math.floor(randomVal);
        username = Long.toString(val);

    }

    public void quit() {
        driver.quit();
    }

    public void execute() throws CaptchaException, RegistrationException {

        prepareTest();
        registerme();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException ex) {
            Logger.getLogger(Voter.class.getName()).log(Level.SEVERE, null, ex);
        }
        validateme();
        logmein();
        vote();
        System.out.println(username + " voted for " + firstVote + " and " + secondVote);

        // ERROR: Caught exception [ERROR: Unsupported command [selectWindow | win_ser_1 | ]]
    }

    private void registerme() throws CaptchaException {
        driver.get(regURL);
        driver.findElement(By.id("ctrl_username")).click();
        driver.findElement(By.id("ctrl_username")).clear();
        driver.findElement(By.id("ctrl_username")).sendKeys(username);
        watchMeSleep();
        driver.findElement(By.id("ctrl_email")).click();
        driver.findElement(By.id("ctrl_email")).clear();
        driver.findElement(By.id("ctrl_email")).sendKeys(username + "@byom.de");
        watchMeSleep();
        driver.findElement(By.id("ctrl_password")).click();
        driver.findElement(By.id("ctrl_password")).clear();
        driver.findElement(By.id("ctrl_password")).sendKeys(pwd);
        watchMeSleep();
        driver.findElement(By.id("ctrl_password_confirm")).clear();
        driver.findElement(By.id("ctrl_password_confirm")).sendKeys(pwd);
        watchMeSleep();
        driver.findElement(By.id("ctrl_registration")).clear();
        //TODO capthchaSolver

        WebElement element = driver.findElement(By.className(captchaClass));
        String captchaText = element.getText();
        int captchaSolved = captchaSolver(captchaText);

        driver.findElement(By.id("ctrl_registration")).sendKeys("" + captchaSolved);
        watchMeSleep();
        driver.findElement(By.xpath("//input[@value='Registrieren']")).click();

    }

    public void validateme() throws RegistrationException {
        driver.get(byomURL);
        watchMeSleep();
        Alert alert = driver.switchTo().alert();
        alert.accept();
        watchMeSleep();
        driver.findElement(By.id("main-search")).click();
        driver.findElement(By.id("main-search")).clear();
        driver.findElement(By.id("main-search")).sendKeys(username);
        watchMeSleep();
        driver.findElement(By.id("main-search-form")).submit();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException ex) {
            Logger.getLogger(Voter.class.getName()).log(Level.SEVERE, null, ex);
        }
        driver.findElement(By.xpath("//table[@id='results']/tbody/tr[2]/td[2]")).click();
        watchMeSleep();
        driver.findElement(By.linkText("Text")).click();
        watchMeSleep();
        List<WebElement> displayedLinks = driver.findElements(By.tagName("a"));
        WebElement regLink = findRegistrationLink(displayedLinks);
        regLink.click();
        watchMeSleep();
        //
        //regLink.click();
//      driver.get(regLink.getText());
//      watchMeSleep();
    }

    private void logmein() {
        driver.get(regURL);
        driver.findElement(By.id("username")).click();
        driver.findElement(By.id("username")).clear();
        driver.findElement(By.id("username")).sendKeys(username);
        watchMeSleep();
        driver.findElement(By.id("password")).click();
        driver.findElement(By.id("password")).clear();
        driver.findElement(By.id("password")).sendKeys(pwd);
        watchMeSleep();
        driver.findElement(By.xpath("//input[@value='Anmelden']")).click();
        watchMeSleep();
    }

    private void vote() {
        driver.get(abURL);
        watchMeSleep();
        List<WebElement> elements = driver.findElements(By.tagName("form"));
        WebElement bernza = findBernza(elements);
        bernza.submit();
        watchMeSleep();
        elements = driver.findElements(By.tagName("form"));
        WebElement other = findClickable(elements);
        other.submit();
        watchMeSleep();
    }

    public int captchaSolver(String captchaText) throws CaptchaException {
        int firstIdx = findIndexOfFirstNumber(0, captchaText);
        int secondIdx = findIndexOfFirstNumber(firstIdx + 1, captchaText);

        if (firstIdx < upperERROR && secondIdx < upperERROR) {
            int a = intergerAt(firstIdx, captchaText);
            int b = intergerAt(secondIdx, captchaText);

            return (a + b);
        }
        throw new CaptchaException(captchaText);
    }

    private int findIndexOfFirstNumber(int start, String captchaText) {
        int result = upperERROR;
        for (int i = 0; i < 10; i++) {
            int idx = captchaText.indexOf("" + i, start);
            if (idx > 0) {
                result = Math.min(idx, result);
            }
        }
        return result;
    }

    private int intergerAt(int idx, String captchaText) {
        char tmp = captchaText.charAt(idx);
        int res = Integer.parseInt("" + tmp);
        return res;
    }

    private WebElement findRegistrationLink(List<WebElement> displayedLinks) throws RegistrationException {
        for (WebElement el : displayedLinks) {
            if (el.getText().startsWith(ubURL)) {
                return el;
            }
        }
        throw new RegistrationException();
    }

    private WebElement findBernza(List<WebElement> elements) {
        for (WebElement el : elements) {
            String ort = el.getAttribute("data-mb-ort");
            if (ort.toLowerCase().equals(firstVote)) {
                return el;
            }
        }
        return null;
    }

    private WebElement findClickable(List<WebElement> elements) {
        for (WebElement el : elements) {
            String ort = el.getAttribute("data-mb-ort");
            if (ort.toLowerCase().equals(secondVote)) {
                return el;
            }
        }
        return null;
    }

    private void watchMeSleep() {
        try {
            Thread.sleep(waitTime);
        } catch (InterruptedException ex) {
            Logger.getLogger(Voter.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}

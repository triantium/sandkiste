package net.ddns.triantium.untercheat;

import java.util.ArrayList;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.Ignore;
import org.junit.Test;

/**
 *
 * @author manuel müller <manuel.mueller@geekinbusiness.de>
 */
public class VoterTest {

    public String[] captchas = {"Bitte addieren Sie 8 und 6.", "Bitte rechnen Sie 6 plus 3.", "Was ist die Summe aus 2 und 6?",
        "Bitte rechnen Sie 5 plus 5.", "Bitte addieren Sie 2 und 9.", "Bitte addieren Sie 9 und 4."
    };

    public int[] capresults = {14, 9, 8, 10, 11, 13};

    public VoterTest() {
    }

    /**
     * Test of execute method, of class Cheat.
     *
     * @throws java.lang.Exception
     * @throws net.ddns.triantium.untercheat.CaptchaException
     * @throws net.ddns.triantium.untercheat.RegistrationException
     */
    @Test
    public void testExecute() throws Exception, CaptchaException, RegistrationException {

        Voter c = new Voter();
        c.waitTime = 100L;
        try {
            c.execute();
        } finally {
            c.quit();
        }
    }

    @Test
    public void captchaTest() throws CaptchaException {

        Voter c = new Voter();
        try {
            for (int i = 0; i < captchas.length; i++) {
                int result = c.captchaSolver(captchas[i]);
                Assertions.assertThat(result).isEqualTo(capresults[i]);
            }
        } finally {
            c.quit();
        }
    }

    @Test
    @Ignore
    public void validateMe() throws RegistrationException {
        Voter c = new Voter();
        c.username = "ah88";
        c.validateme();

    }

    @Test
    public void userNameTest() {
        Voter c = new Voter();
        List<String> userList = new ArrayList();
        userList.add(c.username);
        try {
            for (int i = 0; i < 90000; i++) {

                c.prepareTest();
                String result = c.username;
                Assertions.assertThat(result).isNotIn(userList);
                userList.add(result);
            }

        } finally {
            System.out.println("userlistsize:\t" + userList.size());
            c.quit();
        }

    }

}

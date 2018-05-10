package net.ddns.triantium.untercheat;

import java.util.logging.Level;
import java.util.logging.Logger;

public class NewMain {

    public static void main(String[] args) {
        int iterations = 3;
        long waittime = 555L;
        if (args.length > 1) {
            try {
                int tmp = Integer.parseInt(args[0]);
                iterations = tmp;
            } catch (NumberFormatException ex) {

            }
        }
        if (args.length > 2) {
            try {
                int tmp = Integer.parseInt(args[1]);
                waittime = tmp;
            } catch (NumberFormatException ex) {

            }
        }

        for (int i = 0; i < iterations; i++) {
            Voter cheat = new Voter();
            cheat.waitTime = waittime;
            try {
                cheat.execute();
            } catch (CaptchaException ex) {
                Logger.getLogger(NewMain.class.getName()).log(Level.SEVERE, null, ex);
            } catch (RegistrationException ex) {
                Logger.getLogger(NewMain.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(NewMain.class.getName()).log(Level.SEVERE, null, ex);
            } finally {
                cheat.quit();
            }
        }

    }

}

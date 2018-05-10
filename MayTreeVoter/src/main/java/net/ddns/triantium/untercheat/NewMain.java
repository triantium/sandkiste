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
        System.out.println("Iterations:\t" + iterations);
        System.out.println("Waittime:\t" + waittime);

        for (int i = 0; i < iterations; i++) {
            System.out.println("starting iteration " + (i + 1));
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
            System.out.println("finished iteration " + (i + 1));
        }

    }

}

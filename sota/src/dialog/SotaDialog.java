package dialog;

import dataprocessors.network.UDPSender;
import dataprocessors.sota.SotaDialogController;
import dataproviders.DataProvider;
import dataproviders.audio.MicAudioProvider;
import dataproviders.network.UDPReceiver;
import eventsystem.EventDispatcher;

//note from Jonathan: MicAudioProvider currently outputs double data, which makes data sent over the network larger than necessary
//if better peformance is needed then short data should be sent instead

/**
 * Device-side layer of the dialog system for robot control.
 * Communicates with the DialogServer running on a separate device.
 */
public class SotaDialog {
    public static void main(String [] args) {
        EventDispatcher dispatcher = new EventDispatcher();

        // send microphone data to the server
        DataProvider mic = new MicAudioProvider(4000, 1024);
        UDPSender audioSender = new UDPSender("140.193.220.221", 7777);
        mic.addListener(audioSender);

        // handle incoming commands from the server, and sending state updates to server
        DataProvider receiver = new UDPReceiver(8888, 6000);
        SotaDialogController controller = new SotaDialogController();
        receiver.addListener(controller);

        mic.start();
        receiver.start();

        dispatcher.run();
    }
}

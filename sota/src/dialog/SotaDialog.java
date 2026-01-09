package dialog;

import dataprocessors.network.UDPSender;
import dataprocessors.sota.SotaDialogController;
import dataproviders.DataProvider;
import dataproviders.audio.MicAudioProvider;
import dataproviders.network.HttpCommandProvider;
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
    if (args.length < 2) {
      System.out.println("Please provide the robot ID and server IP as command line arguments.");
      return;
    }
    int robotId = Integer.parseInt(args[0]);
    String serverIp = args[1];
    run(robotId, serverIp);
  }

  public static void run(int robotId, String serverIp) {
    EventDispatcher dispatcher = new EventDispatcher();

    // send microphone data to the server
    DataProvider mic = new MicAudioProvider(4000, 1024);
    UDPSender audioSender = new UDPSender(serverIp, 7777);
    mic.addListener(audioSender);

    // handle incoming audio from the server
    DataProvider audioReceiver = new UDPReceiver(8888, 6000);
    //audioReceiver.addListener( /* handle receiving audio to play back */ );

    // HTTP client that polls for commands and outputs state updates to its listeners
    final HttpCommandProvider commandProvider = new HttpCommandProvider("http://" + serverIp + ":12000/api", 1000, robotId);

    SotaDialogController controller = new SotaDialogController();
    commandProvider.addListener(controller);

    // Orchestrate command polling from the main app: start the provider paused
    // and request a command whenever the controller transitions to READY.
    // start paused to ensure we only poll when requested
    commandProvider.pausePolling();
    commandProvider.initializeRobot(robotId);
    commandProvider.start();

    // when the controller is ready, tell HttpCommandProvider to request the next command
    controller.addListener(new eventsystem.EventListener() {
      @Override
      public void handle(datatypes.Data d, eventsystem.EventGenerator sender) {
        if (d instanceof SotaDialogController.SotaStateData) {
          SotaDialogController.SotaStateData sd = (SotaDialogController.SotaStateData) d;
          if (sd.data == SotaDialogController.SotaState.READY) {
            commandProvider.requestOnce();
          }
        }
      }
    });

    // trigger an initial request
    commandProvider.requestOnce();

    mic.start();
    audioReceiver.start();

    dispatcher.run();
  } 
}

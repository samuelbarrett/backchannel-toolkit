package dialog;

import dataprocessors.audio.AudioPlayback;
import dataprocessors.network.TCPSender;
import dataprocessors.network.UDPSender;
import dataprocessors.sota.SotaDialogController;
import dataproviders.DataProvider;
import dataproviders.audio.MicAudioProvider;
import dataproviders.network.HttpCommandProvider;
import dataproviders.network.TCPReceiver;
import dataproviders.network.UDPReceiver;
import eventsystem.EventDispatcher;

//note from Jonathan: MicAudioProvider currently outputs double data, which makes data sent over the network larger than necessary
//if better peformance is needed then short data should be sent instead

/**
 * Device-side layer of the dialog system for robot control.
 * Communicates with the DialogServer running on a separate device.
 */
public class SotaDialog {

  private static final int AUDIO_SEND_PORT = 50001;
  private static final int AUDIO_RECEIVE_PORT = 50002;
  private static final int UDP_RECEIVER_BUFFER_SIZE = 6000;
  private static final int SAMPLE_RATE = 16000;
  private static final int MICROPHONE_BUFFER_SIZE = 1024;
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

    String localIp = getLocalIpForRemote(serverIp, 6100);
    System.out.println("Detected local IP: " + localIp);

    // send microphone data to the server
    DataProvider mic = new MicAudioProvider(SAMPLE_RATE, MICROPHONE_BUFFER_SIZE);
    UDPSender audioSender = new UDPSender(serverIp, AUDIO_SEND_PORT);
    mic.addListener(audioSender);

    // handle incoming audio from the server
    UDPReceiver audioReceiver = new UDPReceiver(AUDIO_RECEIVE_PORT, UDP_RECEIVER_BUFFER_SIZE);
    AudioPlayback audioPlayback = new AudioPlayback();
    audioReceiver.addListener(audioPlayback);

    // HTTP client that polls for commands and outputs state updates to its listeners
    final HttpCommandProvider commandProvider = new HttpCommandProvider("http://" + serverIp + "/api", 1000, robotId, localIp, AUDIO_SEND_PORT);

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

  // quickly fetch the robot' local IP address for reaching a given remote host
  private static String getLocalIpForRemote(String remoteHost, int remotePort) {
    try {
      java.net.DatagramSocket socket = new java.net.DatagramSocket();
      socket.connect(java.net.InetAddress.getByName(remoteHost), remotePort);
      String localIp = socket.getLocalAddress().getHostAddress();
      socket.close();
      return localIp;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }
}

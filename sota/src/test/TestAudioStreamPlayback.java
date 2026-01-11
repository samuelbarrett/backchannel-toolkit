package test;

import java.io.File;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.SourceDataLine;

import org.eclipse.jetty.servlet.Source;

import dataprocessors.audio.AudioPlayback;
import dataproviders.network.UDPReceiver;
import eventsystem.EventDispatcher;

public class TestAudioStreamPlayback {

  private static final int AUDIO_PLAYBACK_PORT = 8888;
  private static final int UDP_RECEIVER_BUFFER_SIZE = 6000;
  public static void main(String[] args) {
    // simpleTest();
    EventDispatcher dispatcher = new EventDispatcher();

    UDPReceiver audioReceiver = new UDPReceiver(AUDIO_PLAYBACK_PORT, UDP_RECEIVER_BUFFER_SIZE);

    AudioPlayback audioPlayback = new AudioPlayback();
    audioPlayback.playTestTone("../resources/utterances/test_hmm.wav");
    audioReceiver.addListener(audioPlayback);

    audioReceiver.start();

    dispatcher.run();
  }

  public static void simpleTest() {
    try (AudioInputStream testStream = AudioSystem.getAudioInputStream(new File("../resources/utterances/test_hmm.wav"))) {
      AudioFormat format = testStream.getFormat();
      //System.out.println("Mixer info: " + java.util.Arrays.toString(AudioSystem.getMixerInfo()));
      Mixer.Info[] mixerInfos = AudioSystem.getMixerInfo();
      for (Mixer.Info mixerInfo : mixerInfos) {
        System.out.println("Mixer: " + mixerInfo.getName() + " - " + mixerInfo.getDescription());
        if (mixerInfo.getName().contains("hw:2,0")) {
          Mixer mixer = AudioSystem.getMixer(mixerInfo);
          DataLine.Info lineInfo = new DataLine.Info(SourceDataLine.class, format);
          System.out.println("boo yeah, this the one");
          if (mixer.isLineSupported(lineInfo)) {
            try (SourceDataLine sourceLine = (SourceDataLine) mixer.getLine(lineInfo)) {
              sourceLine.open(format);
              sourceLine.start();
      
              byte[] buffer = new byte[4096];
              int bytesRead = 0;
              while ((bytesRead = testStream.read(buffer)) != -1) {
                sourceLine.write(buffer, 0, bytesRead);
              }

              sourceLine.drain();
            } catch (Exception e) {
              e.printStackTrace();
            }
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();

    }
  }
}

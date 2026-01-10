package dataproviders.audio;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.TargetDataLine;

import java.util.Arrays;

import dataproviders.DataProvider;
import datatypes.ByteArrayData;

public class MicAudioProvider extends DataProvider {
    private int sampleRate;
    private int bufferSize;

    public MicAudioProvider(int sampleRate, int bufferSize) {
        this.sampleRate = sampleRate;
        this.bufferSize = bufferSize;
        
    } 

    @Override
    public void run() {
        try {
            AudioFormat audioFormat = new AudioFormat(this.sampleRate, 16, 1, true, false);
            DataLine.Info lineInfo = new DataLine.Info(TargetDataLine.class, audioFormat);
            TargetDataLine dataline = (TargetDataLine)AudioSystem.getLine(lineInfo);
            AudioInputStream audioStream = new AudioInputStream(dataline);

            dataline.open(audioFormat);
            dataline.start();
    
            byte[] buffer = new byte[this.bufferSize];

            int bytesRead;
            while((bytesRead = audioStream.read(buffer)) >= 0) {
                if (bytesRead == 0) {
                    continue;
                }
                byte[] chunk = Arrays.copyOf(buffer, bytesRead);
                this.notifyListeners(new ByteArrayData(chunk));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

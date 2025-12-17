package dataproviders.network;
import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

import dataproviders.DataProvider;
import datatypes.UDPMessage;

public class UDPReceiver extends DataProvider {

    private int port;
    private int bufferSize;
    private DatagramSocket socket;

    private int prevMessage = -1;

    public UDPReceiver(int port, int bufferSize) {
       this.port = port;
       this.bufferSize = bufferSize;
    } 

    @Override
    public void run() {
        try {
            this.socket = new DatagramSocket(port);
            byte[] buffer = new byte[this.bufferSize];

            while (true) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);

                ObjectInputStream inputStream = new ObjectInputStream(new ByteArrayInputStream(packet.getData()));
                UDPMessage m = (UDPMessage)inputStream.readObject();
                
                //ignore out-of-order messages
                if(m.sequenceNumber > prevMessage) {
                    prevMessage = m.sequenceNumber;
                    this.notifyListeners(m.data);
                } 
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

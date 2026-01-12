package dataproviders.network;
import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.util.Arrays;

import dataproviders.DataProvider;
import datatypes.ByteArrayData;
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
                int length = packet.getLength();
                byte[] payload = Arrays.copyOf(packet.getData(), length);
                ByteArrayData data= new ByteArrayData(payload);
                notifyListeners(data);
                System.out.println("UDP Packet received, size: " + length);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

package dataprocessors.network;

import java.io.ByteArrayOutputStream;

import java.io.ObjectOutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

import dataprocessors.DataProcessor;
import datatypes.Data;
import datatypes.UDPMessage;
import eventsystem.EventGenerator;

public class UDPSender extends DataProcessor {

    private String ip;
    private int port;

    private InetAddress address;
    private DatagramSocket socket;

    private int seq = 0;

    public UDPSender(String ip, int port) {
        this.ip = ip;
        this.port = port;
    }

    private void init() throws SocketException, UnknownHostException {
        if(this.socket == null) { 
            socket = new DatagramSocket();
            address = InetAddress.getByName(ip);
        }
    }

    @Override
    protected Data process(Data input, EventGenerator sender) {
        try {
            this.init();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
    
            oos.writeObject(new UDPMessage(seq, input));
            oos.flush();

            byte[] serialized = baos.toByteArray();

            DatagramPacket packet = new DatagramPacket(serialized, serialized.length, this.address, this.port);
            socket.send(packet);
            seq++;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}

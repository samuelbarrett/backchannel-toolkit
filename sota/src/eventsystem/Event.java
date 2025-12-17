package eventsystem;

import datatypes.Data;

public class Event {
    
    private Data data; 
    private EventListener listener;
    private EventGenerator sender;

    public Event(Data d, EventListener l, EventGenerator s) {
        this.data = d;
        this.listener = l;
        this.sender = s;
    }

    public void handle() {
        this.listener.handle(this.data, this.sender);
    }
}
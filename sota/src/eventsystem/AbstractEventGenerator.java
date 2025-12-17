package eventsystem;

import java.util.ArrayList;
import java.util.List;

import datatypes.Data;

public abstract class AbstractEventGenerator implements EventGenerator {

    private static EventDispatcher dispatcher;
    private List<EventListener> listeners = new ArrayList<EventListener>();

    public static void setDispatcher(EventDispatcher dispatcher) {
        AbstractEventGenerator.dispatcher = dispatcher;
    }

    @Override
    public void notifyListeners(Data d) {
        if(d != null) {
            for(EventListener l : this.listeners) {
                dispatcher.scheduleEvent(new Event(d, l, this));
            }
        }
    }

    @Override
    public void addListener(EventListener l) {
        this.listeners.add(l);
    }
}
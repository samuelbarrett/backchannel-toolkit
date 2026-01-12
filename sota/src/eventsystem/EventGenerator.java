package eventsystem;

import datatypes.Data;

public interface EventGenerator {
    public void addListener(EventListener l);
    public void notifyListeners(Data d);
}

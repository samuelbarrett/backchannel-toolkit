package eventsystem;

import datatypes.Data;

public interface EventListener {
    public void handle(Data d, EventGenerator sender);
}

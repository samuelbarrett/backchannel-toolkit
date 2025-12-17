package dataprocessors;

import datatypes.Data;
import eventsystem.AbstractEventGenerator;
import eventsystem.EventGenerator;
import eventsystem.EventListener;

public abstract class DataProcessor extends AbstractEventGenerator implements EventGenerator, EventListener {

    protected abstract Data process(Data input, EventGenerator sender);

    @Override
    public void handle(Data d, EventGenerator sender) {
        Data output = this.process(d, sender);   
        this.notifyListeners(output);
    }
}
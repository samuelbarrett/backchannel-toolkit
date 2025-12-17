package dataproviders;

import eventsystem.AbstractEventGenerator;
import eventsystem.EventGenerator;

public abstract class DataProvider extends AbstractEventGenerator implements EventGenerator, Runnable {
    public void start() {
        Thread t = new Thread(this);
        t.start();
    }   
}

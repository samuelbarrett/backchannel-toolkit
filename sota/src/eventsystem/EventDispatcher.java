package eventsystem;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class EventDispatcher {
   
    private BlockingQueue<Event> eventQueue = new LinkedBlockingQueue<Event>();

    private volatile boolean running;

    public EventDispatcher() {
        //Set dispatcher for all EventGenerators. This is done to avoid passing the dispatcher to every processor.
        //note that this means we can only have 1 instance of EventDisaptcher globally
        AbstractEventGenerator.setDispatcher(this);
        this.running = true;
    }

    public void scheduleEvent(Event event) {
        eventQueue.add(event);
    }

    //loops forever 
    public void run() {
        try {
            while(this.running) {
                eventQueue.take().handle();
            }
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }    
    }

    // stop the dispatcher in code
    public void stop() {
        this.running = false;
    }
}

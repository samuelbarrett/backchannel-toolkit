package test;

import dataprocessors.sota.SotaDialogController;
import dataproviders.DataProvider;
import datatypes.behaviors.BackchannelEvent;
import datatypes.behaviors.NodBackchannelEvent;
import datatypes.behaviors.UtteranceBackchannelEvent;
import eventsystem.EventDispatcher;

/**
 * Test SotaDialogController and surrounding infrastructure using a stub HTTP command provider.
 * Must be run on a VStone Sota Edison robot.
 */
public class TestSotaDialogController {
  public static void main(String [] args) {
    
    // test one event
    BackchannelEvent[] testOneEvent = new BackchannelEvent[] {
      new UtteranceBackchannelEvent("right"),
    };
    test(testOneEvent);
    
    // test with no events
    BackchannelEvent[] testNoEvent = new BackchannelEvent[] {};
    test(testNoEvent);
    
    // test with a sequence of backchannel events
    BackchannelEvent[] testMultipleEvents = new BackchannelEvent[] {
      new NodBackchannelEvent(5, 3),
      new UtteranceBackchannelEvent("uh-huh"),
      new NodBackchannelEvent(7, 4),
      new UtteranceBackchannelEvent("I see"),
    };
    test(testMultipleEvents);
  }

  public static void test(BackchannelEvent[] events) {
    EventDispatcher dispatcher = new EventDispatcher();
    StubHttpCommandProvider commandProvider = new StubHttpCommandProvider(events);
    SotaDialogController controller = new SotaDialogController();
    
    commandProvider.addListener(controller);
    commandProvider.start();

    // when the controller is ready, tell HttpCommandProvider to request the next command
    controller.addListener(new eventsystem.EventListener() {
      @Override
      public void handle(datatypes.Data d, eventsystem.EventGenerator sender) {
        if (d instanceof SotaDialogController.SotaStateData) {
          SotaDialogController.SotaStateData sd = (SotaDialogController.SotaStateData) d;
          if (sd.data == SotaDialogController.SotaState.READY) {
            commandProvider.requestOnce();
          }
        }
      }
    });

    // trigger an initial request
    commandProvider.requestOnce();

    dispatcher.run();

    // wait for all events to be processed
    while(commandProvider.isRunning()) {
      try {
        Thread.sleep(2000);
      } catch (InterruptedException ie) {
        ie.printStackTrace();
      }
    }
  }
}

/**
 * Test stub class to feed predefined backchannel events to the SotaDialogController.
 */
class StubHttpCommandProvider extends DataProvider {
  
  private BackchannelEvent[] events;
  private int index;

  public StubHttpCommandProvider(BackchannelEvent[] events) {
    this.events = events;
    this.index = 0;
  }

  @Override
  public void run() {
    // no continuous polling - only respond to requestOnce calls
  }

  public void requestOnce() {
    if (index < events.length) {
      this.notifyListeners(events[index]);
      index++;
    }
  }

  public boolean isRunning() {
    return index < events.length;
  }
}
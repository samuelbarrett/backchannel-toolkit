package dataprocessors.loggers;
import dataprocessors.DataProcessor;
import datatypes.Data;
import eventsystem.EventGenerator;

public class Logger extends DataProcessor {
    @Override
    protected Data process(Data input, EventGenerator sender) {
        System.out.println(input.toString());
        return null;
    }
}

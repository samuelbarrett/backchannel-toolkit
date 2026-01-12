package dataprocessors;

import datatypes.Data;
import datatypes.DoubleData;
import eventsystem.EventGenerator;

//Checks the derivative thresholds for Lorena's algorithm
public class SilenceDetector extends DataProcessor {

    public enum Status {STARTUP, STOPPED, TALKING, PAUSED}

    public static class SilenceStatusData extends Data {

        private static final long serialVersionUID = 1L;

        public final Status data;
        
        public SilenceStatusData(Status s) {
            this.data = s;
        }

        public String toString() {
            return data.name();
        }
    }

    private Status state = Status.STARTUP;

    private double threshold;
    private int pauseLength;
    private int startupLength;

    private int count = 0;
    private int pauseStart = 0;

    public SilenceDetector(int pauseLength, int startupLength, double threshold) {
        this.pauseLength = pauseLength;
        this.startupLength = startupLength;
        this.threshold = threshold;
    }

    @Override
    protected Data process(Data input, EventGenerator sender) {
        DoubleData doubleInput = (DoubleData)input; 
        double[] data = doubleInput.data;

        for(int i = 0; i < data.length; i++) {
            if(this.state == Status.STARTUP && this.count > this.startupLength) {
                this.state = Status.STOPPED;
            } else if((this.state == Status.STOPPED || this.state == Status.PAUSED) && data[i] > this.threshold) {
                this.state = Status.TALKING;
            } else if(this.state == Status.TALKING && data[i] < -this.threshold) {
                this.state = Status.PAUSED;
                this.pauseStart = count;
            } else if(this.state == Status.PAUSED && count - pauseStart > pauseLength) {
                this.state = Status.STOPPED;
            }
            this.count++;
        }

        return new SilenceStatusData(this.state);
    }
}

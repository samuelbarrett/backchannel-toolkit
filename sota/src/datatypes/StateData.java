package datatypes;

import dataprocessors.SilenceDetector.SilenceStatusData;
import dataprocessors.SilenceDetector.Status;
import dialog.ToolkitState;

/**
 * Defines the state Data object sent to the Sota robot.
 */
public class StateData extends Data {
    
    // default values for parameters
    private boolean verbal = false;
    private boolean nodding = false;
    private long delay = 0;
    private int frequency = 100;
    private SilenceStatusData silenceStatus = new SilenceStatusData(Status.STARTUP);

    public StateData(ToolkitState toolkitState, SilenceStatusData silenceStatus) {
        this.setSilenceStatus(silenceStatus);
        this.setToolkitState(toolkitState);
    }

    public boolean isVerbal() {
        return verbal;
    }
    public boolean isNodding() {
        return nodding;
    }
    public long getDelay() {
        return delay;
    }
    public int getFrequency() {
        return frequency;
    }
    public SilenceStatusData getSilenceStatus() {
        return silenceStatus;
    }

    public void setSilenceStatus(SilenceStatusData silenceStatus) {
        this.silenceStatus = silenceStatus;
    }
    
    public void setToolkitState(ToolkitState toolkitState) {
        this.verbal = toolkitState.isVerbal();
        this.nodding = toolkitState.isNodding();
        this.delay = toolkitState.getDelay(); 
        this.frequency = toolkitState.getFrequency();
    }
}

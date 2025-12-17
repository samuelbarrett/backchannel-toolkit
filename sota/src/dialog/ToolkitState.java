package dialog;

/**
 * Simple state that reflects the JSON object sent to us via the ToolkitAPI.
 * Used so we can convert the JSON object to a Java object.
 */
public class ToolkitState {
    private boolean verbal = false;
    private boolean nodding = false;
    private long delay = 0;
    private int frequency = 100;

    public ToolkitState() {}

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
}

package datatypes.behaviors;

/**
 * A backchannel behavior representing a nod.
 */
public class NodBackchannelEvent extends BackchannelEvent {
    private final int amplitude;
    private final int speed;

    public NodBackchannelEvent(int amplitude, int speed) {
        super(BEHAVIOR_TYPE.NOD);
        this.amplitude = amplitude;
        this.speed = speed;
    }

    public int getAmplitude() {
        return amplitude;
    }

    public int getSpeed() {
        return speed;
    }
}

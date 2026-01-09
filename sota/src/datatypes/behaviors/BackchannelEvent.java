package datatypes.behaviors;

import datatypes.Data;

/**
 * Abstract class representing a robot backchanneling behavior, e.g., nod or utterance.
 */
public abstract class BackchannelEvent extends Data {
    
    public static enum BEHAVIOR_TYPE { NOD, UTTERANCE };
    private final BEHAVIOR_TYPE type;

    public BackchannelEvent(BEHAVIOR_TYPE type) {
        this.type = type;
    }

    public BEHAVIOR_TYPE getType() {
        return type;
    }
}

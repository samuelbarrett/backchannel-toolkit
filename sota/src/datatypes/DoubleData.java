package datatypes;

import java.util.Arrays;

public class DoubleData extends Data {

    //data is intended to be immutable, but Java doesn't support immutable arrays. It's currently up to the programmer to know not to modify this.
    //if we want to enforce this, we can use an ImmutableArray class (at the cost of some overhead)
    public final double[] data;

    public DoubleData(double[] data) {
        this.data = data;
    }

    public String toString() {
        return Arrays.toString(this.data);
    }
}
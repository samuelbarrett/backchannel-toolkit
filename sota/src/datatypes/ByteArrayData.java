package datatypes;

import java.util.Arrays;

public class ByteArrayData extends Data{
  public final byte[] data;

    public ByteArrayData(byte[] data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return Arrays.toString(data);
    }
}
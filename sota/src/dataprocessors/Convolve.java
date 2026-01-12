package dataprocessors;

import datatypes.Data;
import datatypes.DoubleData;
import eventsystem.EventGenerator;

public class Convolve extends DataProcessor {

    private double[] kernel;

    private double[] buffer;
    private int buffIndex;

    public Convolve(double[] kernel) {
        this.kernel = kernel;
        this.buffer = new double[kernel.length];
    }

    @Override
    protected Data process(Data input, EventGenerator sender) {
        DoubleData doubleInput = (DoubleData)input; 
        double[] data = doubleInput.data;
        
        double[] output = new double[data.length];

        for(int i = 0; i < data.length; i++) {
            buffer[buffIndex] = data[i];
            buffIndex = (buffIndex + 1) % buffer.length;
            output[i] = convolveStep(buffIndex);
        }

        return new DoubleData(output);
    }

    private double convolveStep(int start) {
        int index = start;
        double sum = 0;
        for(int i = 0; i < kernel.length; i++) {
            sum += this.kernel[i]*this.buffer[index];
            //conditional instead of mod for performance
            index = (index == buffer.length-1) ? 0 : index+1;
        }
        return sum;
    }   
}

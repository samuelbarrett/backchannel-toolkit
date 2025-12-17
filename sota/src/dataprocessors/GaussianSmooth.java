package dataprocessors;

public class GaussianSmooth extends Convolve {

    public GaussianSmooth(double sigma, int size) {
        super(generateKernel(sigma, size));
    }

    private static double[] generateKernel(double sigma, int size) {
        double[] filter = new double[size];

        int range = (int)Math.ceil(3*sigma); //sample between [-3*sigma, 3*sigma]
        double step = (range*2)/((double)size-1); //interval for samples
       
        double sum = 0; //sum for normalization
        double pos = -range; //distance from mean

        //compute values 
        for(int i = 0; i < size; i++) {
            filter[i] = (1 / (sigma*Math.sqrt(2*Math.PI))) * Math.exp(-(pos*pos)/(2*sigma*sigma));
            sum += filter[i];
            pos+=step;
        }

        //normalize
        for(int i = 0; i < size; i++) {
            filter[i] /= sum;
        }

        return filter;
    }
    
}

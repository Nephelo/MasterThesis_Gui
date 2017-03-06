package data;

import util.IOUtil;
import util.PaddingUtil;

import java.io.IOException;

public class DataProvider {

    public static double[] getData() throws IOException {
        double[] data = IOUtil.readFromFile("C:\\Daten\\Eigene Dateien\\Studium\\Masterarbeit\\Implementierung\\Daten\\original\\REDD.txt");
        return PaddingUtil.cutToPowerOfTwo(data);
    }
}

package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import data.DataProvider;
import data.HaarData;
import data.TimeSeries;
import play.mvc.Result;
import privacyTransformation.ConflictingOperationsException;
import privacyTransformation.PrivacyTransformationHandler;
import privacyTransformation.TransformationTypes;
import wavelet.HaarWaveletTransformation;

import java.io.IOException;
import java.util.ArrayList;

import static play.libs.Json.toJson;
import static play.mvc.Controller.request;
import static play.mvc.Results.ok;

public class DataController {

    public Result index() {
        return ok(views.html.chart.render());
    }

    public Result getData() throws IOException {
        double[] data = DataProvider.getData();
        return ok(toJson(data));
    }

    public Result getTransformedData() throws IOException, ConflictingOperationsException {
        PrivacyTransformationHandler transformationHandler0 = new PrivacyTransformationHandler(true);
        PrivacyTransformationHandler transformationHandler1 = new PrivacyTransformationHandler(true);

        JsonNode json = request().body().asJson();
        JsonNode set0 = json.get("0");
        JsonNode set1 = json.get("1");

        insertTransformationsFromJSON(transformationHandler0, set0);
        insertTransformationsFromJSON(transformationHandler1, set1);

        double[] data = DataProvider.getData();
        HaarData haarData = HaarWaveletTransformation.forward(new TimeSeries(data));

        HaarData newData0 = transformationHandler0.transform(haarData);
        HaarData newData1 = transformationHandler1.transform(haarData);

        TimeSeries transformedData0 = HaarWaveletTransformation.backward(newData0);
        TimeSeries transformedData1 = HaarWaveletTransformation.backward(newData1);
        return ok(getResponse(transformedData0, transformedData1));
    }

    private JsonNode getResponse(TimeSeries transformedData0, TimeSeries transformedData1) {
        ArrayList<double[]> result = new ArrayList<>();
        result.add(transformedData0.getValues());
        result.add(transformedData1.getValues());
        return toJson(result);
    }
    private void insertTransformationsFromJSON(PrivacyTransformationHandler transformationHandler, JsonNode jsonSet) throws ConflictingOperationsException {
        for(JsonNode jsonElement : jsonSet) {
            TransformationTypes transformationType = getTransformation(jsonElement.get("name").asText());
            int configurationValue = jsonElement.get("value").asInt();
            transformationHandler.addTransformation(transformationType, configurationValue);
        }
    }

    private TransformationTypes getTransformation(String transformationName) {
        switch (transformationName) {
            case "addNoise":
                return TransformationTypes.AddNoise;
            case "denoise":
                return TransformationTypes.Denoising;
            case "removeLevel":
                return TransformationTypes.RemoveLevel;
            case "swap":
                return TransformationTypes.Swapping;
            case "cutJumps":
                return TransformationTypes.CutJumps;
            default:
                System.err.println("Got unknown transformation: " + transformationName);
        }

        return null;
    }

}

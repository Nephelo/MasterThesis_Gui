/**
 * Created by Philipp on 12.01.2017.
 */

$(document).ready(function() {
    $("#sortable0").sortable({
        stop: function( event, ui ) {
            var sortedIDs = $("#sortable0").sortable("toArray");
            sortedIDs = sortedIDs.map(function(element) {
                return parseInt(element.replace("transformID", ""));
            });
            transformationHandler.sort(sortedIDs, 0);
        }
    });
    $("#sortable1").sortable({
        stop: function( event, ui ) {
            var sortedIDs = $("#sortable1").sortable("toArray");
            sortedIDs = sortedIDs.map(function(element) {
                return parseInt(element.replace("transformID", ""));
            });
            transformationHandler.sort(sortedIDs, 1);
        }
    });
    $("#sortable0").disableSelection();
    $("#sortable1").disableSelection();
    $("#slider").slider();
});

var transformationHandler = new TransformationHandler();

function addTransformation(transformationType, value, transformationSet) {
    transformationHandler.addTransformation({
        name: transformationType,
        value: value,
        transformationSet : transformationSet
    });
}

function removeTransformation(id) {
    transformationHandler.removeTransformation(parseInt(id));
}

function sliderChanged(id, value) {
    transformationHandler.setValue(parseInt(id), parseInt(value));
}


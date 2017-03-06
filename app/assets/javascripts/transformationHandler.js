/**
 * Created by Philipp on 12.01.2017.
 */
function TransformationHandler() {
    var that = this;
    this.transformations = [];
    this.lastID = 0;

    this.addTransformation = function(transformation) {
      transformation.id = this.lastID++;
      this.transformations.push(transformation);
      transformationChanged();
    };

    this.removeTransformation = function(id) {
        var index = 0;
        this.transformations.forEach(function (transformation) {
            if(transformation.id === id) {
                that.transformations.splice(index, 1);
            }
            index++;
        });
        transformationChanged();
    };

    this.setValue = function (id, value) {
        this.transformations.forEach(function (transformation) {
            if(transformation.id === id) {
                transformation.value = value;
            }
        });
        transformationChanged();
    };

    this.sort = function (newOrder, transformationSet) {
        var newTransformations = [];
        newOrder.forEach(function(sortedElementId) {
            var trans = getTransformationById(that.transformations, sortedElementId).item;
            newTransformations.push(trans);
        });
        this.transformations.forEach(function (trans) {
           if(trans.transformationSet !== transformationSet) {
               newTransformations.push(trans);
           }
        });
        this.transformations = newTransformations;
        updateChart();
    };

    function getTransformationById(transformations, id) {
        for(var i = 0; i < transformations.length; i++) {
            if(transformations[i].id === id) {
                return {
                    index: i,
                    item: transformations[i]
                };
            }
        }

        return {};
    }


    function transformationChanged() {
      $("#sortable0").empty();
      $("#sortable1").empty();
      that.transformations.forEach(function(transformation) {
          var transformationSet = transformation.transformationSet;
          $("#sortable" + transformationSet)
              .append('<li class="ui-state-default" id="transformID' + transformation.id + '">' +
                  '<a onclick="removeTransformation(\'' + transformation.id + ', ' + transformation.transformationSet + '\')"><span class="glyphicon glyphicon-remove-circle .btn-warning"></span></a> ' +
                  transformation.name +
                  '<input type="range" value="' + transformation.value + '" id="silder' + transformation.id + '" onchange="sliderChanged(' + transformation.id + ', this.value, ' + transformation.transformationSet + ' )">' +
                  '<input value="' + transformation.value + '" id="input' + transformation.id + '" onchange="sliderChanged(' + transformation.id + ', this.value, ' + transformation.transformationSet + ' )">' +
                  '</li>');
      });
      updateChart();
    }
}
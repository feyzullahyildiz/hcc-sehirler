import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { serverUrl, cities, } from './config';
import { Vector as VectorLayer, Tile } from 'ol/layer'
import { OSM, Vector as VectorSource, TileWMS } from 'ol/source.js';
import GeoJSON from 'ol/format/GeoJSON';

import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('map') mapContainer: ElementRef
  title = 'hcc-cities';
  map: Map
  ngOnInit(): void {
    const map = new Map({
      target: this.mapContainer.nativeElement,
      view: new View({
        zoom: 6,
        center: [3973397.3774627103, 4705095.900525456]
      }),
      layers: [
        new TileLayer({source: new OSM()})
      ]
    })
    this.map = map
    this.addClusterDatas()
  }


  async addClusterDatas(){
    const centroids =  await fetch(serverUrl).then(x => x.json()).then(data => {
      Object.entries(data).map(([no, val], index) => {
        cities.features[index].properties['count'] = val
      })
      return cities
    })
    // geojson.readFeatures(centroids)
    const geojson = new GeoJSON()
    const vectorSource = new VectorSource({
      features: geojson.readFeatures(centroids)
    });
    const styleCache = {}
    const layer = new VectorLayer({
      source: vectorSource,
      style: function(feature) {
        var size = feature.get('count');
        var style = styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff'
              }),
              fill: new Fill({
                color: '#3399CC'
              })
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff'
              })
            })
          });
          styleCache[size] = style;
        }
        return style;
      }
    })
    const citiesWms = new Tile({
      source: new TileWMS({
        url: 'http://194.182.80.44:8080/geoserver/wms',
        params: {'LAYERS': 'test:cities', 'TILED': true},
        ratio: 1,
        serverType: 'geoserver'
      })
    })
    this.map.addLayer(citiesWms)
    this.map.addLayer(layer)
  }

}

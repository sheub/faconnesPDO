import turfBbox from "@turf/bbox";
import turfBboxPolygon from "@turf/bbox-polygon";
import turfBuffer from "@turf/buffer";
import turfDistance from "@turf/distance";


function moveTo(map, location, zoom) {
    if (!location) return;
    if (location.bbox) { // We have a bbox to fit to
      const distance = turfDistance([location.bbox[0], location.bbox[1]], [location.bbox[2], location.bbox[3]]);
      const buffered = turfBuffer(turfBboxPolygon(location.bbox), distance / 2, 'kilometers');
      const bbox = turfBbox(buffered);
      try {
        map.fitBounds(bbox, { linear: true });
      } catch (e) {
        map.fitBounds(location.bbox, { linear: true });
      }
    } else { // We just have a point
      map.easeTo({
        center: location.geometry.coordinates,
        zoom: zoom || 16
      });
    }
  }

  export { moveTo };
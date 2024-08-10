/*
@title: muchroomForMushrooms
@author: Xinyang Wang
@snapshot: image1.png
*/

// canvas size
const WIDTH = 125;
const HEIGHT = 125;

setDocDimensions(WIDTH, HEIGHT);

const finalLines = [];
const rr = bt.randInRange;
const rir = bt.randIntInRange;

// change for more/less spots on mushroom
const MUSHROOM_SPOTS = rr(12, 16);
const GILL_DENSITY = rr(4, 7);
// gives a little smoosh effect for fake 3D look
const SPOT_STRETCH = 0.008;
// makes the gills curvy
const GILL_CURVE = 0.5;
// how lumpy the spots should be
// warning, high numbers make ti look freaky
const VAR = 2;
// affects lumpiness of mushroom cap and stem
const DIFF = 2;
// # of lines on the stem
const STEM_LINES = 3;

function draw_spot(sides, sideLen = 1, mushCapPatterns) {
  let pen = new bt.Turtle();
  let totalAng = (sides - 2) * 180;
  let angle = totalAng / sides;
  for (let i = 0; i < sides; ++i) {
    pen.forward(sideLen).right(180 - angle);
  }
  let curvedShape = pen.lines();

  let newSpot = [rr(14, 100), rr(60, 100)];
  bt.translate(curvedShape, newSpot, bt.bounds(curvedShape).cc);
  bt.resample(curvedShape, 4);
  // randomnes not actually working?
  // incrementing it all by an equal amount
  bt.iteratePoints(curvedShape, ([x, y]) => [x + SPOT_STRETCH * x ** 2, y]);
  bt.iteratePoints(curvedShape, ([x, y]) => [x + rr(-VAR, VAR), y + rr(-VAR, VAR)]);

  // cant find a function to merge all the spots
  //drawLines(curvedShape);
  //bt.cover(mushCapPatterns, curvedShape);
  //bt.cover(mushCapPatterns, curvedShape);
  //bt.cover(curvedShape, mushCapPatterns);
  //bt.merge(mushCapPatterns);
  //return curvedShape;
  return [bt.catmullRom(...curvedShape)];
  //return pen.lines();
}

function centerPolylines(polylines, documentWidth, documentHeight) {
  const cc = bt.bounds(polylines).cc;
  bt.translate(polylines, [documentWidth / 2, documentHeight / 2], cc);
}

let groundLeft = [56 + rr(-DIFF,DIFF), 12 + rr(-DIFF, DIFF)];
let groundRight = [78 + rr(-DIFF, DIFF), 13 + rr(-DIFF, DIFF)];
let capLeft = [56 + rr(-DIFF, DIFF), 47 + rr(-DIFF, DIFF)];
let capRight = [75 + rr(-DIFF, DIFF), 45 + rr(-DIFF, DIFF)];

let mushStem = [bt.catmullRom([
  groundLeft,
  [57 + rr(-DIFF, DIFF), 19 + rr(-DIFF, DIFF)],
  [58 + rr(-DIFF, DIFF), 39 + rr(-DIFF, DIFF)],
  capLeft,
  [54 + rr(-DIFF, DIFF), 54 + rr(-DIFF, DIFF)],
  [76 + rr(-DIFF, DIFF), 52 + rr(-DIFF, DIFF)],
  [80 + rr(-DIFF, DIFF), 49 + rr(-DIFF, DIFF)],
  capRight,
  [75 + rr(-DIFF, DIFF), 21 + rr(-DIFF, DIFF)],
  groundRight,
  groundLeft
])];

let capFarLeft = [19 + rr(-DIFF, DIFF), 56 + rr(-DIFF, DIFF)];
let capFarRight = [116 + rr(-DIFF, DIFF), 48 + rr(-DIFF, DIFF)];

let mushCap = [bt.catmullRom([
  capLeft,
  capFarLeft,
  [25 + rr(-DIFF, DIFF), 82 + rr(-DIFF, DIFF)],
  [43 + rr(-DIFF, DIFF), 96 + rr(-DIFF, DIFF)],
  [72 + rr(-DIFF, DIFF), 101 + rr(-DIFF, DIFF)],
  [107 + rr(-DIFF, DIFF), 83 + rr(-DIFF, DIFF)],
  capFarRight,
  capRight,
  capLeft,
])];


let mushGillRing = [bt.catmullRom([
  capFarLeft,
  [57 + rr(-DIFF, DIFF), 61 + rr(-DIFF, DIFF)],
  [92 + rr(-DIFF, DIFF), 57 + rr(-DIFF, DIFF)],
  capFarRight,
  [105 + rr(-DIFF, DIFF), 39 + rr(-DIFF, DIFF)],
  [65 + rr(-DIFF, DIFF), 38 + rr(-DIFF, DIFF)],
  [20 + rr(-DIFF, DIFF), 46 + rr(-DIFF, DIFF)],
  capFarLeft,
])];

// change to 2 on final render
// too resource intensive rn
bt.resample(mushGillRing, GILL_DENSITY);

let gillRing = [];
let gillCenter = [64 + rr(-DIFF, DIFF), 50 + rr(-DIFF, DIFF)];
for (let i = 0; i < mushGillRing[0].length; ++i) {
  let [x, y] = mushGillRing[0][i];
  gillRing.push(bt.catmullRom([
    gillCenter,
    [(x + gillCenter[0]) / 2 + rr(-GILL_CURVE, GILL_CURVE), (y + gillCenter[1]) / 2 + rr(-GILL_CURVE, GILL_CURVE)],
    [x, y],
  ]));
}


let mushCapPatterns = [];
for (let i = 0; i < MUSHROOM_SPOTS; ++i) {
  let spot = draw_spot(rir(4, 8), rr(5, 10), mushCapPatterns);
  // I FOUND IT IT WAS UNION
  mushCapPatterns = bt.union(spot, mushCapPatterns);
  //bt.catmullRom(spot);
  //bt.translate(spot, newSpot, bt.bounds(spot).cc);
  //let spot = [bt.catmullRom(draw_poly(3, 100))];
  //drawLines(spot);
}

let mushStemLines = [];
for (let i = 0; i < STEM_LINES; ++i) {
  let x = gillCenter[0] - rr(0, 4);
  mushStemLines.push(bt.catmullRom([
    [x, gillCenter[1] - rr(0, 4)],
    [x + rr(-2,2), gillCenter[1] - rr(10, 14)],
    [x, gillCenter[1] - rr(20, 30)],
  ]));
}
// use if you want, kinda ugly
//finalLines.push(...mushStemLines);

let shadow = [bt.catmullRom([
  [60, 31],
  [40, 16],
  [83, 15],
  [95, 33],
  [71, 35],
  [60, 31],
])];
bt.cover(shadow, mushStem);
//drawLines(shadow);

bt.cut(mushCapPatterns, mushCap);
bt.cover(mushCapPatterns, mushGillRing);
finalLines.push(...mushCapPatterns);

bt.cover(mushCap, mushStem);
bt.cut(mushGillRing, mushCap);
bt.cut(gillRing, mushCap);
//bt.cut(gillRing, mushGillRing);
bt.cover(gillRing, mushStem);
finalLines.push(...mushStem, ...mushCap, ...mushGillRing, ...gillRing);
centerPolylines(finalLines, WIDTH, HEIGHT);
//bt.rotate(finalLines, 45);

drawLines(finalLines);

import { IPoI } from "../services/poi.service";
import { Queue } from "./queue";

export function calculateDistance(fromLocation: string | null, toLocation: string | null, pois: IPoI[]): number | null {
  if (fromLocation === null || toLocation === null || pois.length === 0) {
    return null;
  }
  if (fromLocation === toLocation) {
    return 0;
  }
  const poiMap = pois.reduce((map, curr) => {
    map[curr.id] = curr;
    return map;
  }, {} as { [key: string]: IPoI })

  const poiDistances: { [poiId: string]: number } = { [fromLocation]: 0 };
  const poisToProcess: Queue<IPoI> = new Queue<IPoI>([poiMap[fromLocation]]);

  // We don't exit early, even if we find our toLocation, because we want the shortest route.
  while (poisToProcess.length > 0) {
    let currPoI = poisToProcess.dequeue();
    for (const edge of currPoI.edges || []) {
      const totalDistanceToEdgePoI = poiDistances[currPoI.id] + edge.distance;

      if (poiDistances[edge.poIID]) {
        // If the target poi has been visited, update the distance if we've found a shorter route.
        poiDistances[edge.poIID] = Math.min(poiDistances[edge.poIID], totalDistanceToEdgePoI);
      } else {
        // Otherwise add it to the visited and to the poisToProcess.
        poiDistances[edge.poIID] = totalDistanceToEdgePoI;
        poisToProcess.enqueue(poiMap[edge.poIID]);
      }
    }
  }

  return poiDistances[toLocation];
}
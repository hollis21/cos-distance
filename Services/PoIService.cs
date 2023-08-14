using System.Globalization;
using cos_distance.Interfaces.Services;
using cos_distance.Models;
using CsvHelper;
using Microsoft.Extensions.FileProviders;

namespace cos_distance.Services;

public class PoIService : IPoIService
{
    private readonly ILogger<PoIService> logger;

    public PoIService(ILogger<PoIService> logger)
    {
        this.logger = logger;
    }

    public Task<IEnumerable<PoI>> GetPoIs()
    {
        List<PoI>? pois = null;
        
        var embeddedProvider = new EmbeddedFileProvider(typeof(PoIService).Assembly,"");
        using (var stream = embeddedProvider.GetFileInfo("cos_distance.Data.poidata.csv").CreateReadStream())
        using (var reader = new StreamReader(stream))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture)) {
            pois = csv.GetRecords<PoI>().ToList();
        }

        Dictionary<string, List<PoIEdge>> poiMap = pois.ToDictionary(poi => poi.ID, poi => new List<PoIEdge>());

        using (var stream = embeddedProvider.GetFileInfo("cos_distance.Data.poiedgedata.csv").CreateReadStream())
        using (var reader = new StreamReader(stream))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture)) {
            var anonTypeDef = new {
                PoI1 = string.Empty,
                PoI2 = string.Empty,
                Distance = default(int),
                BiDirectional = default(bool)
            };
            var edges = csv.GetRecords(anonTypeDef);
            foreach (var edge in edges)
            {
                if (!poiMap.ContainsKey(edge.PoI1) || !poiMap.ContainsKey(edge.PoI2)) {
                    logger.LogWarning($"Edge references 1 or more unknown PoIs: {edge.PoI1} {edge.PoI2}");
                    continue;
                }

                poiMap[edge.PoI1].Add(new PoIEdge(edge.PoI2, edge.Distance));
                if (edge.BiDirectional) {
                    poiMap[edge.PoI2].Add(new PoIEdge(edge.PoI1, edge.Distance));
                }
            }
        }

        foreach(var poi in pois) {
            poi.Edges = poiMap[poi.ID];
        }

        return Task.FromResult(pois.AsEnumerable()) ?? throw new Exception("Failed to load PoIs");
        // return Task.FromResult(new[] {
        //     new PoI() {
        //         Name = "Gates of Barovia",
        //         ID = "GatesOfBarovia",
        //         Edges = new [] {
        //             new PoIEdge("VillageOfBarovia", 14)
        //         }
        //     },
        //     new PoI() {
        //         Name = "Village of Barovia",
        //         ID = "VillageOfBarovia",
        //         Edges = new [] {
        //             new PoIEdge("GatesOfBarovia", 14),
        //             new PoIEdge("IvlisCrossroads", 13)
        //         }
        //     },
        //     new PoI() {
        //         Name = "Ivlis Crossroads",
        //         ID = "IvlisCrossroads",
        //         Edges = new [] {
        //             new PoIEdge("VillageOfBarovia", 13)
        //         }
        //     }
        // }.AsEnumerable());
    }
}

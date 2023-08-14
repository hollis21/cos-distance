using cos_distance.Models;
using Microsoft.AspNetCore.Mvc;

namespace cos_distance.Controllers;

[ApiController]
[Route("[controller]")]
public class PoIController : ControllerBase
{
    private readonly ILogger<PoIController> logger;

    public PoIController(ILogger<PoIController> logger)
    {
        this.logger = logger;
    }

    public IEnumerable<PoI> Get() {
        return new [] {
            new PoI() {
                Name = "Gates of Barovia",
                ID = "GatesOfBarovia",
                Edges = new [] {
                    new PoIEdge("VillageOfBarovia", 14)
                }
            },
            new PoI() {
                Name = "Village of Barovia",
                ID = "VillageOfBarovia",
                Edges = new [] {
                    new PoIEdge("GatesOfBarovia", 14),
                    new PoIEdge("IvlisCrossroads", 13)
                }
            },
            new PoI() {
                Name = "Ivlis Crossroads",
                ID = "IvlisCrossroads",
                Edges = new [] {
                    new PoIEdge("VilalgeOfBarovia", 13)
                }
            }
        };
    }
}

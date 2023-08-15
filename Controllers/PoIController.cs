using cos_distance.Interfaces.Services;
using cos_distance.Models;
using Microsoft.AspNetCore.Mvc;

namespace cos_distance.Controllers;

[ApiController]
[Route("[controller]")]
public class PoIController : ControllerBase
{
    private readonly ILogger<PoIController> logger;
    private readonly IPoIService poIService;

    public PoIController(ILogger<PoIController> logger, IPoIService poIService)
    {
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        this.poIService = poIService ?? throw new ArgumentNullException(nameof(poIService));
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PoI>>> Get() {
        return Ok(await this.poIService.GetPoIs());
    }
}

using cos_distance.Models;

namespace cos_distance.Interfaces.Services;

public interface IPoIService
{
    Task<IEnumerable<PoI>> GetPoIs();
}
namespace cos_distance.Models;

public class PoI
{
    public string? ID { get; set; }
    public string? Name { get; set; }
    public IEnumerable<PoIEdge>? Edges { get; set; }
}

public record PoIEdge(string PoIID, int Distance);

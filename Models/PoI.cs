namespace cos_distance.Models;

public class PoI
{
    public PoI(string ID, string Name)
    {
        this.ID = ID;
        this.Name = Name;
    }
    public string ID { get; set; }
    public string Name { get; set; }
    public IEnumerable<PoIEdge>? Edges { get; set; }
}

public class PoIEdge
{
    public PoIEdge(string PoIID, int Distance)
    {
        this.PoIID = PoIID;
        this.Distance = Distance;
    }

    public string PoIID { get; }
    public int Distance { get; }
};

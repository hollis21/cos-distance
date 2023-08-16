export class PoIService {
    baseUrl: string = "/";
    async getPoIs(): Promise<{ id: string, name: string }[]> {
        if (process.env.REACT_APP_MOCK_DATA === "true") {
            return [
                { id: "GatesOfBarovia1", name: "Gates of Barovia" },
                { id: "VillageOfBarovia", name: "Village of Barovia" },
                { id: "IvlisCrossroads", name: "Ivlis Crossroads" }
            ];
        }
        let response = await fetch("/api/poi");
        if (response.status === 404) {
            return [];
        }
        if (response.status !== 200) {
            throw new Error("Error retrieving PoIs");
        }
        return await response.json();
    }
}
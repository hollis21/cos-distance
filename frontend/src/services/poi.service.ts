export class PoIService {
    baseUrl: string = "/";
    async getPoIs(): Promise<any[]> {
        let response = await fetch("/api/poi");
        if (response.status === 404) {
            return [];
        }
        if (response.status !== 200) {
            throw new Error("Error retrieving PoIs");
        }
        return [];
    }
}
import {getLocationMatches,getLocationBoundaryBoxes} from "../Controllers/GeocodingController";
describe("Check if map functionalities are correct", () =>{
    let originalFetch;
    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(
                [
                    {
                        "place_id": 283232241,
                        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
                        "osm_type": "relation",
                        "osm_id": 9213528,
                        "boundingbox": [
                            "36.8952879",
                            "36.9047435",
                            "30.7060066",
                            "30.7162738"
                        ],
                        "lat": "36.9012758",
                        "lon": "30.7118286",
                        "display_name": "Etiler Mahallesi, Muratpaşa, Antalya, Akdeniz Bölgesi, Türkiye",
                        "class": "boundary",
                        "type": "administrative",
                        "importance": 0.44999999999999996,
                        "icon": "https://nominatim.openstreetmap.org/ui/mapicons//poi_boundary_administrative.p.20.png"
                    },
                    {
                        "place_id": 47472957,
                        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
                        "osm_type": "node",
                        "osm_id": 3937514082,
                        "boundingbox": [
                            "41.0774567",
                            "41.0874567",
                            "29.0325989",
                            "29.0425989"
                        ],
                        "lat": "41.0824567",
                        "lon": "29.0375989",
                        "display_name": "Etiler, Nispetiye Caddesi, Etiler Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, 34337, Türkiye",
                        "class": "railway",
                        "type": "station",
                        "importance": 0.3950481715152184,
                        "icon": "https://nominatim.openstreetmap.org/ui/mapicons//transport_train_station2.p.20.png"
                    },
                    {
                        "place_id": 635100,
                        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
                        "osm_type": "node",
                        "osm_id": 251270406,
                        "boundingbox": [
                            "41.0915484",
                            "41.0916484",
                            "29.0336475",
                            "29.0337475"
                        ],
                        "lat": "41.0915984",
                        "lon": "29.0336975",
                        "display_name": "Etiler, 2. Çevre Yolu, Etiler Mahallesi, Rumelihisarı Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, Türkiye",
                        "class": "highway",
                        "type": "motorway_junction",
                        "importance": 0.11100000000000002
                    },
                    {
                        "place_id": 74569700,
                        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
                        "osm_type": "node",
                        "osm_id": 6966349319,
                        "boundingbox": [
                            "41.0822798",
                            "41.0823798",
                            "29.0377931",
                            "29.0378931"
                        ],
                        "lat": "41.0823298",
                        "lon": "29.0378431",
                        "display_name": "Etiler, Bebek Dağı Sokağı, Etiler Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, 34337, Türkiye",
                        "class": "railway",
                        "type": "subway_entrance",
                        "importance": 0.11100000000000002
                    },
                    {
                        "place_id": 4126140,
                        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
                        "osm_type": "node",
                        "osm_id": 538394050,
                        "boundingbox": [
                            "41.0801947",
                            "41.0802947",
                            "29.0336394",
                            "29.0337394"
                        ],
                        "lat": "41.0802447",
                        "lon": "29.0336894",
                        "display_name": "Etiler, Nispetiye Caddesi, Etiler Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, 34337, Türkiye",
                        "class": "highway",
                        "type": "bus_stop",
                        "importance": 0.11100000000000002,
                        "icon": "https://nominatim.openstreetmap.org/ui/mapicons//transport_bus_stop2.p.20.png"
                    }
                ]

            )}));})
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if response format is correct",async () => {
        const response = await getLocationMatches("Etiler")
        expect(response).toEqual( [
                {
                    lat: '36.9012758',
                    lng: '30.7118286',
                    name: 'Etiler Mahallesi, Muratpaşa, Antalya, Akdeniz Bölgesi, Türkiye'
                },
                {
                    lat: '41.0824567',
                    lng: '29.0375989',
                    name: 'Etiler, Nispetiye Caddesi, Etiler Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, 34337, Türkiye'
                },
                {
                    lat: '41.0915984',
                    lng: '29.0336975',
                    name: 'Etiler, 2. Çevre Yolu, Etiler Mahallesi, Rumelihisarı Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, Türkiye'
                },
                {
                    lat: '41.0823298',
                    lng: '29.0378431',
                    name: 'Etiler, Bebek Dağı Sokağı, Etiler Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, 34337, Türkiye'
                },
                {
                    lat: '41.0802447',
                    lng: '29.0336894',
                    name: 'Etiler, Nispetiye Caddesi, Etiler Mahallesi, Beşiktaş, İstanbul, Marmara Bölgesi, 34337, Türkiye'
                }
            ]
        )
    })
})
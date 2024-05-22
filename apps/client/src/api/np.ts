export async function getAreas() {
  const data = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: "f0a192955bdefd1dd4c2942624d127b5",
      modelName: "Address",
      calledMethod: "getAreas",
    }),
  }).then((d) => d.json());
  const areas = data.data as {
    Ref: string;
    Description: string;
  }[];

  return areas;
}

export async function getCities(areaRef: string) {
  const data = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: "f0a192955bdefd1dd4c2942624d127b5",
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        AreaRef: areaRef,
      },
    }),
  }).then((d) => d.json());

  const cities = data.data as {
    Ref: string;
    Description: string;
  }[];

  return cities;
}

export async function getWarehouses(cityRef: string) {
  const data = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: "f0a192955bdefd1dd4c2942624d127b5",
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef,
      },
    }),
  }).then((d) => d.json());

  const cities = data.data as {
    Ref: string;
    Description: string;
  }[];

  return cities;
}

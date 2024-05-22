import { getCities, getWarehouses } from "../api/np";
import { ComboboxDemo } from "./ui/combobox";
import { useEffect, useState } from "react";

type Model = { Ref: string; Description: string };
type Props = {
  areas: Model[];
  onWarehouseChange?: (warehouse: Model | undefined) => void;
  onCityChange?: (city: Model | undefined) => void;
  onAreaChange?: (area: Model | undefined) => void;
};
export function NpSelect({
  areas,
  onWarehouseChange,
  onCityChange,
  onAreaChange,
}: Props) {
  const [selectedArea, setSelectedArea] = useState<Model | undefined>(
    undefined,
  );
  const [selectedCity, setSelectedCity] = useState<Model | undefined>(
    undefined,
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState<Model | undefined>(
    undefined,
  );
  const [cities, setCities] = useState<Array<Model>>([]);
  const [warehouses, setWarehouses] = useState<Array<Model>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (selectedArea) {
      getCities(selectedArea.Ref).then((d) => {
        setCities(d);
        setIsLoading(false);
      });
    }
  }, [selectedArea]);

  useEffect(() => {
    setIsLoading(true);
    if (selectedCity && selectedArea) {
      getWarehouses(selectedCity.Ref).then((d) => {
        setWarehouses(d);
        setIsLoading(false);
      });
    } else {
      setWarehouses([]);
    }
  }, [selectedCity, selectedArea]);

  return (
    <div>
      <p>Select area:</p>
      <ComboboxDemo
        data={areas.map(({ Ref, Description }) => ({
          value: Ref,
          label: Description,
        }))}
        onChange={(value) => {
          const area = areas.find((a) => a.Ref === value);
          setSelectedArea(area);
          onAreaChange?.(area);
        }}
      />
      <p>Select city:</p>
      <ComboboxDemo
        data={cities.map(({ Ref, Description }) => ({
          value: Ref,
          label: Description,
        }))}
        onChange={(value) => {
          const city = cities.find((a) => a.Ref === value);
          setSelectedCity(city);
          onCityChange?.(city);
        }}
      />
      <p>Select warehouse:</p>
      <ComboboxDemo
        data={warehouses.map(({ Ref, Description }) => ({
          value: Ref,
          label: Description,
        }))}
        onChange={(value) => {
          const warehouse = warehouses.find((a) => a.Ref === value);
          setSelectedWarehouse(warehouse);
          onWarehouseChange?.(warehouse);
        }}
      />
      <p>Selected area: {selectedArea?.Description}</p>
      <p>Selected city: {selectedCity?.Description}</p>
      <p>Selected warehouse: {selectedWarehouse?.Description}</p>
    </div>
  );
}

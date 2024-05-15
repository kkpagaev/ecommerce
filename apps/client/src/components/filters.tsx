import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "@tanstack/react-router";

type FiltersProps = {
  path: string;
  attributes: Record<
    string,
    Array<{
      id: number;
      name: string;
    }>
  >;
  vendors: { id: number; name: string }[];
  options: Record<
    string | number,
    Array<{
      id: number;
      name: string;
    }>
  >;
  selected: {
    attributes: number[];
    options: number[];
    vendors: number[];
  };
};

export function Filters({
  attributes,
  vendors,
  options,
  selected,
  path,
}: FiltersProps) {
  const navigate = useNavigate({ from: path });

  return (
    <div>
      <div>
        <h3 className="font-bold">Vendors</h3>
        {vendors.map((v, i) => {
          const isSelected = selected.vendors.includes(v.id);
          const onClick = () => {
            navigate({
              search: (prev: {
                attributes?: number[];
                vendors?: number[];
                options?: number[];
              }) => ({
                ...prev,
                vendors: isSelected
                  ? prev.vendors?.filter((id) => id !== v.id)
                  : [...(prev.vendors || []), v.id],
              }),
            });
          };

          return (
            <div
              key={i}
              style={{
                paddingLeft: "1em",
              }}
              onClick={onClick}
            >
              {v.name}
              <Checkbox checked={isSelected} className="ml-2" />
            </div>
          );
        })}
      </div>
      {Object.entries(attributes).map(([key, attributes]) => {
        return (
          <div key={key}>
            <h3 className="font-bold">{key}</h3>
            {attributes.map((a, i) => {
              const isSelected = selected.attributes.includes(a.id);
              const onClick = () => {
                navigate({
                  search: (prev: {
                    attributes?: number[];
                    options?: number[];
                  }) => ({
                    ...prev,
                    attributes: isSelected
                      ? prev.attributes?.filter((id) => id !== a.id)
                      : [...(prev.attributes || []), a.id],
                  }),
                });
              };

              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: "1em",
                  }}
                  onClick={onClick}
                >
                  {a.name}
                  <Checkbox checked={isSelected} className="ml-2" />
                </div>
              );
            })}
          </div>
        );
      })}
      {Object.entries(options).map(([group, options], i) => {
        return (
          <div key={i}>
            <h2 className="font-bold">{group}</h2>
            {options.map((o) => {
              const isSelected = selected.options.includes(o.id);

              return (
                <div
                  key={o.id}
                  style={{
                    paddingLeft: "1em",
                  }}
                  onClick={() => {
                    navigate({
                      search: (prev: {
                        attributes?: number[];
                        options?: number[];
                      }) => ({
                        ...prev,
                        options: isSelected
                          ? prev.options?.filter((id) => id !== o.id)
                          : [...(prev.options || []), o.id],
                      }),
                    });
                  }}
                >
                  {o.name}
                  <Checkbox checked={isSelected} className="ml-2" />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

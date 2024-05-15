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
  };
};

export function Filters({ attributes, options, selected, path }: FiltersProps) {
  const navigate = useNavigate({ from: path });

  return (
    <div>
      {Object.entries(attributes).map(([key, attributes]) => {
        return (
          <div key={key}>
            <h2>{key}</h2>
            {attributes.map((a, i) => {
              const isSelected = selected.attributes.includes(a.id);

              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: "1em",
                    backgroundColor: isSelected ? "red" : "",
                  }}
                  onClick={() => {
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
                  }}
                >
                  {a.name}
                </div>
              );
            })}
          </div>
        );
      })}
      {Object.entries(options).map(([group, options], i) => {
        return (
          <div key={i}>
            <h2>{group}</h2>
            {options.map((o) => {
              const isSelected = selected.options.includes(o.id);

              return (
                <div
                  key={o.id}
                  style={{
                    paddingLeft: "1em",
                    backgroundColor: isSelected ? "red" : "",
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
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

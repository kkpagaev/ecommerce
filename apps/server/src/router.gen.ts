import { resolve } from "path";
import * as prettier from "prettier";
import * as fs from "fs";
import * as readline from "readline";

const routesFile = resolve(import.meta.dirname, "..", "src", "app.router.ts");
type Node = {
  router?: string;
} & {
  [key: string]: Node | string;
};

// rewrite lol
function getImportName(path: string) {
  return path
    .replace(/[^a-zA-Z\/\.]/g, "")
    .slice(2)
    .replace(/[.-]/g, "/")
    .split("/")
    .map((x) => x[0]?.toUpperCase() + x.slice(1))
    .join("");
}

type Imports = Array<[string, string]>;
type RouteTree = [Node, Imports];

export async function gen(dirname: string, prefix = "./"): Promise<RouteTree> {
  const entries = await fs.promises.readdir(dirname);

  const root: Node = {};
  let imports: Imports = [];

  for (const entry of entries) {
    const path = resolve(dirname, entry);
    const stat = await fs.promises.stat(path);

    if (stat.isDirectory()) {
      const [node, newImports] = await gen(path, prefix + entry + "/");
      imports = imports.concat(newImports);
      root[entry] = node;

      continue;
    }

    const imp = prefix + entry.replace(/\.ts$/, "");
    const routeName = getImportName(imp);

    if (entry == "router.ts") {
      root[entry.replace(/\.ts$/, "")] = routeName;
      imports.push([routeName, imp]);

      continue;
    }

    if (entry.endsWith("router.ts")) {
      root[entry.replace(/\.router\.ts$/, "")] = {
        router: routeName,
      };

      imports.push([routeName, imp]);
      continue;
    }
  }

  // console.log(imports.join("\n"));

  return [root, imports];
}

function compileCreateAppRouterArgs(n: Node): string {
  const keys = Object.keys(n);
  if (keys.length == 0) {
    return "t.router({})";
  }
  if (keys.includes("router")) {
    if (keys.length > 1) {
      const routerName = n.router;
      const newNode = n;
      delete newNode.router;

      return `t.mergeRouters(
       t.router(await ${routerName}(fastify)),
       ${compileCreateAppRouterArgs(newNode)}
    )
    `;
    }
    else {
      return `t.router(await ${n.router}(fastify))`;
    }
  }
  let code = "t.router({";
  for (const key of keys) {
    code += `  ${key}: ${compileCreateAppRouterArgs(n[key] as Node)},`;
  }

  code += "})";

  return code;
}

function compile(tree: RouteTree, json: string) {
  const [n, imps] = tree;

  return `// this file is generated
\`${json}\`
import { FastifyZod } from "fastify";
${imps.map(([name, path]) => `import ${name} from "${path}";`).join("\n")}

export async function createAppRouter(fastify: FastifyZod) {
  const { t } = fastify;

  return  ${compileCreateAppRouterArgs(n)}
}

export type AppRouter = Awaited<ReturnType<typeof createAppRouter>>;
`;
}

async function getLine(path: string, n: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const fileStream = fs.createReadStream(path);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let lineCount = 0;

      rl.on("line", (line) => {
        lineCount++;
        if (lineCount === n) {
          resolve(line);

          rl.close();
          fileStream.close();
        }
      });

      rl.on("close", () => {
        if (lineCount < n) {
          reject(new Error("Line not found"));
        }
      });
    }
    catch (e) {
      reject(e);
    }
  });
}

export async function updateRoutes() {
  const admin = await gen(resolve(import.meta.dirname, "admin"), "./admin/").catch(() => {
    return [{}, []] as RouteTree;
  });
  const web = await gen(resolve(import.meta.dirname, "web"), "./web/").catch(() => {
    return [{}, []] as RouteTree;
  });
  const imports = admin[1].concat(web[1]);

  const tree: RouteTree = [
    {
      admin: admin[0],
      web: web[0],
    },
    imports,
  ];

  const json = JSON.stringify(tree, null);
  const secondLine = await getLine(routesFile, 2)
    .catch(() => "")
    .then((json) => json.replace(/[`;]/g, ""));

  if (json === secondLine) {
    return;
  }

  console.log("updated routes");

  const r = compile(tree, json);

  const prettified = await prettier.format(r, {
    parser: "typescript",
  });

  fs.writeFileSync(routesFile, prettified);
  return;
}

import ReactDOM from "react-dom/client";
import type { AnyRouter } from "@tanstack/react-router";

import { createRouter } from "./router";
import { App } from "./App";

const router = createRouter();

function StartClient(props: { router: AnyRouter }) {
  if (!props.router.state.matches.length) {
    props.router.hydrate();
  }

  return <App router={props.router} />;
}

ReactDOM.hydrateRoot(document, <StartClient router={router} />);

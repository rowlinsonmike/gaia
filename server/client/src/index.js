import * as React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "serviceWorker";
import Theme, { theme } from "theme";
import App from "app";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <Theme>
    <Toaster
      position="top-center"
      reverseOrder={true}
      toastOptions={{
        style: {
          borderRadius: "10px",
          background: theme.palette.primary.light,
          color: theme.palette.text.primary,
        },
      }}
    />
    <App />
  </Theme>,
  document.getElementById("root")
);

serviceWorker.unregister();

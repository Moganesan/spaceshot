import { useMemo, useEffect } from "react";
import styles from "./styles.module.css";
import error from "../../../public/error.svg";
import warning from "../../../public/warning.svg";
import info from "../../../public/info.svg";
import success from "../../../public/success.svg";

export const Toast = ({ mode, onClose, message }) => {
  const classes = useMemo(() => [styles.toast, styles[mode]].join(" "), [mode]);

  useEffect(() => {
    console.log(mode);
  }, [mode]);

  return (
    <div onClick={onClose} className={classes}>
      <div>
        <img
          style={{ width: 30, marginRight: 10 }}
          src={
            mode == "error"
              ? error
              : mode == "warning"
              ? warning
              : mode == "info"
              ? info
              : mode == "success"
              ? success
              : null
          }
        />
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  );
};

import { useEffect, useState } from "react";
import DeviceDetector from "device-detector-js";

export function useDeviceName() {
  const [deviceName, setDeviceName] = useState<string>("");

  useEffect(() => {
    const detector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const device = detector.parse(userAgent);

    const brand = device.device?.brand || "";
    const model = device.device?.model || "";
    const osName = device.os?.name || "";
    const osVersion = device.os?.version || "";
    const browserName = device.client?.name || "";
    const browserVersion = device.client?.version || "";

    // Armar string
    const parts = [];

    if (brand || model) {
      parts.push(`${brand} ${model}`.trim());
    } else {
      parts.push("Dispositivo desconocido");
    }

    if (osName) {
      parts.push(`${osName} ${osVersion}`.trim());
    }

    if (browserName) {
      parts.push(`${browserName} ${browserVersion}`.trim());
    }

    setDeviceName(parts.join(" - "));
  }, []);

  return deviceName;
}

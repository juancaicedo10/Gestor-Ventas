import { useEffect, useState } from "react";
import DeviceDetector from "device-detector-js";

export function useDeviceName() {
  const [deviceName, setDeviceName] = useState<string>("");

  useEffect(() => {
    const detector = new DeviceDetector();
    const ua = navigator.userAgent;
    const device = detector.parse(ua);

    async function detect() {
      let brand = device.device?.brand || "";
      let model = device.device?.model || "";
      const osName = device.os?.name || "";
      const osVersion = device.os?.version || "";
      const browserName = device.client?.name || "";
      const browserVersion = device.client?.version || "";

      // En Chrome/Android probar con Client Hints
      if (!brand && !model && (navigator as any).userAgentData) {
        try {
          const data = await (navigator as any).userAgentData.getHighEntropyValues([
            "model",
            "platform"
          ]);
          if (data.model) {
            model = data.model;
          }
          if (data.platform && !osName) {
            // Si no se detectó OS, usar platform
            brand = data.platform;
          }
        } catch {
          // ignorar si falla
        }
      }

      const parts = [];

      if (brand || model) {
        parts.push(`${brand} ${model}`.trim());
      } else {
        // Si no hay marca/modelo, mostrar tipo
        const isMobile = /Mobi|Android/i.test(ua);
        parts.push(isMobile ? "Dispositivo móvil" : "PC / Laptop");
      }

      if (osName || osVersion) {
        parts.push(`${osName} ${osVersion}`.trim());
      }

      if (browserName || browserVersion) {
        parts.push(`${browserName} ${browserVersion}`.trim());
      }

      setDeviceName(parts.join(" - "));
    }

    detect();
  }, []);

  return deviceName;
}

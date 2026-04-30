import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type Props = {
  value: string;
  width?: number;
  height?: number;
  fontSize?: number;
  displayValue?: boolean;
  background?: string;
  lineColor?: string;
  format?: "CODE128" | "CODE39" | "EAN13";
};

export function Barcode({
  value,
  width = 1.6,
  height = 50,
  fontSize = 12,
  displayValue = true,
  background = "#ffffff",
  lineColor = "#000000",
  format = "CODE128",
}: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      JsBarcode(ref.current, value, {
        format,
        width,
        height,
        fontSize,
        displayValue,
        background,
        lineColor,
        margin: 4,
      });
    } catch {
      // ignore invalid values
    }
  }, [value, width, height, fontSize, displayValue, background, lineColor, format]);

  return <svg ref={ref} />;
}

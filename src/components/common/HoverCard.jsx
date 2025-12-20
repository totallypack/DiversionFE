import { useState } from "react";

export default function HoverCard({
  children,
  onClick,
  backgroundColor = "rgba(226, 226, 226, 0.8)",
  padding = "20px",
  borderRadius = "8px",
  borderWidth = "0px",
  borderColor = "transparent",
  hoverBorderColor,
  hoverTransform = "translateY(-3px)",
  hoverShadow = "0 6px 12px rgba(0,0,0,0.15)",
  height,
  className = "",
  style: customStyle = {},
}) {
  const [isHovered, setIsHovered] = useState(false);

  const finalBorderColor = isHovered && hoverBorderColor ? hoverBorderColor : borderColor;

  const style = {
    backgroundColor,
    padding,
    borderRadius,
    border: `${borderWidth} solid ${finalBorderColor}`,
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s",
    transform: isHovered ? hoverTransform : "translateY(0)",
    boxShadow: isHovered ? hoverShadow : "none",
    height,
    ...customStyle,
  };

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
    </div>
  );
}

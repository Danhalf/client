import { TooltipProps } from "primereact/tooltip";

const TOOLTIP_TAIL_BY_POSITION: Record<string, string> = {
    top: "tooltip-tail-bottom",
    bottom: "tooltip-tail-top",
    left: "tooltip-tail-right",
    right: "tooltip-tail-left",
    mouse: "tooltip-tail-top",
};

export const getTooltipTailClassName = (position: TooltipProps["position"] = "top"): string =>
    TOOLTIP_TAIL_BY_POSITION[position ?? "top"] ?? "tooltip-tail-bottom";

export const contactFormTooltipOptions = (options?: TooltipProps): TooltipProps => {
    const position = options?.position ?? "top";
    const tailClassName = getTooltipTailClassName(position);
    const className = [options?.className, tailClassName].filter(Boolean).join(" ");

    return {
        showOnDisabled: true,
        style: { maxWidth: "490px" },
        ...options,
        position,
        className,
    };
};

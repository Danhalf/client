import { useEffect, useId, useRef, useState } from "react";
import { Tooltip, TooltipProps } from "primereact/tooltip";

interface TruncatedTextProps {
    text: string;
    className?: string;
    width?: string;
    withTooltip?: boolean;
    tooltipOptions?: TooltipProps;
}

export const TruncatedText = ({
    text,
    className,
    width,
    withTooltip,
    tooltipOptions,
}: TruncatedTextProps) => {
    const [isTextTruncated, setIsTextTruncated] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);
    const uniqueId = useId();

    useEffect(() => {
        if (textRef.current) {
            const element = textRef.current;
            const isTruncated = element.scrollWidth > element.clientWidth;
            setIsTextTruncated(isTruncated);
        }
    }, [text]);

    return (
        <div
            ref={textRef}
            className={`truncated-text ${className ?? ""}`}
            data-tooltip-id={uniqueId}
            style={{ width: width ?? "100%" }}
        >
            {text}
            {isTextTruncated && withTooltip && (
                <Tooltip
                    {...tooltipOptions}
                    target={`[data-tooltip-id="${uniqueId}"]`}
                    content={tooltipOptions?.content || text}
                    position={tooltipOptions?.position || "mouse"}
                />
            )}
        </div>
    );
};

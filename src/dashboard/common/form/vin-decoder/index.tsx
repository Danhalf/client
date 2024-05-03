import { InputText, InputTextProps } from "primereact/inputtext";
import { ReactElement } from "react";

interface VINDecoderProps extends InputTextProps {
    vin: string;
}

export const VINDecoder = ({ vin }: VINDecoderProps): ReactElement => {
    return (
        <span className='p-float-label vin-decoder'>
            <InputText
                className={`vin-decoder__text-input w-full `}
                value={vin}
                onChange={({ target: { value } }) => {}}
            />
            <label className='float-label'>VIN (required)</label>
        </span>
    );
};

import { UploadMediaLink } from "common/models/inventory";
import { ReactElement } from "react";

export const MediaLinkRowExpansionTemplate = ({
    contenttype,
    notes,
}: Partial<UploadMediaLink>): ReactElement => {
    return (
        <>
            <div className='expanded-row'>
                <div className='expanded-row__label'>Category:</div>
                <div className='expanded-row__text'>{contenttype}</div>
            </div>
            <div className='expanded-row'>
                <div className='expanded-row__label'>Comment:</div>
                <div className='expanded-row__text'>{notes}</div>
            </div>
        </>
    );
};

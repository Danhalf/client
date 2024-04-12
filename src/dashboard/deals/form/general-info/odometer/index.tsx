import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";

export const DealGeneralOdometer = observer((): ReactElement => {
    return <div className='grid deal-general-odometer row-gap-2'></div>;
});

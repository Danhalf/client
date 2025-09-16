import { ReactElement, useEffect, useState } from "react";
import { Loader } from "dashboard/common/loader";
import { useStore } from "store/hooks";

export const SettingsExportWeb = (): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // handleGetUserHowKnowList();
    }, [authUser]);

    return (
        <div className='settings-form'>
            {isLoading && <Loader overlay />}
            <div className='settings-form__title'>Export to Web</div>
            <div className='grid settings-export-web p-2'>
                <div className='col-12'>
                    <div className='settings-export-web__header grid'>
                        <div className='col-10 flex settings-export-web__header-row align-items-center'>
                            Service
                        </div>
                        <div className='col-2 flex align-items-center p-0'>Key</div>
                    </div>
                    <div className='settings-export-web__body grid'></div>
                </div>
            </div>
        </div>
    );
};

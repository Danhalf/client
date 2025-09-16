import { ReactElement, useEffect, useState } from "react";
import { Loader } from "dashboard/common/loader";
import { useStore } from "store/hooks";
import { getUserExportWebList } from "http/services/settings.service";
import { ExportWebList } from "common/models/export-web";
import { useToastMessage } from "common/hooks";
import { BaseResponseError } from "common/models/base-response";

export const SettingsExportWeb = (): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const { showError } = useToastMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [exportWebList, setExportWebList] = useState<ExportWebList[]>([]);

    const isErrorResponse = (
        response: ExportWebList[] | BaseResponseError | undefined
    ): response is BaseResponseError => {
        return Boolean(response && "error" in response);
    };

    const handleGetUserExportWebList = async () => {
        setIsLoading(true);

        const response = await getUserExportWebList(authUser?.useruid);
        if (response && Array.isArray(response) && response.length) {
            setExportWebList(response);
            setIsLoading(false);
            return;
        }

        if (isErrorResponse(response)) {
            showError(response.error || "Unknown error occurred");
            setIsLoading(false);
            return;
        }

        const defaultExportWebList = await getUserExportWebList();
        if (
            defaultExportWebList &&
            Array.isArray(defaultExportWebList) &&
            defaultExportWebList.length
        ) {
            setExportWebList(defaultExportWebList);
        } else if (isErrorResponse(defaultExportWebList)) {
            showError(defaultExportWebList.error || "Unknown error occurred");
        } else {
            setExportWebList([]);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        handleGetUserExportWebList();
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
                    <div className='settings-export-web__body grid'>
                        {exportWebList.map((item) => (
                            <div className='col-12' key={item.itemuid}>
                                <div className='settings-export-web__body-row grid'>
                                    <div className='col-10'>{item.name}</div>
                                    <div className='col-2'>{item.itemuid}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
